package controller

import (
	"backend/model"
	"backend/repository"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

// @Summary Get all sprints
// @Tags Sprint
// @version 1.0
// @produce application/json
// @Success 200 {object} model.Sprint "success"
// @Router /api/v1/sprint [get]
// @Example 200 {object} model.Sprint
func GetAllSprint(c *gin.Context) {
	name := c.Query("name")
	sprint, err := repository.GetAllSprint(name)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"sprints": sprint})
}

func CreateSprint(c *gin.Context) {
    var sprint model.Sprint
    if err := c.Bind(&sprint); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"message": "無效的請求數據", "error": err.Error()})
        return
    }
    if err := repository.CreateSprint(&sprint); err != nil {
        if strings.Contains(err.Error(), "duplicate key value violates unique constraint") {
            c.JSON(http.StatusConflict, gin.H{"message": "Sprint 名稱已存在"})
        } else {
            c.JSON(http.StatusInternalServerError, gin.H{"message": "創建 Sprint 失敗", "error": err.Error()})
        }
        return
    }
    c.JSON(http.StatusCreated, gin.H{"sprint": sprint})
}

func UpdateSprint(c *gin.Context) {
    var sprint model.Sprint

    if err := c.Bind(&sprint); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
        return
    }

    if err := repository.UpdateSprint(&sprint); err != nil {
        c.JSON(http.StatusNotFound, gin.H{"message": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"sprint": sprint})
}

func DeleteSprint(c *gin.Context) {
	var sprint model.Sprint

	if err := repository.DeleteSprint(&sprint, c.Query("name")); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": err.Error()})
		return
	}
}