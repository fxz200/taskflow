package controller

import (
	"backend/model"
	"backend/repository"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

func GetMembers(c *gin.Context){
	role := c.Query("role")
	member,err := repository.GetMembers(role)
	if err !=nil{
		JSONResponse(c,http.StatusBadRequest,http.StatusBadRequest,nil,err.Error())
	}
	JSONResponse(c,http.StatusOK,http.StatusOK,member,"OK")
} 

func CreateMember(c *gin.Context){
	var member model.Member
	if err := c.Bind(&member); err != nil {
		JSONResponse(c, http.StatusBadRequest, http.StatusBadRequest, nil, err.Error())
		return
	}
	if err := repository.CreateMember(&member); err != nil {
		if strings.Contains(err.Error(), "duplicate key value violates unique constraint") && strings.Contains(err.Error(), "email") {
			JSONResponse(c, http.StatusConflict, http.StatusConflict, nil, "email already exists")
			return
		}
		if strings.Contains(err.Error(), "duplicate key value violates unique constraint") && strings.Contains(err.Error(), "name") {
			JSONResponse(c, http.StatusConflict, http.StatusConflict, nil, "name already exists")
			return
		}
		JSONResponse(c, http.StatusBadRequest, http.StatusBadRequest, nil, err.Error())
		return
	}
	JSONResponse(c, http.StatusOK, http.StatusOK, nil, "OK")
}

func UpdateMember(c *gin.Context){
	var member model.Member
	if err := c.Bind(&member); err != nil {
		JSONResponse(c, http.StatusBadRequest, http.StatusBadRequest, nil, err.Error())
		return
	}
	if err := repository.UpdateMember(&member); err != nil {
		if strings.Contains(err.Error(), "member does not exist") {
			JSONResponse(c, http.StatusBadRequest, http.StatusBadRequest, nil, "member not found")
			return
		}
		JSONResponse(c, http.StatusBadRequest, http.StatusBadRequest, nil, err.Error())
		return
	}
	JSONResponse(c, http.StatusOK, http.StatusOK, nil, "OK")
}

func DeleteMember(c *gin.Context){
	id := c.Query("id")
	err := repository.DeleteMember(id)
	if err != nil {
		if strings.Contains(err.Error(), "member does not exist") {
			JSONResponse(c, http.StatusBadRequest, http.StatusBadRequest, nil, "member not found")
			return
		}
		JSONResponse(c, http.StatusBadRequest, http.StatusBadRequest, nil, err.Error())
		return
	}
	JSONResponse(c, http.StatusOK, http.StatusOK, nil, "OK")

}