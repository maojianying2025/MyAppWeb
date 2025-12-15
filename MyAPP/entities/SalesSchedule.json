{
  "name": "SalesSchedule",
  "type": "object",
  "properties": {
    "customer_id": {
      "type": "string",
      "description": "Related customer ID"
    },
    "customer_name": {
      "type": "string",
      "description": "Customer name"
    },
    "region": {
      "type": "string",
      "description": "Region"
    },
    "channel": {
      "type": "string",
      "description": "Channel"
    },
    "date": {
      "type": "string",
      "format": "date",
      "description": "Schedule date"
    },
    "notes": {
      "type": "string",
      "description": "Notes"
    },
    "status": {
      "type": "string",
      "enum": [
        "planned",
        "completed",
        "cancelled"
      ],
      "default": "planned"
    }
  },
  "required": [
    "customer_id",
    "date"
  ]
}