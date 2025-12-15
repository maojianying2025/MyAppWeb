{
  "name": "Program",
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "Program name"
    },
    "organization": {
      "type": "string",
      "description": "Related organization"
    },
    "start_date": {
      "type": "string",
      "format": "date",
      "description": "Program start date"
    },
    "end_date": {
      "type": "string",
      "format": "date",
      "description": "Program end date"
    }
  },
  "required": [
    "name"
  ]
}