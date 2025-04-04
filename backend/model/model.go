package model

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

//the test model

type Response struct {
	Code int         `json:"code"`
	Data interface{} `json:"data"`
	Msg  string      `json:"msg"`
}
type Sprint struct {
	Id         string    `gorm:"primaryKey;not null;unique" json:"name" form:"name"  binding:"required" example:"ver2.55"`
	StartDate  time.Time `json:"start_date" form:"start_date"  binding:"required" example:"2025-03-09T00:00:00Z"`
	EndDate    time.Time `json:"end_date" form:"end_date" binding:"required" example:"2025-03-21T00:00:00Z"`
	Plan       time.Time `json:"plan_date" form:"plan_date" example:"2025-03-21T00:00:00Z"`
	Test       time.Time `json:"test_date" form:"test_date" example:"2025-03-21T00:00:00Z"`
	Retro      time.Time `json:"retro_date" form:"retro_date" example:"2025-03-21T00:00:00Z"`
	gorm.Model `json:"-"`
}

type Member struct {
	Id       string   `gorm:"primaryKey;not null;unique" json:"id" form:"id"`
	Name     string   `gorm:"not null;unique" json:"name" form:"name"  binding:"required" `
	Role     uint8    `json:"role" form:"role"  binding:"required" `
	IconType uint8    `json:"icon" form:"icon" `
	Email    string   `gorm:"unique" json:"email" form:"email"  binding:"required" `
	Tickets  []Ticket `gorm:"many2many:ticket_members;joinForeignKey:MemberID;joinReferences:TicketID" json:"-" `
}

func (m *Member) BeforeCreate(tx *gorm.DB) (err error) {
	if m.Id == "" {
		m.Id = uuid.New().String()
	}
	return
}

type Ticket struct {
	Id         string   `gorm:"primaryKey;not null;unique" json:"id" form:"id"`
	Type       uint8    `json:"type" form:"type"  binding:"required" `
	Piority    *uint8   `json:"piority" form:"piority"  binding:"required" `
	Title      string   `gorm:"not null;unique" json:"title" form:"title"  binding:"required" `
	Statement  uint8    `json:"statement" form:"statement"  binding:"required" `
	Status     uint8    `json:"status" form:"status" `
	JiraUrl    string   `json:"jira_url" form:"jira_url"  `
	Summery    string   `json:"summary" form:"summary"  `
	Members    []Member `gorm:"many2many:ticket_members;joinForeignKey:TicketID;joinReferences:MemberID" json:"members" form:"members"`
	MembersIDs []string `gorm:"-" json:"members_ids,omitempty"`
	Note       string   `json:"note" form:"note"`
	Sprint     string   `json:"sprint" form:"sprint"`
	gorm.Model `json:"-"`
}

func (t *Ticket) BeforeCreate(tx *gorm.DB) (err error) {
	if t.Id == "" {
		t.Id = uuid.New().String()
	}
	return
}

type CheckList struct {
	Type      uint8
	Title     string
	JiraUrl   string
	RDMembers []string
	Members   []string
}
