package repository

import (
	"backend/model"
	"backend/sql"
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
    err = sql.Connect.Model(&model.Sprint{}).Where("id = ?", sprint.Id).Updates(sprint).Error
    return
}

func DeleteSprint(sprint *model.Sprint, name string) (err error) {
    err = sql.Connect.Where("id = ?", name).First(&sprint).Error
    if err != nil {
        return
    }
    err = sql.Connect.Delete(&sprint).Error
    return
}