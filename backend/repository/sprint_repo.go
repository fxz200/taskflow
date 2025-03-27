package repository

import (
	"backend/model"
	"backend/sql"
	"errors"
	"fmt"

	"gorm.io/gorm"
)

func GetAllSprint(name string) (sprint []*model.Sprint, err error) {

	if name != "" {
		err = sql.Connect.Where("id = ?", name).Find(&sprint).Error
	}else{
		err = sql.Connect.Find(&sprint).Error
	}
	return
}

func CreateSprint(sprint *model.Sprint) (err error) {
	err = sql.Connect.Create(&sprint).Error
	return
}

func UpdateSprint(sprint *model.Sprint) (err error) {
    var existingSprint model.Sprint
    if err = sql.Connect.Model(&model.Sprint{}).Where("id = ?", sprint.Id).First(&existingSprint).Error; err != nil {
        if errors.Is(err, gorm.ErrRecordNotFound) {
            return fmt.Errorf("no sprint found with ID %s", sprint.Id)
        }
        return
    }
    err = sql.Connect.Model(&model.Sprint{}).Where("id = ?", sprint.Id).Updates(sprint).Error
    return
}
func DeleteSprint(sprint *model.Sprint, id string) (err error) {
    err = sql.Connect.Where("id = ?", id).First(&sprint).Error
    if err != nil {
        if errors.Is(err, gorm.ErrRecordNotFound) {
            return fmt.Errorf("no sprint found with ID %s", id)
        }
        return
    }
    err = sql.Connect.Unscoped().Delete(&sprint).Error
    return
}