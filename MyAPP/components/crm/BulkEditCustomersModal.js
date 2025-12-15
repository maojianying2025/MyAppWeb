import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
const REGIONS = ["Region A", "Region B", "Region C"];
const ROLES = ["Viewer", "TPA", "SSS", "Manager", "Head", "Director"];
export default function BulkEditCustomersModal({
  isOpen,
  onClose,
  onSubmit,
  selectedCount
}) {
  const [formData, setFormData] = useState({
    region: "",
    follow_up_sss: "",
    program: "",
    signal: ""
  });
  const handleSubmit = e => {
    e.preventDefault();
    const updates = {};
    Object.keys(formData).forEach(key => {
      if (formData[key]) {
        updates[key] = formData[key];
      }
    });
    onSubmit(updates);
    setFormData({
      region: "",
      follow_up_sss: "",
      program: "",
      signal: ""
    });
  };
  return /*#__PURE__*/React.createElement(Dialog, {
    open: isOpen,
    onOpenChange: onClose
  }, /*#__PURE__*/React.createElement(DialogContent, null, /*#__PURE__*/React.createElement(DialogHeader, null, /*#__PURE__*/React.createElement(DialogTitle, null, "Bulk Edit Customers (", selectedCount, " selected)")), /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit,
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-gray-600"
  }, "Only filled fields will be updated, empty fields will remain unchanged"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "Region"), /*#__PURE__*/React.createElement(Select, {
    value: formData.region,
    onValueChange: value => setFormData({
      ...formData,
      region: value
    })
  }, /*#__PURE__*/React.createElement(SelectTrigger, null, /*#__PURE__*/React.createElement(SelectValue, {
    placeholder: "Select region"
  })), /*#__PURE__*/React.createElement(SelectContent, null, REGIONS.map(region => /*#__PURE__*/React.createElement(SelectItem, {
    key: region,
    value: region
  }, region))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "Follow-up SSS"), /*#__PURE__*/React.createElement(Select, {
    value: formData.follow_up_sss,
    onValueChange: value => setFormData({
      ...formData,
      follow_up_sss: value
    })
  }, /*#__PURE__*/React.createElement(SelectTrigger, null, /*#__PURE__*/React.createElement(SelectValue, {
    placeholder: "Select role"
  })), /*#__PURE__*/React.createElement(SelectContent, null, ROLES.map(role => /*#__PURE__*/React.createElement(SelectItem, {
    key: role,
    value: role
  }, role))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "Program"), /*#__PURE__*/React.createElement(Input, {
    value: formData.program,
    onChange: e => setFormData({
      ...formData,
      program: e.target.value
    }),
    placeholder: "Enter program name"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "Signal Strength"), /*#__PURE__*/React.createElement(Input, {
    value: formData.signal,
    onChange: e => setFormData({
      ...formData,
      signal: e.target.value
    }),
    placeholder: "Enter signal strength"
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-end gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    type: "button",
    variant: "outline",
    onClick: onClose
  }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
    type: "submit"
  }, "Bulk Update")))));
}