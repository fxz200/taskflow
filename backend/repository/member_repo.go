package repository

import (
	"backend/model"
	"backend/sql"
	"errors"
	"fmt"

	"gorm.io/gorm"
)

func GetMembers(role string)(member []*model.Member,err error){
	if role != "" {
		err = sql.Connect.Where("role=?",role).Find(&member).Error
	}else{
		err = sql.Connect.Find(&member).Error
	}
	return
}

func CreateMember(member *model.Member)(err error){
	err = sql.Connect.Create(&member).Error
	return
}

func UpdateMember(member *model.Member)(err error){
	var existingMember model.Member
	if err = sql.Connect.Model(&model.Member{}).Where("name = ?",member.Name).First(&existingMember).Error; err != nil {
		if errors.Is(err,gorm.ErrRecordNotFound){
			return fmt.Errorf("no member found with name %s",member.Name)
		}
		return
	}
	err = sql.Connect.Model(&model.Member{}).Where("name = ?",member.Name).Updates(member).Error
	return
}

func DeleteMember(name string)(err error){
	var member model.Member
	err = sql.Connect.Where("name = ?",name).First(&member).Error
	if err != nil {
		if errors.Is(err,gorm.ErrRecordNotFound){
			return fmt.Errorf("no member found with name %s",name)
		}
		return
	}
	err = sql.Connect.Delete(&member).Error
	return
}