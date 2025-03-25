package repository

import (
	"backend/model"
	"backend/sql"
	"errors"
	"fmt"

	"gorm.io/gorm"
)

func GetTickets(sort string,ticketType string,statement string) (ticket []*model.Ticket,err error) {
	query := sql.Connect.Model(&model.Ticket{}).Preload("Members") // 加載 Members 關聯
	if sort != "" {
		query = query.Where("sort = ?", sort)
	}
	if ticketType != "" {
		query = query.Where("ticketType = ?", ticketType)
	}
	if statement != "" {
		query = query.Where("statement = ?", statement)
	}
	err = query.Find(&ticket).Error
	for _, ticket := range ticket {
		ticket.MembersIDs = nil
	}
	return
}
	
func CreateTicket(ticket *model.Ticket) (err error) {
	var members []model.Member
	if len(ticket.MembersIDs) > 0 { 
		err = sql.Connect.Where("id IN ?", ticket.MembersIDs).Find(&members).Error
		if err != nil {
			return err 
		}
		ticket.Members = members
	}
	err = sql.Connect.Create(ticket).Error
	return err
}

func UpdateTicket(ticket *model.Ticket) (err error) {
    var existingTicket model.Ticket
    if err = sql.Connect.Model(&model.Ticket{}).Where("id = ?", ticket.Id).First(&existingTicket).Error; err != nil {
        if errors.Is(err, gorm.ErrRecordNotFound) {
            return fmt.Errorf("ticket does not exist")
        }
        return
    }
    if len(ticket.MembersIDs) > 0 {
        var members []model.Member
        err = sql.Connect.Where("id IN ?", ticket.MembersIDs).Find(&members).Error
        if err != nil {
            return fmt.Errorf("failed to find members: %w", err)
        }
        err = sql.Connect.Model(&existingTicket).Association("Members").Replace(members)
        if err != nil {
            return fmt.Errorf("failed to update members association: %w", err)
        }
    }
	//upate other fields
    err = sql.Connect.Model(&model.Ticket{}).Where("id = ?", ticket.Id).Updates(ticket).Error
    if err != nil {
        return fmt.Errorf("failed to update ticket: %w", err)
    }

    return err
}

func DeleteTicket(id string) (err error) {
	var ticket model.Ticket
	err = sql.Connect.Where("id = ?",id).First(&ticket).Error
	if err != nil {
		if errors.Is(err,gorm.ErrRecordNotFound){
			return fmt.Errorf("ticket does not exist")
		}
		return
	}
	err = sql.Connect.Delete(&ticket).Error
	return
} 