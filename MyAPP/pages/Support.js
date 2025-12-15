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
    mutationFn: (data) => base44.entities.Customer.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      setShowCreateCustomer(false);
    },
  });

  const handleCreateCustomer = (data) => {
    createCustomerMutation.mutate(data);
  };

  const handleImportCustomers = (file) => {
    console.log("Import file:", file);
    setShowImportCustomers(false);
  };

  const handleExportCustomers = (fields) => {
    console.log("Export fields:", fields);
    setShowExportCustomers(false);
  };

  const handleBulkEdit = (updates) => {
    console.log("Bulk update:", updates);
    setShowBulkEdit(false);
  };

  const handleICCIDCreate = (data) => {
    console.log("Create ICCID:", data);
    setShowCreateICCID(false);
  };

  const handleICCIDImport = (file) => {
    console.log("Import ICCID:", file);
    setShowImportICCID(false);
  };

  const handleICCIDExport = () => {
    console.log("Export ICCID");
    setShowExportICCID(false);
  };

  const handleICCIDBulkEdit = (updates) => {
    console.log("Bulk edit ICCID:", updates);
    setShowBulkEditICCID(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-3 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Support Center</h1>
          <p className="text-sm text-gray-600">Customer and ICCID data management</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Customer Management Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <UserCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">Customer Management</CardTitle>
                  <p className="text-sm text-gray-500">Create, import, export, and edit customers</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              <Button onClick={() => setShowCreateCustomer(true)} className="h-24 flex flex-col gap-2">
                <UserCircle className="w-6 h-6" />
                <span>Create</span>
              </Button>
              
              <Button onClick={() => setShowImportCustomers(true)} variant="outline" className="h-24 flex flex-col gap-2">
                <Upload className="w-6 h-6" />
                <span>Import</span>
              </Button>
              
              <Button onClick={() => setShowExportCustomers(true)} variant="outline" className="h-24 flex flex-col gap-2">
                <Download className="w-6 h-6" />
                <span>Export</span>
              </Button>
              
              <Button onClick={() => setShowBulkEdit(true)} variant="outline" className="h-24 flex flex-col gap-2">
                <Edit3 className="w-6 h-6" />
                <span>Bulk Edit</span>
              </Button>
            </CardContent>
          </Card>

          {/* ICCID Management Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">ICCID Management</CardTitle>
                  <p className="text-sm text-gray-500">Create, import, export, and edit ICCIDs</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              <Button onClick={() => setShowCreateICCID(true)} className="h-24 flex flex-col gap-2">
                <CreditCard className="w-6 h-6" />
                <span>Create</span>
              </Button>
              
              <Button onClick={() => setShowImportICCID(true)} variant="outline" className="h-24 flex flex-col gap-2">
                <Upload className="w-6 h-6" />
                <span>Import</span>
              </Button>
              
              <Button onClick={() => setShowExportICCID(true)} variant="outline" className="h-24 flex flex-col gap-2">
                <Download className="w-6 h-6" />
                <span>Export</span>
              </Button>
              
              <Button onClick={() => setShowBulkEditICCID(true)} variant="outline" className="h-24 flex flex-col gap-2">
                <Edit3 className="w-6 h-6" />
                <span>Bulk Edit</span>
              </Button>
            </CardContent>
          </Card>
        </div>



        <CreateCustomerModal
          isOpen={showCreateCustomer}
          onClose={() => setShowCreateCustomer(false)}
          onSubmit={handleCreateCustomer}
        />
        <ImportCustomersModal
          isOpen={showImportCustomers}
          onClose={() => setShowImportCustomers(false)}
          onImport={handleImportCustomers}
        />
        <ExportCustomersModal
          isOpen={showExportCustomers}
          onClose={() => setShowExportCustomers(false)}
          onExport={handleExportCustomers}
        />
        <BulkEditCustomersModal
          isOpen={showBulkEdit}
          onClose={() => setShowBulkEdit(false)}
          onSubmit={handleBulkEdit}
          selectedCount={0}
        />
      </div>
    </div>
  );
}