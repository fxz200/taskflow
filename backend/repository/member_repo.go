package repository

import (
	"backend/model"
	"backend/sql"
	"errors"
	"fmt"

	"gorm.io/gorm"
)

func GetMembers(role string, id string) (member []*model.Member, err error) {
    query := sql.Connect.Model(&model.Member{})
    if role != "" {
        query = query.Where("role = ?", role)
    }
    if id != "" {
        query = query.Where("id = ?", id)
    }
    err = query.Find(&member).Error
    return
}

func CreateMember(member *model.Member)(err error){
	err = sql.Connect.Create(&member).Error
	return
}

func UpdateMember(member *model.Member)(err error){
	var existingMember model.Member
	fmt.Printf("UpdateMember: member.Id = %s\n", member.Id)
	if err = sql.Connect.Model(&model.Member{}).Where("id = ?",member.Id).First(&existingMember).Error; err != nil {
		if errors.Is(err,gorm.ErrRecordNotFound){
			return fmt.Errorf("member does not exist")
		}
		return
	}
	err = sql.Connect.Model(&model.Member{}).Where("id = ?",member.Id).Updates(member).Error
	return
}

func DeleteMember(id string)(err error){
	var member model.Member
	err = sql.Connect.Where("id = ?",id).First(&member).Error
	if err != nil {
		if errors.Is(err,gorm.ErrRecordNotFound){
			return fmt.Errorf("member does not exist")
		}
		return
	}
	err = sql.Connect.Delete(&member).Error
	return
}