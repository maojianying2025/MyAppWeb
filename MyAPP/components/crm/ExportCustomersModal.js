import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
const FIELDS = [{
  key: "customer_name",
  label: "Customer Name"
}, {
  key: "code",
  label: "Customer Code"
}, {
  key: "region",
  label: "Region"
}, {
  key: "channel",
  label: "Channel"
}, {
  key: "sub_channel",
  label: "Sub-Channel"
}, {
  key: "follow_up_sss",
  label: "Follow-up SSS"
}, {
  key: "population",
  label: "Population"
}, {
  key: "address",
  label: "Address"
}, {
  key: "program",
  label: "Program"
}, {
  key: "contact_person",
  label: "Contact Person"
}, {
  key: "contact_phone",
  label: "Contact Phone"
}, {
  key: "contact_email",
  label: "Contact Email"
}];
export default function ExportCustomersModal({
  isOpen,
  onClose,
  onExport
}) {
  const [selectedFields, setSelectedFields] = useState(FIELDS.map(f => f.key));
  const toggleField = fieldKey => {
    setSelectedFields(prev => prev.includes(fieldKey) ? prev.filter(k => k !== fieldKey) : [...prev, fieldKey]);
  };
  const handleExport = () => {
    onExport(selectedFields);
  };
  return /*#__PURE__*/React.createElement(Dialog, {
    open: isOpen,
    onOpenChange: onClose
  }, /*#__PURE__*/React.createElement(DialogContent, null, /*#__PURE__*/React.createElement(DialogHeader, null, /*#__PURE__*/React.createElement(DialogTitle, null, "Export Customer Data")), /*#__PURE__*/React.createElement("div", {
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "Select fields to export:"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-2 mt-2"
  }, FIELDS.map(field => /*#__PURE__*/React.createElement("div", {
    key: field.key,
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(Checkbox, {
    checked: selectedFields.includes(field.key),
    onCheckedChange: () => toggleField(field.key)
  }), /*#__PURE__*/React.createElement("label", {
    className: "text-sm"
  }, field.label))))), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-end gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    type: "button",
    variant: "outline",
    onClick: onClose
  }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
    onClick: handleExport
  }, "Export as CSV")))));
}