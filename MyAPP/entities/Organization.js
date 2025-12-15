{
  "name": "Organization",
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "Organization/Department name"
    },
    "type": {
      "type": "string",
      "enum": [
        "department",
        "channel",
        "subchannel"
      ],
      "description": "Organization type"
    },
    "parent_id": {
      "type": "string",
      "description": "Parent organization ID"
    }
  },
  "required": [
    "name",
    "type"
  ]
}