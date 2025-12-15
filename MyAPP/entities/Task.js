{
  "name": "Task",
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "Task name"
    },
    "icon": {
      "type": "string",
      "description": "Icon name"
    },
    "icon_color": {
      "type": "string",
      "description": "Icon color"
    },
    "description": {
      "type": "string",
      "description": "Task description"
    },
    "modules": {
      "type": "array",
      "items": {
        "type": "object"
      },
      "description": "Task modules configuration"
    },
    "flow_config": {
      "type": "object",
      "description": "Flow configuration"
    },
    "assigned_to": {
      "type": "string",
      "description": "User email assigned to"
    },
    "status": {
      "type": "string",
      "enum": [
        "draft",
        "pending",
        "done",
        "cancelled"
      ],
      "default": "draft"
    },
    "customer": {
      "type": "string",
      "description": "Related customer"
    }
  },
  "required": [
    "name"
  ]
}