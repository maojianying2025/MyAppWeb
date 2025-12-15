export const MODULE_LIBRARY = [{
  id: "channel",
  type: "channel",
  name: "Channel",
  icon: "Radio",
  description: "Select channel from organization",
  config: {
    required: false,
    visibleTo: ["all"]
  }
}, {
  id: "customer",
  type: "customer",
  name: "Customer",
  icon: "UserCircle",
  description: "Select customer with auto-filled region",
  config: {
    required: true,
    visibleTo: ["all"]
  }
}, {
  id: "date_range",
  type: "date_range",
  name: "Date Range",
  icon: "Calendar",
  description: "Select date range",
  config: {
    required: false,
    visibleTo: ["all"]
  }
}, {
  id: "priority",
  type: "priority",
  name: "Priority",
  icon: "AlertCircle",
  description: "Select priority level",
  config: {
    required: false,
    visibleTo: ["all"]
  }
}, {
  id: "note",
  type: "note",
  name: "Note",
  icon: "FileText",
  description: "Text area for notes",
  config: {
    required: false,
    visibleTo: ["all"]
  }
}, {
  id: "gps_location",
  type: "gps_location",
  name: "GPS Location",
  icon: "MapPin",
  description: "Upload GPS location (5 decimal places)",
  config: {
    required: false,
    visibleTo: ["all"]
  }
}, {
  id: "image_upload",
  type: "image_upload",
  name: "Image Upload",
  icon: "Image",
  description: "Upload image",
  config: {
    required: false,
    visibleTo: ["all"]
  }
}, {
  id: "seller_count",
  type: "seller_count",
  name: "Seller Count",
  icon: "Users",
  description: "Number of sellers required",
  config: {
    required: false,
    visibleTo: ["all"]
  }
}, {
  id: "iccid_sequence",
  type: "iccid_sequence",
  name: "ICCID Sequence",
  icon: "Hash",
  description: "ICCID number range generator",
  config: {
    required: false,
    visibleTo: ["all"]
  }
}, {
  id: "program_selector",
  type: "program_selector",
  name: "Program Selector",
  icon: "Target",
  description: "Select program from list",
  config: {
    required: false,
    visibleTo: ["all"]
  }
}, {
  id: "actual_sellers",
  type: "actual_sellers",
  name: "Actual Sellers",
  icon: "Users",
  description: "Input actual number of sellers",
  config: {
    required: false,
    visibleTo: ["all"]
  }
}, {
  id: "iccid_type",
  type: "iccid_type",
  name: "ICCID Type",
  icon: "Tag",
  description: "Select ICCID type (Free SIM/MD SIM)",
  config: {
    required: false,
    visibleTo: ["all"]
  }
}, {
  id: "tpa_selector",
  type: "tpa_selector",
  name: "TPA Selector",
  icon: "Users",
  description: "Select TPA from library",
  config: {
    required: false,
    visibleTo: ["all"]
  }
}];