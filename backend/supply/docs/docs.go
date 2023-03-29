// Package docs GENERATED BY SWAG; DO NOT EDIT
// This file was generated by swaggo/swag
package docs

import "github.com/swaggo/swag"

const docTemplate = `{
    "schemes": {{ marshal .Schemes }},
    "swagger": "2.0",
    "info": {
        "description": "{{escape .Description}}",
        "title": "{{.Title}}",
        "contact": {},
        "version": "{{.Version}}"
    },
    "host": "{{.Host}}",
    "basePath": "{{.BasePath}}",
    "paths": {
        "/supply/addSupply": {
            "post": {
                "security": [
                    {
                        "ApiKeyAuth": []
                    }
                ],
                "description": "Insert new supply to the supplies table in Huovet schema.",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Supply"
                ],
                "summary": "Add new supply to database",
                "parameters": [
                    {
                        "description": "query body",
                        "name": "request",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/models.SupplyAddJSON"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/models.Supply"
                        }
                    },
                    "401": {
                        "description": "Unauthentication",
                        "schema": {
                            "$ref": "#/definitions/models.UnathenticatedResponse"
                        }
                    }
                }
            }
        },
        "/supply/getAllSuppliesByParams": {
            "post": {
                "security": [
                    {
                        "ApiKeyAuth": []
                    }
                ],
                "description": "func for getting the list of all supplies based on supplies number or name.",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Supply"
                ],
                "summary": "func for getting the list of all supplies based on supplies number or name.",
                "parameters": [
                    {
                        "description": "query body",
                        "name": "request",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/models.SupplyGetJSON"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Search success",
                        "schema": {
                            "type": "array",
                            "items": {
                                "$ref": "#/definitions/models.Supply"
                            }
                        }
                    },
                    "401": {
                        "description": "Unauthentication",
                        "schema": {
                            "$ref": "#/definitions/models.UnathenticatedResponse"
                        }
                    }
                }
            }
        },
        "/supply/deleteSupply/{id}": {
            "delete": {
                "security": [
                    {
                        "ApiKeyAuth": []
                    }
                ],
                "description": "Remove all the information of the supply.",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Supply"
                ],
                "summary": "Delete supply information",
                "parameters": [
                    {
                        "type": "integer",
                        "description": "Supply ID",
                        "name": "id",
                        "in": "path",
                        "required": true
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Delete success",
                        "schema": {
                            "$ref": "#/definitions/models.DeleteResponse"
                        }
                    },
                    "400": {
                        "description": "Deleting fail",
                        "schema": {
                            "$ref": "#/definitions/models.DeleteFAilResponse"
                        }
                    },
                    "401": {
                        "description": "Unauthentication",
                        "schema": {
                            "$ref": "#/definitions/models.UnathenticatedResponse"
                        }
                    }
                }
            }
        },
        "/supply/getAllSupplies": {
            "get": {
                "security": [
                    {
                        "ApiKeyAuth": []
                    }
                ],
                "description": "Get all the information of the supplies.",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Supply"
                ],
                "summary": "Get all supplies information",
                "responses": {
                    "200": {
                        "description": "Search success",
                        "schema": {
                            "type": "array",
                            "items": {
                                "$ref": "#/definitions/models.Supply"
                            }
                        }
                    },
                    "400": {
                        "description": "searching fail",
                        "schema": {
                            "$ref": "#/definitions/models.SearchFailResponse"
                        }
                    },
                    "401": {
                        "description": "Unauthentication",
                        "schema": {
                            "$ref": "#/definitions/models.UnathenticatedResponse"
                        }
                    }
                }
            }
        },
        "/supply/modifySupply": {
            "put": {
                "security": [
                    {
                        "ApiKeyAuth": []
                    }
                ],
                "description": "Update the information of the supply.",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Supply"
                ],
                "summary": "Update supply information",
                "parameters": [
                    {
                        "description": "query body",
                        "name": "request",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/models.Supply"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Update success",
                        "schema": {
                            "$ref": "#/definitions/models.UpdateResponse"
                        }
                    },
                    "401": {
                        "description": "Unauthentication",
                        "schema": {
                            "$ref": "#/definitions/models.UnathenticatedResponse"
                        }
                    }
                }
            }
        }
    },
    "definitions": {
        "models.DeleteFAilResponse": {
            "type": "object",
            "properties": {
                "message": {
                    "type": "string",
                    "example": "deleting fail"
                }
            }
        },
        "models.DeleteResponse": {
            "type": "object",
            "properties": {
                "message": {
                    "type": "string",
                    "example": "delete success"
                }
            }
        },
        "models.SearchFailResponse": {
            "type": "object",
            "properties": {
                "message": {
                    "type": "string",
                    "example": "searching fail"
                }
            }
        },
        "models.Supply": {
            "type": "object",
            "properties": {
                "id": {
                    "type": "integer"
                },
                "number": {
                    "type": "string",
                    "example": "P001"
                },
                "name": {
                    "type": "string",
                    "example": "laastari"
                },
                "price": {
                    "type": "number",
                    "example": 3.5
                },
                "type": {
                    "type": "string",
                    "example": "medicine"
                },
                "unit": {
                    "type": "string",
                    "example": "ml"
                }
            }
        },
        "models.SupplyAddJSON": {
            "type": "object",
            "properties": {
                "name": {
                    "type": "string",
                    "example": "laastari"
                },
                "price": {
                    "type": "number",
                    "example": 3.5
                },
                "type": {
                    "type": "string",
                    "example": "medicine"
                },
                "unit": {
                    "type": "string",
                    "example": "ml"
                }
            }
        },
        "models.SupplyGetJSON": {
            "type": "object",
            "properties": {
                "param": {
                    "type": "string",
                    "example": "name or number"
                },
                "value": {
                    "type": "string",
                    "example": "Aspirine or P001"
                }
            }
        },
        "models.UnathenticatedResponse": {
            "type": "object",
            "properties": {
                "message": {
                    "type": "string",
                    "example": "unauthenticated"
                }
            }
        },
        "models.UpdateResponse": {
            "type": "object",
            "properties": {
                "message": {
                    "type": "string",
                    "example": "update success"
                }
            }
        }
    }
}`

// SwaggerInfo holds exported Swagger Info so clients can modify it
var SwaggerInfo = &swag.Spec{
	Version:          "1.0",
	Host:             "localhost:5008",
	BasePath:         "/",
	Schemes:          []string{"http"},
	Title:            "Huovet supply API",
	Description:      "This App is used to control the supply. It can:\n- Add a new supply\n- Delete the supply\n- Modify the supply\n- Get all supplies",
	InfoInstanceName: "swagger",
	SwaggerTemplate:  docTemplate,
}

func init() {
	swag.Register(SwaggerInfo.InstanceName(), SwaggerInfo)
}
