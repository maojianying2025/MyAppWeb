import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserCircle, Upload, Download, Edit3, CreditCard } from "lucide-react";
import CreateCustomerModal from "../components/crm/CreateCustomerModal";
import ImportCustomersModal from "../components/crm/ImportCustomersModal";
import ExportCustomersModal from "../components/crm/ExportCustomersModal";
import BulkEditCustomersModal from "../components/crm/BulkEditCustomersModal";
import ICCIDManager from "../components/config/ICCIDManager";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
export default function Support() {
  const queryClient = useQueryClient();
  const [showCreateCustomer, setShowCreateCustomer] = useState(false);
  const [showImportCustomers, setShowImportCustomers] = useState(false);
  const [showExportCustomers, setShowExportCustomers] = useState(false);
  const [showBulkEdit, setShowBulkEdit] = useState(false);
  const [showCreateICCID, setShowCreateICCID] = useState(false);
  const [showImportICCID, setShowImportICCID] = useState(false);
  const [showExportICCID, setShowExportICCID] = useState(false);
  const [showBulkEditICCID, setShowBulkEditICCID] = useState(false);
  const createCustomerMutation = useMutation({
    mutationFn: data => base44.entities.Customer.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['customers']
      });
      setShowCreateCustomer(false);
    }
  });
  const handleCreateCustomer = data => {
    createCustomerMutation.mutate(data);
  };
  const handleImportCustomers = file => {
    console.log("Import file:", file);
    setShowImportCustomers(false);
  };
  const handleExportCustomers = fields => {
    console.log("Export fields:", fields);
    setShowExportCustomers(false);
  };
  const handleBulkEdit = updates => {
    console.log("Bulk update:", updates);
    setShowBulkEdit(false);
  };
  const handleICCIDCreate = data => {
    console.log("Create ICCID:", data);
    setShowCreateICCID(false);
  };
  const handleICCIDImport = file => {
    console.log("Import ICCID:", file);
    setShowImportICCID(false);
  };
  const handleICCIDExport = () => {
    console.log("Export ICCID");
    setShowExportICCID(false);
  };
  const handleICCIDBulkEdit = updates => {
    console.log("Bulk edit ICCID:", updates);
    setShowBulkEditICCID(false);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-3 md:p-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "max-w-7xl mx-auto"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-6"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "text-2xl md:text-3xl font-bold text-gray-900 mb-2"
  }, "Support Center"), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-gray-600"
  }, "Customer and ICCID data management")), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6"
  }, /*#__PURE__*/React.createElement(Card, {
    className: "hover:shadow-lg transition-shadow"
  }, /*#__PURE__*/React.createElement(CardHeader, {
    className: "pb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center"
  }, /*#__PURE__*/React.createElement(UserCircle, {
    className: "w-6 h-6 text-white"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(CardTitle, {
    className: "text-lg"
  }, "Customer Management"), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-gray-500"
  }, "Create, import, export, and edit customers")))), /*#__PURE__*/React.createElement(CardContent, {
    className: "grid grid-cols-2 gap-3"
  }, /*#__PURE__*/React.createElement(Button, {
    onClick: () => setShowCreateCustomer(true),
    className: "h-24 flex flex-col gap-2"
  }, /*#__PURE__*/React.createElement(UserCircle, {
    className: "w-6 h-6"
  }), /*#__PURE__*/React.createElement("span", null, "Create")), /*#__PURE__*/React.createElement(Button, {
    onClick: () => setShowImportCustomers(true),
    variant: "outline",
    className: "h-24 flex flex-col gap-2"
  }, /*#__PURE__*/React.createElement(Upload, {
    className: "w-6 h-6"
  }), /*#__PURE__*/React.createElement("span", null, "Import")), /*#__PURE__*/React.createElement(Button, {
    onClick: () => setShowExportCustomers(true),
    variant: "outline",
    className: "h-24 flex flex-col gap-2"
  }, /*#__PURE__*/React.createElement(Download, {
    className: "w-6 h-6"
  }), /*#__PURE__*/React.createElement("span", null, "Export")), /*#__PURE__*/React.createElement(Button, {
    onClick: () => setShowBulkEdit(true),
    variant: "outline",
    className: "h-24 flex flex-col gap-2"
  }, /*#__PURE__*/React.createElement(Edit3, {
    className: "w-6 h-6"
  }), /*#__PURE__*/React.createElement("span", null, "Bulk Edit")))), /*#__PURE__*/React.createElement(Card, {
    className: "hover:shadow-lg transition-shadow"
  }, /*#__PURE__*/React.createElement(CardHeader, {
    className: "pb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center"
  }, /*#__PURE__*/React.createElement(CreditCard, {
    className: "w-6 h-6 text-white"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(CardTitle, {
    className: "text-lg"
  }, "ICCID Management"), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-gray-500"
  }, "Create, import, export, and edit ICCIDs")))), /*#__PURE__*/React.createElement(CardContent, {
    className: "grid grid-cols-2 gap-3"
  }, /*#__PURE__*/React.createElement(Button, {
    onClick: () => setShowCreateICCID(true),
    className: "h-24 flex flex-col gap-2"
  }, /*#__PURE__*/React.createElement(CreditCard, {
    className: "w-6 h-6"
  }), /*#__PURE__*/React.createElement("span", null, "Create")), /*#__PURE__*/React.createElement(Button, {
    onClick: () => setShowImportICCID(true),
    variant: "outline",
    className: "h-24 flex flex-col gap-2"
  }, /*#__PURE__*/React.createElement(Upload, {
    className: "w-6 h-6"
  }), /*#__PURE__*/React.createElement("span", null, "Import")), /*#__PURE__*/React.createElement(Button, {
    onClick: () => setShowExportICCID(true),
    variant: "outline",
    className: "h-24 flex flex-col gap-2"
  }, /*#__PURE__*/React.createElement(Download, {
    className: "w-6 h-6"
  }), /*#__PURE__*/React.createElement("span", null, "Export")), /*#__PURE__*/React.createElement(Button, {
    onClick: () => setShowBulkEditICCID(true),
    variant: "outline",
    className: "h-24 flex flex-col gap-2"
  }, /*#__PURE__*/React.createElement(Edit3, {
    className: "w-6 h-6"
  }), /*#__PURE__*/React.createElement("span", null, "Bulk Edit"))))), /*#__PURE__*/React.createElement(CreateCustomerModal, {
    isOpen: showCreateCustomer,
    onClose: () => setShowCreateCustomer(false),
    onSubmit: handleCreateCustomer
  }), /*#__PURE__*/React.createElement(ImportCustomersModal, {
    isOpen: showImportCustomers,
    onClose: () => setShowImportCustomers(false),
    onImport: handleImportCustomers
  }), /*#__PURE__*/React.createElement(ExportCustomersModal, {
    isOpen: showExportCustomers,
    onClose: () => setShowExportCustomers(false),
    onExport: handleExportCustomers
  }), /*#__PURE__*/React.createElement(BulkEditCustomersModal, {
    isOpen: showBulkEdit,
    onClose: () => setShowBulkEdit(false),
    onSubmit: handleBulkEdit,
    selectedCount: 0
  })));
}