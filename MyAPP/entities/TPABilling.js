{
  "name": "TPABilling",
  "type": "object",
  "properties": {
    "tpa_id": {
      "type": "string",
      "description": "Related TPA ID"
    },
    "tpa_name": {
      "type": "string",
      "description": "TPA name"
    },
    "activity_session": {
      "type": "string",
      "description": "Activity session identifier"
    },
    "required_sellers": {
      "type": "number",
      "description": "Required sellers count"
    },
    "actual_sellers": {
      "type": "number",
      "description": "Actual sellers count"
    },
    "approved_sellers": {
      "type": "number",
      "description": "Approved sellers count"
    },
    "seller_rate": {
      "type": "number",
      "description": "Rate per seller"
    },
    "total_amount": {
      "type": "number",
      "description": "Total billing amount"
    },
    "status": {
      "type": "string",
      "enum": [
        "draft",
        "pending",
        "approved",
        "paid"
      ],
      "default": "draft"
    },
    "billing_date": {
      "type": "string",
      "format": "date"
    }
  },
  "required": [
    "tpa_id",
    "tpa_name",
    "activity_session"
  ]
}