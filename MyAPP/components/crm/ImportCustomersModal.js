import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
export default function ImportCustomersModal({
  isOpen,
  onClose,
  onImport
}) {
  const [file, setFile] = useState(null);
  const handleFileChange = e => {
    setFile(e.target.files[0]);
  };
  const handleSubmit = e => {
    e.preventDefault();
    if (file) {
      onImport(file);
      setFile(null);
    }
  };
  return /*#__PURE__*/React.createElement(Dialog, {
    open: isOpen,
    onOpenChange: onClose
  }, /*#__PURE__*/React.createElement(DialogContent, null, /*#__PURE__*/React.createElement(DialogHeader, null, /*#__PURE__*/React.createElement(DialogTitle, null, "Import Customers")), /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit,
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "border-2 border-dashed rounded-lg p-8 text-center"
  }, /*#__PURE__*/React.createElement(Upload, {
    className: "w-12 h-12 mx-auto mb-4 text-gray-400"
  }), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-gray-600 mb-2"
  }, "Upload CSV or Excel file"), /*#__PURE__*/React.createElement("input", {
    type: "file",
    accept: ".csv,.xlsx,.xls",
    onChange: handleFileChange,
    className: "hidden",
    id: "file-upload"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "file-upload"
  }, /*#__PURE__*/React.createElement(Button, {
    type: "button",
    variant: "outline",
    onClick: () => document.getElementById('file-upload').click()
  }, "Select File")), file && /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-green-600 mt-2"
  }, "Selected: ", file.name)), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-end gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    type: "button",
    variant: "outline",
    onClick: onClose
  }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    disabled: !file
  }, "Import")))));
}