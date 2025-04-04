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

func formatBar(f *excelize.File, sheet string, locate int, formatType string) {
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
	headers := map[string][]string{
		"feature": {"內部檢查項目", "Owner團隊", "查核結果"},
		"AM":      {"外部公告檢查項目(AM用)", "Owner團隊", "查核結果"},
		"default": {"內部檢查項目", "負責RD", "commit ready?"},
	}
	header := headers[formatType]
	if header == nil {
		header = headers["default"]
	}
	f.SetSheetRow(sheet, "A"+strconv.Itoa(locate), &[]interface{}{header[0], header[1], header[2], "查核人員", "update time", "備註"})
	f.SetCellStyle(sheet, "A"+strconv.Itoa(locate), "F"+strconv.Itoa(locate), style)
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
}
func ReadySelectBox(f *excelize.File, sheet string, start int, end int, isfeature bool) {
	BoxRange := "C" + strconv.Itoa(start) + ":C" + strconv.Itoa(end)
	dv := excelize.NewDataValidation(true)
	dv.Sqref = BoxRange //range
	if isfeature {
		dv.SetDropList([]string{"通過", "未通過", "無須說明"})
	} else {
		dv.SetDropList([]string{"Ready", "Not Ready"})
	}
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
	format, _ := f.NewConditionalStyle(
		&excelize.Style{
			Font: &excelize.Font{Color: "000000"},
			Fill: excelize.Fill{
				Type: "pattern", Color: []string{"#E0E0E0"}, Pattern: 1,
			},
		},
	)
	f.SetConditionalFormat(sheet, BoxRange,
		[]excelize.ConditionalFormatOptions{
			{Type: "cell", Criteria: "==", Format: &NotReadyformat, Value: `"Not Ready"`},
			{Type: "cell", Criteria: "==", Format: &Readyformat, Value: `"Ready"`},
			{Type: "cell", Criteria: "==", Format: &NotReadyformat, Value: `"未通過"`},
			{Type: "cell", Criteria: "==", Format: &Readyformat, Value: `"通過"`},
			{Type: "cell", Criteria: "==", Format: &format, Value: `"無須說明"`},
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
		Font: &excelize.Font{
			Family: "Arial",
			Size:   11,
			Color:  "#000",
		},
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

func titleCell(f *excelize.File, sheet string, title string, url string, locate int, isFeature bool) {
	locateCell := "A" + strconv.Itoa(locate)
	display, tooltip := url, title
	f.SetCellHyperLink(sheet, locateCell,
		url, "External", excelize.HyperlinkOpts{
			Display: &display,
			Tooltip: &tooltip,
		})
	if isFeature {
		style, _ := f.NewStyle(&excelize.Style{
			Alignment: &excelize.Alignment{
				WrapText: true,
			},
		})
		f.SetCellRichText(sheet, locateCell, []excelize.RichTextRun{
			{
				Text: "預計上線的功能 : ",
				Font: &excelize.Font{
					Color:     "000000",
					Underline: "none",
					Family:    "Arial",
				},
			},
			{
				Text: title,
				Font: &excelize.Font{
					Color:     "1265BE",
					Underline: "single",
					Family:    "Arial",
				},
			},
		})
		f.SetCellStyle(sheet, locateCell, locateCell, style)
	} else {
		style, _ := f.NewStyle(&excelize.Style{
			Font: &excelize.Font{
				Color:     "1265BE",
				Underline: "single",
				Family:    "Arial"},
		})
		f.SetCellStyle(sheet, locateCell, locateCell, style)
		f.SetCellValue(sheet, locateCell, tooltip)
	}
}

func MemberCell(f *excelize.File, sheet string, members []string, locate int) {
	locateCell := "B" + strconv.Itoa(locate)
	style, _ := f.NewStyle(&excelize.Style{
		Alignment: &excelize.Alignment{
			Horizontal: "center",
			Vertical:   "center",
		},
		Font: &excelize.Font{
			Family: "Arial",
			Size:   11,
			Color:  "#000",
		},
	})
	mamberstext := strings.Join(members, " , ")
	f.SetCellStyle(sheet, locateCell, locateCell, style)
	f.SetCellValue(sheet, locateCell, mamberstext)
}

func ReleaseDateCell(f *excelize.File, sheet string, sprintdata *model.Sprint) {
	style, _ := f.NewStyle(&excelize.Style{
		Font: &excelize.Font{
			Family: "Arial",
			Size:   11,
			Color:  "#000",
		},
	})
	f.SetCellStyle(sheet, "A1", "A1", style)
	releaseDate := sprintdata.EndDate
	formattedDate := releaseDate.AddDate(0, 0, 1).Format("2006/1/2")
	time := "預計上線日期 :  " + formattedDate + " 2:00"
	f.SetCellValue(sheet, "A1", time)
}

// for feature & epic
func FeatureHead(f *excelize.File, sheet string, locate int, checklist *model.CheckList) {
	style, _ := f.NewStyle(&excelize.Style{
		Font: &excelize.Font{
			Family: "Arial",
			Size:   11,
			Color:  "#000",
		},
	})
	f.SetCellStyle(sheet, "A"+strconv.Itoa(locate), "A"+strconv.Itoa(locate), style)
	members := strings.Join(checklist.Members, " / ")
	memberFormat := "負責人 : " + members
	f.SetCellValue(sheet, "A"+strconv.Itoa(locate), memberFormat)
	titleCell(f, sheet, checklist.Title, checklist.JiraUrl, locate+1, true)
}

var FeatureBodyMaps = map[int][]string{
	1:  {"1.公告內容是否包含 更新範圍。", "PM"},
	2:  {"2.是否明確說明 時間。", "PM"},
	3:  {"3.是否描述 影響範圍（系統或流程影響）。", "RD"},
	4:  {"4.是否提供 解決方案或操作指引。", "PM"},
	5:  {"5.技術細節是否經過RD核對無誤（commit盤點）", "RD"},
	6:  {"6.是否完成測試並符合公告描述。", "QA"},
	7:  {"7.Data migrate Check", "QA"},
	10: {"1. 公告內容是否簡明易懂，符合外部客戶需求。", "AM"},
	11: {"2. 是否包含更新內容的 背景說明（更新原因）(如相關單位有提及)。", "PM"},
	12: {"3. 是否說明對 客戶的具體影響（包括風險與好處）(如相關單位有提及)。", "PM"},
	13: {"4. 更新範圍是否清楚表達（影響的功能或服務）(如相關單位有提及)。", "PM"},
	14: {"5. 是否提供 行動指引（例如需要客戶採取的步驟）(如相關單位有提及)。", "PM"},
	15: {"6. 是否確定公告發布的 時間 與 渠道。", "AM"},
}

func FeatureBody(f *excelize.File, sheet string, locate int, checklist *model.CheckList, memberList []string) {
	style, _ := f.NewStyle(&excelize.Style{
		Font: &excelize.Font{
			Family: "Arial",
			Size:   11,
			Color:  "#000",
		},
		Alignment: &excelize.Alignment{
			Horizontal: "center",
			Vertical:   "center",
		},
	})
	highLight, _ := f.NewStyle(&excelize.Style{
		Font: &excelize.Font{
			Family: "Arial",
			Size:   11,
			Color:  "#000",
		},
		Fill: excelize.Fill{
			Type:    "pattern",
			Color:   []string{"#FFFF00"},
			Pattern: 1,
		},
		Border: []excelize.Border{
			{Type: "top", Color: "#D9D9D9", Style: 1},
			{Type: "bottom", Color: "#D9D9D9", Style: 1},
			{Type: "left", Color: "#D9D9D9", Style: 1},
			{Type: "right", Color: "#D9D9D9", Style: 1},
		},
	})
	f.SetCellStyle(sheet, "B"+strconv.Itoa(locate+1), "B"+strconv.Itoa(locate+16), style)
	f.SetCellStyle(sheet, "A"+strconv.Itoa(locate+11), "A"+strconv.Itoa(locate+14), highLight)
	formatBar(f, sheet, locate, "feature")
	for id, body := range FeatureBodyMaps {
		ReadySelectBox(f, sheet, locate+id, locate+id, true)
		MemberSelectBox(f, sheet, locate+id, locate+id, memberList)
		f.SetCellValue(sheet, "A"+strconv.Itoa(locate+id), body[0])
		f.SetCellValue(sheet, "B"+strconv.Itoa(locate+id), body[1])
	}
	formatBar(f, sheet, locate+9, "AM")

}
