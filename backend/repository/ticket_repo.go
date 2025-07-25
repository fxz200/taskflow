package repository

import (
	"backend/model"
	"backend/sql"
	"errors"
	"fmt"

	"gorm.io/gorm"
)

type GetTicketQueryParams struct {
	Sprint       string
	TicketType   string
	Statement    string
	Search       string
	ReleaseSort  string
	PrioritySort string
	Type         string
	Status       string
	Priority     string
	MembersID    string
	Release      string
}

func GetTickets(params GetTicketQueryParams) (ticket []*model.Ticket, err error) {
	query := sql.Connect.Model(&model.Ticket{}).Preload("Members")
	if params.Sprint != "" {
		query = query.Where("sprint = ?", params.Sprint)
	}
	if params.TicketType != "" {
		query = query.Where("type = ?", params.TicketType)
	}
	if params.Statement != "" {
		query = query.Where("statement = ?", params.Statement)
	}
	if params.Search != "" {
		query = query.Where("title LIKE ? OR jira_url LIKE ?", "%"+params.Search+"%", "%"+params.Search+"%")
	}
	if params.ReleaseSort != "" {
		if params.ReleaseSort == "asc" {
			query = query.Order("sprint ASC")
		} else if params.ReleaseSort == "desc" {
			query = query.Order("sprint DESC")
		}
	}
	if params.PrioritySort != "" {
		if params.PrioritySort == "asc" {
			query = query.Order("priority ASC")
		} else if params.PrioritySort == "desc" {
			query = query.Order("priority DESC")
		}
	}
	if params.Status != "" {
		query = query.Where("status = ?", params.Status)
	}
	if params.Priority != "" {
		query = query.Where("priority = ?", params.Priority)
	}
	if params.MembersID != "" {
		query = query.Joins("JOIN ticket_members ON ticket_members.ticket_id = tickets.id").
			Where("ticket_members.member_id = ?", params.MembersID)
	}
	if params.Release != "" {
		query = query.Where("sprint = ?", params.Release)
	}
	err = query.Find(&ticket).Error
	for _, ticket := range ticket {
		ticket.MembersIDs = nil
	}
	return
}
func GetChecklistData(sprint string) (checklists []*model.CheckList, err error) {
	query := sql.Connect.Model(&model.Ticket{}).Preload("Members")
	query = query.Where("sprint = ?", sprint)
	query = query.Order("type ASC")
	ticket := []*model.Ticket{}
	err = query.Find(&ticket).Error
	// tickets => checklists
	for _, ticket := range ticket {
		checklist := &model.CheckList{
			Type:    ticket.Type,
			Title:   ticket.Title,
			JiraUrl: ticket.JiraUrl,
		}
		// mambers_name
		for _, member := range ticket.Members {
			if member.Role == 2 || member.Role == 3 {
				checklist.RDMembers = append(checklist.RDMembers, member.Name)
			}
			checklist.Members = append(checklist.Members, member.Name)
		}
		checklists = append(checklists, checklist)
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
		existingIDs := make(map[string]bool)
		for _, member := range members {
			existingIDs[member.Id] = true
		}
		var missingIDs []string
		for _, id := range ticket.MembersIDs {
			if !existingIDs[id] {
				missingIDs = append(missingIDs, id)
			}
		}
		if len(missingIDs) > 0 {
			return fmt.Errorf("the following member IDs do not exist: %v", missingIDs)
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
		existingIDs := make(map[string]bool)
		for _, member := range members {
			existingIDs[member.Id] = true
		}
		var missingIDs []string
		for _, id := range ticket.MembersIDs {
			if !existingIDs[id] {
				missingIDs = append(missingIDs, id)
			}
		}
		if len(missingIDs) > 0 {
			return fmt.Errorf("the following member IDs do not exist: %v", missingIDs)
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
func BatchUpdateTickets(ids []string, statement_type string) (err error) {
	if len(ids) == 0 {
		return fmt.Errorf("no ticket IDs provided")
	}

	tx := sql.Connect.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	if err := tx.Error; err != nil {
		return err
	}

	err = tx.Model(&model.Ticket{}).Where("id IN ?", ids).Update("statement", statement_type).Error
	if err != nil {
		tx.Rollback()
		return fmt.Errorf("failed to update tickets: %v", err)
	}

	return tx.Commit().Error
}

func DeleteTicket(ids []string) (err error) {
	if len(ids) == 0 {
		return fmt.Errorf("no ticket IDs provided")
	}

	tx := sql.Connect.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	if err := tx.Error; err != nil {
		return err
	}

	var count int64
	err = tx.Model(&model.Ticket{}).Where("id IN ?", ids).Count(&count).Error
	if err != nil {
		tx.Rollback()
		return fmt.Errorf("failed to check tickets existence: %v", err)
	}

	if count != int64(len(ids)) {
		tx.Rollback()
		return fmt.Errorf("some tickets do not exist")
	}

	err = tx.Table("ticket_members").Where("ticket_id IN ?", ids).Delete(nil).Error
	if err != nil {
		tx.Rollback()
		return fmt.Errorf("failed to delete related ticket members: %v", err)
	}

	err = tx.Unscoped().Where("id IN ?", ids).Delete(&model.Ticket{}).Error
	if err != nil {
		tx.Rollback()
		return fmt.Errorf("failed to delete tickets: %v", err)
	}

	return tx.Commit().Error
}
