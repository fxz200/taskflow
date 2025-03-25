package controller

import (
	"backend/model"
	"backend/repository"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)



func GetTickets(c *gin.Context) {
    sort := c.Query("sort")
    ticketType := c.Query("type")
    statement := c.Query("statement")
    tickets, err := repository.GetTickets(sort, ticketType, statement)
    if err != nil {
        JSONResponse(c, http.StatusInternalServerError, http.StatusInternalServerError, nil, err.Error())
        return
    }
	JSONResponse(c, http.StatusOK, http.StatusOK, tickets, "OK")
}
	
func CreateTicket(c *gin.Context)  {
	var ticket model.Ticket
	if err := c.Bind(&ticket); err != nil {
		JSONResponse(c, http.StatusBadRequest, http.StatusBadRequest, nil, err.Error())
		return
	}
	if err := repository.CreateTicket(&ticket); err != nil {
		if strings.Contains(err.Error(), "duplicate key value violates unique constraint") && strings.Contains(err.Error(), "title") {
			JSONResponse(c, http.StatusConflict, http.StatusConflict, nil, "title already exists")
			return
		}
		if strings.Contains(err.Error(), "duplicate key value violates unique constraint") && strings.Contains(err.Error(), "jira_url") {
			JSONResponse(c, http.StatusConflict, http.StatusConflict, nil, "jira url already exists")
			return
		}
		JSONResponse(c, http.StatusBadRequest, http.StatusBadRequest, nil, err.Error())
		return
	}
	JSONResponse(c, http.StatusOK, http.StatusOK, nil, "OK")
} 

func UpdateTicket(c *gin.Context)  {
	var ticket model.Ticket
	if err := c.Bind(&ticket); err != nil {
		JSONResponse(c, http.StatusBadRequest, http.StatusBadRequest, nil, err.Error())
		return
	}
	if err := repository.UpdateTicket(&ticket); err != nil {
		if strings.Contains(err.Error(), "ticket does not exist") {
			JSONResponse(c, http.StatusBadRequest, http.StatusBadRequest, nil, "ticket not found")
			return
		}
		JSONResponse(c, http.StatusBadRequest, http.StatusBadRequest, nil, err.Error())
		return
	}
	JSONResponse(c, http.StatusOK, http.StatusOK, nil, "OK")
} 

func DeleteTicket(c *gin.Context)  {
	id := c.Query("id")
	err := repository.DeleteTicket(id)
	if err != nil {
		if strings.Contains(err.Error(), "ticket does not exist") {
			JSONResponse(c, http.StatusBadRequest, http.StatusBadRequest, nil, "ticket not found")
			return
		}
		JSONResponse(c, http.StatusBadRequest, http.StatusBadRequest, nil, err.Error())
		return
	}
	JSONResponse(c, http.StatusOK, http.StatusOK, nil, "OK")
} 