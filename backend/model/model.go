package model

import (
	"time"

	"gorm.io/gorm"
)

//the test model

type Response struct {
	Code int `json:"code"`
	Data interface{} `json:"data"`
	Msg string `json:"msg"`
}
type Sprint struct {
	Id 	string `gorm:"primaryKey;not null;unique" json:"name" form:"name"  binding:"required" example:"ver2.55"`
	StartDate 	time.Time `json:"start_date" form:"start_date"  binding:"required" example:"2025-03-09T00:00:00Z"`
	EndDate 	time.Time `json:"end_date" form:"end_date" binding:"required" example:"2025-03-21T00:00:00Z"`
	Plan time.Time `json:"plan_date" form:"plan_date" example:"2025-03-21T00:00:00Z"`
	Test time.Time `json:"test_date" form:"test_date" example:"2025-03-21T00:00:00Z"`
	Retro time.Time `json:"retro_date" form:"retro_date" example:"2025-03-21T00:00:00Z"`
	gorm.Model `json:"-"`
}

type Member struct {
	Name 	string `gorm:"primaryKey;not null;unique" json:"name" form:"name"  binding:"required" `
	Role 	string `json:"role" form:"role"  binding:"required" `
	Email 	string `json:"email" form:"email"  binding:"required" `
}