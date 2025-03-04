// Package docs Code generated by swaggo/swag. DO NOT EDIT
package docs

import "github.com/swaggo/swag"

const docTemplate = `{
    "schemes": {{ marshal .Schemes }},
    "swagger": "2.0",
    "info": {
        "description": "{{escape .Description}}",
        "title": "{{.Title}}",
        "contact": {},
        "license": {
            "name": "Apache 2.0",
            "url": "http://www.apache.org/licenses/LICENSE-2.0.html"
        },
        "version": "{{.Version}}"
    },
    "host": "{{.Host}}",
    "basePath": "{{.BasePath}}",
    "paths": {
        "/api/message": {
            "get": {
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Test"
                ],
                "summary": "Test API",
                "responses": {
                    "200": {
                        "description": "Hello from Go backend!",
                        "schema": {
                            "$ref": "#/definitions/main.MessageResponse"
                        }
                    }
                }
            }
        }
    },
    "definitions": {
        "main.MessageResponse": {
            "type": "object",
            "properties": {
                "message": {
                    "type": "string",
                    "example": "Hello from Go backend!"
                }
            }
        }
    }
}`

// SwaggerInfo holds exported Swagger Info so clients can modify it
var SwaggerInfo = &swag.Spec{
	Version:          "1.0",
	Host:             "localhost:8080",
	BasePath:         "",
	Schemes:          []string{},
	Title:            "Taskflow swagger",
	Description:      "Taskflow swagger",
	InfoInstanceName: "swagger",
	SwaggerTemplate:  docTemplate,
	LeftDelim:        "{{",
	RightDelim:       "}}",
}

func init() {
	swag.Register(SwaggerInfo.InstanceName(), SwaggerInfo)
}
