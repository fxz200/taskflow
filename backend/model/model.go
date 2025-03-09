package model

import (
	"time"

	"gorm.io/gorm"
)

func (Message) TableName() string {
	return "message"
}
//the test model
type Message struct {
	Id        int    `gorm:"primary_key,type:INT;not null;AUTO_INCREMENT"`
	User_Id   int    `json:"User_Id"  binding:"required"`
	Content   string `json:"Content"  binding:"required"`
	Version   int    `gorm:"default:0"`
	// gorm.Model contain  CreatedAt &  UpdatedAt & DeletedAt column
    gorm.Model `json:"-"`
}

type Sprint struct {
	Id 	string `gorm:"primaryKey;not null;unique" json:"name" form:"name"  binding:"required" example:"ver2.55"`
	StartDate 	time.Time `json:"start_date" form:"start_date"  binding:"required" example:"2025-3-09T00:00:00Z"`
	EndDate 	time.Time `json:"end_date" form:"end_date" binding:"required" example:"2025-3-21T00:00:00Z"`
	Plan time.Time `json:"plan_date" form:"plan_date" example:"2025-3-21T00:00:00Z"`
	Test time.Time `json:"test_date" form:"test_date" example:"2025-3-21T00:00:00Z"`
	Retro time.Time `json:"retro_date" form:"retro_date" example:"2025-3-21T00:00:00Z"`
	gorm.Model `json:"-"`
}