package model

import "gorm.io/gorm"

func (Message) TableName() string {
	return "message"
}

type Message struct {
	Id        int    `gorm:"primary_key,type:INT;not null;AUTO_INCREMENT"`
	User_Id   int    `json:"User_Id"  binding:"required"`
	Content   string `json:"Content"  binding:"required"`
	Version   int    `gorm:"default:0"`
	// gorm.Model contain  CreatedAt &  UpdatedAt & DeletedAt column
    gorm.Model
}