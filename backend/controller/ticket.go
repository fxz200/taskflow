package controller

import (
	"backend/model"
	"backend/repository"
	"fmt"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/xuri/excelize/v2"
)

func GetTickets(c *gin.Context) {
	params := repository.GetTicketQueryParams{
		Sprint:       c.Query("sprint"),
		TicketType:   c.Query("type"),
		Statement:    c.Query("statement"),
		Search:       c.Query("search"),
		ReleaseSort:  c.Query("release_sort"),
		PrioritySort: c.Query("priority_sort"),
		Status:       c.Query("status"),
		Priority:     c.Query("priority"),
		MembersID:    c.Query("member_id"),
		Release:      c.Query("release"),
	}
	tickets, err := repository.GetTickets(params)
	if err != nil {
		JSONResponse(c, http.StatusInternalServerError, http.StatusInternalServerError, nil, err.Error())
		return
	}
	data := map[string]interface{}{
		"tickets": tickets,
	}
	JSONResponse(c, http.StatusOK, http.StatusOK, data, "OK")
}

func CreateTicket(c *gin.Context) {
	var ticket model.Ticket
	if err := c.Bind(&ticket); err != nil {
		JSONResponse(c, http.StatusBadRequest, http.StatusBadRequest, nil, err.Error())
		return
	}
	if err := repository.CreateTicket(&ticket); err != nil {
		if strings.Contains(err.Error(), "duplicate key value violates unique constraint") && strings.Contains(err.Error(), "title") {
			JSONResponse(c, http.StatusConflict, http.StatusConflict, nil, "title already exists")
			return
		}
		JSONResponse(c, http.StatusBadRequest, http.StatusBadRequest, nil, err.Error())
		return
	}
	JSONResponse(c, http.StatusOK, http.StatusOK, nil, "OK")
}

func UpdateTicket(c *gin.Context) {
	var ticket model.Ticket
	if err := c.Bind(&ticket); err != nil {
		JSONResponse(c, http.StatusBadRequest, http.StatusBadRequest, nil, err.Error())
		return
	}
	if err := repository.UpdateTicket(&ticket); err != nil {
		JSONResponse(c, http.StatusBadRequest, http.StatusBadRequest, nil, err.Error())
		return
	}
	JSONResponse(c, http.StatusOK, http.StatusOK, nil, "OK")
}
func BatchUpdateTicket(c *gin.Context) {
	updateType := c.Query("update_statement")
	var request struct {
		TickIDs []string `json:"ticket_ids"`
	}
	if err := c.ShouldBindJSON(&request); err != nil {
		JSONResponse(c, http.StatusBadRequest, http.StatusBadRequest, nil, "Invalid JSON format")
		return
	}
	if len(request.TickIDs) == 0 {
		JSONResponse(c, http.StatusBadRequest, http.StatusBadRequest, nil, "tick_ids are required")
		return
	}
	err := repository.BatchUpdateTickets(request.TickIDs, updateType)
	if err != nil {
		JSONResponse(c, http.StatusBadRequest, http.StatusBadRequest, nil, err.Error())
		return
	}
	JSONResponse(c, http.StatusOK, http.StatusOK, nil, "OK")
}
func DeleteTicket(c *gin.Context) {
	ids := c.QueryArray("id")
	if len(ids) == 0 {
		JSONResponse(c, http.StatusBadRequest, http.StatusBadRequest, nil, "at least one id is required")
		return
	}

	var validIDs []string
	for _, id := range ids {
		if strings.TrimSpace(id) != "" {
			validIDs = append(validIDs, strings.TrimSpace(id))
		}
	}

	if len(validIDs) == 0 {
		JSONResponse(c, http.StatusBadRequest, http.StatusBadRequest, nil, "valid ids are required")
		return
	}

	err := repository.DeleteTicket(validIDs)
	if err != nil {
		JSONResponse(c, http.StatusBadRequest, http.StatusBadRequest, nil, err.Error())
		return
	}
	JSONResponse(c, http.StatusOK, http.StatusOK, nil, "OK")
}

func ExportChecklist(c *gin.Context) {
	sprint := c.Query("sprint")
	memberdata, sprintdata, checklistdata, err := fetchExportData(sprint)
	if err != nil {
		JSONResponse(c, http.StatusBadRequest, http.StatusBadRequest, nil, err.Error())
		return
	}
	memberList := []string{}
	for _, member := range memberdata {
		memberList = append(memberList, member.Name)
	}
	checklistMap := map[int][]*model.CheckList{}
	for _, checklist := range checklistdata {
		checklistMap[int(checklist.Type)] = append(checklistMap[int(checklist.Type)], checklist)
	}
	sheet := "Sprint " + sprint
	f := excelize.NewFile()
	f.SetSheetName("Sheet1", sheet)
	f.SetColWidth(sheet, "A", "A", 90)
	f.SetColWidth(sheet, "B", "F", 30)
	ReleaseDateCell(f, sheet, sprintdata[0])
	typeNames := map[int]string{
		1: "New Feature",
		2: "Bug",
		3: "Imp",
		4: "Story",
		5: "Task",
		6: "Epic",
	}
	keys := []int{1, 6, 2, 3, 4, 5} //sort
	row := 2
	for _, id := range keys {
		typeName := typeNames[id]
		if len(checklistMap[id]) == 0 {
			continue
		}
		// 1 => "New Feature" 6 => "Epic"
		if id == 1 || id == 6 {
			for _, checklist := range checklistMap[id] {
				TypeBar(f, sheet, typeName, row)
				FeatureHead(f, sheet, row+1, checklist)
				FeatureBody(f, sheet, row+5, checklist, memberList)
				row += 22
			}
		} else {
			TypeBar(f, sheet, typeName, row)
			formatBar(f, sheet, row+1, "default")
			ReadySelectBox(f, sheet, row+2, row+2+len(checklistMap[id]), false)
			MemberSelectBox(f, sheet, row+2, row+2+len(checklistMap[id]), memberList)
			for _, checklist := range checklistMap[id] {
				titleCell(f, sheet, checklist.Title, checklist.JiraUrl, row+2, false)
				MemberCell(f, sheet, checklist.RDMembers, row+2)
				row++
			}
			row += 2
		}

	}
	//TODO: 後續功能
	TypeBar(f, sheet, "HotfixDoubleCheck", row)
	TypeBar(f, sheet, "RevertCheck", row+2)

	c.Header("Content-Disposition", `attachment; filename="CheckList.xlsx"`)
	c.Header("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
	c.Header("Cache-Control", "no-cache")
	c.Header("Pragma", "no-cache")
	if err := f.Write(c.Writer); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to write Excel file"})
		return
	}
}

func CopyCheckList(c *gin.Context) {
	sprint := c.Query("sprint")
	if sprint == "" {
		JSONResponse(c, http.StatusBadRequest, http.StatusBadRequest, nil, "sprint is required")
		return
	}
	tickets, err := repository.GetTickets(repository.GetTicketQueryParams{
		Sprint: sprint,
	})
	if err != nil {
		JSONResponse(c, http.StatusInternalServerError, http.StatusInternalServerError, nil, err.Error())
		return
	}
	if len(tickets) == 0 {
		JSONResponse(c, http.StatusBadRequest, http.StatusBadRequest, nil, "No tickets found for the specified sprint")
		return
	}
	text := "Checklist for sprint " + sprint
	typeMap := make(map[uint8][]model.Ticket)
	for _, ticket := range tickets {
		typeMap[ticket.Type] = append(typeMap[ticket.Type], *ticket)
	}
	typeNames := map[uint8]string{
		0: "System Maintaince",
		1: "New Feature",
		2: "Bug",
		3: "Improvement",
		4: "Story",
		5: "Task",
		6: "Epic",
	}
	for ticketType, groupedTickets := range typeMap {
		typeName := typeNames[ticketType]
		if typeName == "" {
			typeName = fmt.Sprintf("Type %d", ticketType)
		}
		text += fmt.Sprintf("\n%s\n", typeName)
		for _, ticket := range groupedTickets {
			text += fmt.Sprintf("%s %s\n", ticket.Title, ticket.JiraUrl)
		}
	}
	c.Header("Content-Type", "text/plain; charset=utf-8")
	JSONResponse(c, http.StatusOK, http.StatusOK, text, "OK")
}
