package controller

import (
	"backend/model"
	"backend/repository"
	"fmt"
	"strconv"
	"strings"

	"github.com/xuri/excelize/v2"
)

func fetchExportData(sprint string) ([]*model.Member, []*model.Sprint, []*model.CheckList, error) {
	membersData, err := repository.GetMembers("", "")
	if err != nil {
		return nil, nil, nil, err
	}
	sprintsData, err := repository.GetAllSprint(sprint)
	if err != nil {
		return nil, nil, nil, err
	}
	checklistData, err := repository.GetChecklistData(sprint)
	if err != nil {
		return nil, nil, nil, err
	}
	if len(sprintsData) == 0 {
		return nil, nil, nil, fmt.Errorf("sprints does not exist")
	}
	return membersData, sprintsData, checklistData, nil
}

func formatBar(f *excelize.File, sheet string, locate int) {
	style, _ := f.NewStyle(&excelize.Style{
		Font: &excelize.Font{
			Bold:   true,
			Family: "Arial",
			Size:   11,
			Color:  "#000",
		},
		Alignment: &excelize.Alignment{
			Horizontal: "center",
			Vertical:   "center",
		},
	})
	f.SetCellStyle(sheet, "A"+strconv.Itoa(locate), "E"+strconv.Itoa(locate), style)
	f.SetCellValue(sheet, "A"+strconv.Itoa(locate), "內部檢查項目")
	f.SetCellValue(sheet, "B"+strconv.Itoa(locate), "負責RD")
	f.SetCellValue(sheet, "C"+strconv.Itoa(locate), "commit ready?")
	f.SetCellValue(sheet, "D"+strconv.Itoa(locate), "查核人員")
	f.SetCellValue(sheet, "E"+strconv.Itoa(locate), "備註")
}
func TypeBar(f *excelize.File, sheet string, ticketType string, locate int) {
	start := "A" + strconv.Itoa(locate)
	end := "Z" + strconv.Itoa(locate)
	style, _ := f.NewStyle(&excelize.Style{
		Font: &excelize.Font{
			Bold:   true,
			Family: "Arial",
			Size:   12,
			Color:  "#000",
		},
		Fill: excelize.Fill{
			Type:    "pattern",
			Color:   []string{"#A9A9A9"},
			Pattern: 1,
		},
		Alignment: &excelize.Alignment{
			Horizontal: "left",
			Vertical:   "center",
		},
	})
	f.SetCellStyle(sheet, start, end, style)
	f.MergeCell(sheet, start, end)
	f.SetCellValue(sheet, start, ticketType)
	formatBar(f, sheet, locate+1) // Call formatBar function to set the header row below the ticket type row
	//format
}
func ReadySelectBox(f *excelize.File, sheet string, start int, end int) {
	BoxRange := "C" + strconv.Itoa(start) + ":C" + strconv.Itoa(end)
	dv := excelize.NewDataValidation(true)
	dv.Sqref = BoxRange //range
	dv.SetDropList([]string{"Ready", "Not Ready"})
	f.AddDataValidation(sheet, dv)
	NotReadyformat, _ := f.NewConditionalStyle(
		&excelize.Style{
			Font: &excelize.Font{Color: "9A0511"},
			Fill: excelize.Fill{
				Type: "pattern", Color: []string{"FEC7CE"}, Pattern: 1,
			},
		},
	)
	Readyformat, _ := f.NewConditionalStyle(
		&excelize.Style{
			Font: &excelize.Font{Color: "09600B"},
			Fill: excelize.Fill{
				Type: "pattern", Color: []string{"C7EECF"}, Pattern: 1,
			},
		},
	)
	f.SetConditionalFormat(sheet, BoxRange,
		[]excelize.ConditionalFormatOptions{
			{Type: "cell", Criteria: "==", Format: &NotReadyformat, Value: `"Not Ready"`},
			{Type: "cell", Criteria: "==", Format: &Readyformat, Value: `"Ready"`},
		},
	)
	style, _ := f.NewStyle(&excelize.Style{
		Border: []excelize.Border{
			{Type: "top", Color: "000000", Style: 1},
			{Type: "bottom", Color: "000000", Style: 1},
			{Type: "left", Color: "000000", Style: 1},
			{Type: "right", Color: "000000", Style: 1},
		},
		Fill: excelize.Fill{
			Type:    "pattern",
			Color:   []string{"#E0E0E0"}, // 背景顏色
			Pattern: 1,
		},
		Alignment: &excelize.Alignment{
			Horizontal: "center",
			Vertical:   "center",
		},
	})
	f.SetCellStyle(sheet, "C"+strconv.Itoa(start), "C"+strconv.Itoa(end), style)
}

func MemberSelectBox(f *excelize.File, sheet string, start int, end int, members []string) {
	BoxRange := "D" + strconv.Itoa(start) + ":D" + strconv.Itoa(end)
	dv := excelize.NewDataValidation(true)
	dv.Sqref = BoxRange //range
	dv.SetDropList(members)
	f.AddDataValidation(sheet, dv)
	style, _ := f.NewStyle(&excelize.Style{
		Border: []excelize.Border{
			{Type: "top", Color: "000000", Style: 1},
			{Type: "bottom", Color: "000000", Style: 1},
			{Type: "left", Color: "000000", Style: 1},
			{Type: "right", Color: "000000", Style: 1},
		},
		Fill: excelize.Fill{
			Type:    "pattern",
			Color:   []string{"#E0E0E0"}, // 背景顏色
			Pattern: 1,
		},
		Alignment: &excelize.Alignment{
			Horizontal: "center",
			Vertical:   "center",
		},
	})
	f.SetCellStyle(sheet, "D"+strconv.Itoa(start), "D"+strconv.Itoa(end), style)
}

func titleCell(f *excelize.File, sheet string, title string, url string, locate int) {
	locateCell := "A" + strconv.Itoa(locate)
	display, tooltip := url, title
	f.SetCellHyperLink(sheet, locateCell,
		url, "External", excelize.HyperlinkOpts{
			Display: &display,
			Tooltip: &tooltip,
		})
	style, _ := f.NewStyle(&excelize.Style{
		Font: &excelize.Font{Color: "1265BE", Underline: "single"},
	})

	f.SetCellStyle(sheet, locateCell, locateCell, style)
	f.SetCellValue(sheet, locateCell, tooltip)
}

func MemberCell(f *excelize.File, sheet string, members []string, locate int) {
	locateCell := "B" + strconv.Itoa(locate)
	style, _ := f.NewStyle(&excelize.Style{
		Alignment: &excelize.Alignment{
			Horizontal: "center",
			Vertical:   "center",
		},
	})
	mamberstext := strings.Join(members, " ,")
	f.SetCellStyle(sheet, locateCell, locateCell, style)
	f.SetCellValue(sheet, locateCell, mamberstext)
}
