package controller

import (
	"backend/model"
	"backend/repository"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

func JSONResponse(c *gin.Context, httpcode int, errorcode int, data interface{}, msg string) {
	c.JSON(httpcode, model.Response{
		Code: errorcode,
		Data: data,
		Msg:  msg,
	})
}
func GetAllSprint(c *gin.Context) {
	name := c.Query("name")
	sprint, err := repository.GetAllSprint(name)
	if err != nil {
		JSONResponse(c, http.StatusBadRequest, http.StatusBadRequest, nil, err.Error())
		return
	}
	data := map[string]interface{}{
		"sprints": sprint,
	}
	JSONResponse(c, http.StatusOK, http.StatusOK, data, "OK")
}
func CreateSprint(c *gin.Context) {
	var sprint model.Sprint
	if err := c.Bind(&sprint); err != nil {
		JSONResponse(c, http.StatusBadRequest, http.StatusBadRequest, nil, err.Error())
		return
	}
	if err := repository.CreateSprint(&sprint); err != nil {
		if strings.Contains(err.Error(), "duplicate key value violates unique constraint") {
			JSONResponse(c, http.StatusConflict, http.StatusConflict, nil, "sprint already exists")

		} else {
			JSONResponse(c, http.StatusBadRequest, http.StatusBadRequest, nil, err.Error())
		}
		return
	}
	JSONResponse(c, http.StatusOK, http.StatusOK, nil, "OK")
}

func UpdateSprint(c *gin.Context) {
	var sprint model.Sprint

	if err := c.Bind(&sprint); err != nil {
		JSONResponse(c, http.StatusBadRequest, http.StatusBadRequest, nil, err.Error())
		return
	}

	if err := repository.UpdateSprint(&sprint); err != nil {
		if strings.Contains(err.Error(), "no sprint found with ID") {
			JSONResponse(c, http.StatusBadRequest, http.StatusBadRequest, nil, "sprint not found")
		} else {
			JSONResponse(c, http.StatusBadRequest, http.StatusBadRequest, nil, err.Error())
		}
		return
	}
	JSONResponse(c, http.StatusOK, http.StatusOK, nil, "OK")
}

func DeleteSprint(c *gin.Context) {
	var sprint model.Sprint

	if err := repository.DeleteSprint(&sprint, c.Query("name")); err != nil {
		if strings.Contains(err.Error(), "no sprint found with ID") {
			JSONResponse(c, http.StatusBadRequest, http.StatusBadRequest, nil, "sprint not found")
			return
		} else {
			JSONResponse(c, http.StatusBadRequest, http.StatusBadRequest, nil, err.Error())
		}
		return
	}
	JSONResponse(c, http.StatusOK, http.StatusOK, nil, "OK")
}
