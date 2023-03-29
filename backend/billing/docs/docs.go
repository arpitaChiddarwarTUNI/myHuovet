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
        "/billing/addBill": {
            "post": {
                "security": [
                    {
                        "ApiKeyAuth": []
                    }
                ],
                "description": "Insert new bill to the billing table in Huovet schema.",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Billing"
                ],
                "summary": "Add new bill to database",
                "parameters": [
                    {
                        "description": "query body",
                        "name": "request",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/models.BillAddJSON"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/models.Bill"
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
        "/billing/deleteBill/{appointment_id}": {
            "delete": {
                "security": [
                    {
                        "ApiKeyAuth": []
                    }
                ],
                "description": "Remove all the information of the bill.",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Billing"
                ],
                "summary": "Delete bill information",
                "parameters": [
                    {
                        "type": "integer",
                        "description": "Appointment ID",
                        "name": "appointment_id",
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
        "/billing/getBill/{appointment_id}": {
            "get": {
                "security": [
                    {
                        "ApiKeyAuth": []
                    }
                ],
                "description": "Get the information of the bill.",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Billing"
                ],
                "summary": "Get bill information",
                "parameters": [
                    {
                        "type": "integer",
                        "description": "Appointment ID",
                        "name": "appointment_id",
                        "in": "path",
                        "required": true
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Search success",
                        "schema": {
                            "type": "array",
                            "items": {
                                "$ref": "#/definitions/models.Bill"
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
        "/billing/modifyBill": {
            "put": {
                "security": [
                    {
                        "ApiKeyAuth": []
                    }
                ],
                "description": "Update the information of the bill.",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Billing"
                ],
                "summary": "Update bill information",
                "parameters": [
                    {
                        "description": "query body",
                        "name": "request",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/models.Bill"
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
        "models.Bill": {
            "type": "object",
            "properties": {
                "appointment_id": {
                    "type": "integer",
                    "example": 1
                },
                "bill_number": {
                    "type": "integer",
                    "example": 9876543
                },
                "due_date": {
                    "type": "string",
                    "example": "2022-10-20T10:00:00"
                },
                "examinations": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/models.GetExamination"
                    }
                },
                "paid": {
                    "type": "boolean",
                    "example": true
                },
                "service_price": {
                    "type": "number",
                    "example": 35
                },
                "supplies": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/models.GetSupply"
                    }
                }
            }
        },
        "models.BillAddJSON": {
            "type": "object",
            "properties": {
                "appointment_id": {
                    "type": "integer",
                    "example": 1
                },
                "due_date": {
                    "type": "string",
                    "example": "2022-10-20T10:00:00"
                },
                "examinations": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/models.Examination"
                    }
                },
                "paid": {
                    "type": "boolean",
                    "example": true
                },
                "service_price": {
                    "type": "number",
                    "example": 35
                },
                "supplies": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/models.Supply"
                    }
                }
            }
        },
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
        "models.Examination": {
            "type": "object",
            "properties": {
                "examination_type_id": {
                    "type": "integer",
                    "example": 1
                },
                "price": {
                    "type": "number",
                    "example": 30.99
                }
            }
        },
        "models.GetExamination": {
            "type": "object",
            "properties": {
                "examination_type_id": {
                    "type": "integer",
                    "example": 1
                },
                "name": {
                    "type": "string",
                    "example": "röntgen"
                },
                "price": {
                    "type": "number",
                    "example": 30.99
                }
            }
        },
        "models.GetSupply": {
            "type": "object",
            "properties": {
                "amount": {
                    "type": "integer",
                    "example": 3
                },
                "name": {
                    "type": "string",
                    "example": "laastari"
                },
                "price": {
                    "type": "number",
                    "example": 3.5
                },
                "supplies_id": {
                    "type": "integer",
                    "example": 1
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
                "amount": {
                    "type": "integer",
                    "example": 3
                },
                "price": {
                    "type": "number",
                    "example": 3.5
                },
                "supplies_id": {
                    "type": "integer",
                    "example": 1
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
	Host:             "localhost:5013",
	BasePath:         "/",
	Schemes:          []string{"http"},
	Title:            "Huovet billing API",
	Description:      "This App is used to control the bills. It can:\n- Add a new bill\n- Delete the bill\n- Modify the bill\n- Get the bill\n- Get all bills",
	InfoInstanceName: "swagger",
	SwaggerTemplate:  docTemplate,
}

func init() {
	swag.Register(SwaggerInfo.InstanceName(), SwaggerInfo)
}
