package controller

import (
	"backend/model"
	"backend/repository"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/xuri/excelize/v2"
)

func GetTickets(c *gin.Context) {
	sprint := c.Query("sprint")
	ticketType := c.Query("type")
	statement := c.Query("statement")
	tickets, err := repository.GetTickets(sprint, ticketType, statement)
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

func DeleteTicket(c *gin.Context) {
	id := c.Query("id")
	err := repository.DeleteTicket(id)
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
