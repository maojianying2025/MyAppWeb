import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Save, Upload, Download } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Checkbox } from "@/components/ui/checkbox";

export default function ICCIDManager() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [editingICCID, setEditingICCID] = useState(null);
  const [selectedICCIDs, setSelectedICCIDs] = useState([]);
  const [formData, setFormData] = useState({
    iccid: "",
    type: "A2P",
    program: "",
    program_name: "",
    customer_name: "",
    department: "",
    channel: "",
    region: ""
  });
  const [file, setFile] = useState(null);

  const queryClient = useQueryClient();

  const { data: iccids = [], isLoading } = useQuery({
    queryKey: ['iccids'],
    queryFn: () => base44.entities.ICCID.list('-created_date', 1000),
  });

  const { data: programs = [] } = useQuery({
    queryKey: ['programs'],
    queryFn: () => base44.entities.Program.list('-created_date', 200),
  });

  const { data: customers = [] } = useQuery({
    queryKey: ['customers'],
    queryFn: () => base44.entities.Customer.list('-created_date', 500),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.ICCID.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['iccids'] });
      setIsDialogOpen(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.ICCID.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['iccids'] });
      setIsDialogOpen(false);
      setEditingICCID(null);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.ICCID.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['iccids'] });
    },
  });

  const resetForm = () => {
    setFormData({
      iccid: "",
      type: "A2P",
      program: "",
      program_name: "",
      customer_name: "",
      department: "",
      channel: "",
      region: ""
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSubmit = { ...formData };
    if (formData.type === "MD") {
      delete dataToSubmit.customer_name;
      delete dataToSubmit.program;
    }
    
    if (editingICCID) {
      updateMutation.mutate({ id: editingICCID.id, data: dataToSubmit });
    } else {
      createMutation.mutate(dataToSubmit);
    }
  };

  const startEdit = (iccid) => {
    setEditingICCID(iccid);
    setFormData({
      iccid: iccid.iccid,
      type: iccid.type,
      program: iccid.program || "",
      program_name: iccid.program_name || "",
      customer_name: iccid.customer_name || "",
      department: iccid.department || "",
      channel: iccid.channel || "",
      region: iccid.region || ""
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this ICCID?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleBulkDelete = () => {
    if (selectedICCIDs.length === 0) return;
    if (confirm(`Are you sure you want to delete ${selectedICCIDs.length} ICCIDs?`)) {
      selectedICCIDs.forEach(id => deleteMutation.mutate(id));
      setSelectedICCIDs([]);
    }
  };

  const toggleSelectICCID = (id) => {
    setSelectedICCIDs(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleImport = async (e) => {
    e.preventDefault();
    if (!file) return;
    
    // TODO: Implement CSV/Excel parsing and bulk import
    alert("Import functionality will be implemented");
    setIsImportOpen(false);
    setFile(null);
  };

  const handleExport = () => {
    const csvContent = [
      ["ICCID", "Type", "Program", "Customer", "Department", "Channel", "Region"],
      ...iccids.map(i => [
        i.iccid,
        i.type,
        i.program || "",
        i.customer_name || "",
        i.department || "",
        i.channel || "",
        i.region || ""
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `iccids_${Date.now()}.csv`;
    a.click();
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between p-4">
        <CardTitle className="text-lg">ICCID Management</CardTitle>
        <div className="flex gap-2 flex-wrap">
          <Button onClick={() => { resetForm(); setIsDialogOpen(true); }} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
          <Button onClick={() => setIsImportOpen(true)} size="sm" variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button onClick={handleExport} size="sm" variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          {selectedICCIDs.length > 0 && (
            <Button onClick={handleBulkDelete} size="sm" variant="destructive">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete ({selectedICCIDs.length})
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {isLoading ? (
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : iccids.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No ICCIDs configured</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-2 text-left">
                    <Checkbox
                      checked={selectedICCIDs.length === iccids.length}
                      onCheckedChange={(checked) => {
                        setSelectedICCIDs(checked ? iccids.map(i => i.id) : []);
                      }}
                    />
                  </th>
                  <th className="p-2 text-left text-sm font-medium">ICCID</th>
                  <th className="p-2 text-left text-sm font-medium">Type</th>
                  <th className="p-2 text-left text-sm font-medium">Program</th>
                  <th className="p-2 text-left text-sm font-medium">Customer</th>
                  <th className="p-2 text-left text-sm font-medium">Region</th>
                  <th className="p-2 text-right text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {iccids.map((iccid) => (
                  <tr key={iccid.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">
                      <Checkbox
                        checked={selectedICCIDs.includes(iccid.id)}
                        onCheckedChange={() => toggleSelectICCID(iccid.id)}
                      />
                    </td>
                    <td className="p-2 text-sm">{iccid.iccid}</td>
                    <td className="p-2">
                      <span className={`text-xs px-2 py-1 rounded ${
                        iccid.type === "A2P" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"
                      }`}>
                        {iccid.type}
                      </span>
                    </td>
                    <td className="p-2 text-sm">{iccid.program || "-"}</td>
                    <td className="p-2 text-sm">{iccid.customer_name || "-"}</td>
                    <td className="p-2 text-sm">{iccid.region || "-"}</td>
                    <td className="p-2 text-right">
                      <div className="flex gap-1 justify-end">
                        <Button size="sm" variant="ghost" onClick={() => startEdit(iccid)}>
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDelete(iccid.id)}>
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingICCID ? "Edit ICCID" : "Add ICCID"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>ICCID *</Label>
                <Input
                  value={formData.iccid}
                  onChange={(e) => setFormData({ ...formData, iccid: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A2P">A2P</SelectItem>
                    <SelectItem value="MD">MD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {formData.type === "A2P" && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Program</Label>
                    <Select
                      value={formData.program}
                      onValueChange={(value) => {
                        const selected = programs.find(p => p.id === value);
                        setFormData({ 
                          ...formData, 
                          program: value,
                          program_name: selected?.name || ""
                        });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select program" />
                      </SelectTrigger>
                      <SelectContent>
                        {programs.map(p => (
                          <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Customer</Label>
                    <Select
                      value={formData.customer_name}
                      onValueChange={(value) => setFormData({ ...formData, customer_name: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select customer" />
                      </SelectTrigger>
                      <SelectContent>
                        {customers.map(c => (
                          <SelectItem key={c.id} value={c.customer_name}>{c.customer_name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </>
            )}

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Department</Label>
                <Input
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                />
              </div>
              <div>
                <Label>Channel</Label>
                <Input
                  value={formData.channel}
                  onChange={(e) => setFormData({ ...formData, channel: e.target.value })}
                />
              </div>
              <div>
                <Label>Region</Label>
                <Input
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">{editingICCID ? "Update" : "Create"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import ICCIDs</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleImport} className="space-y-4">
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-sm text-gray-600 mb-2">Upload CSV or Excel file</p>
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={(e) => setFile(e.target.files[0])}
                className="hidden"
                id="iccid-file-upload"
              />
              <label htmlFor="iccid-file-upload">
                <Button type="button" variant="outline" onClick={() => document.getElementById('iccid-file-upload').click()}>
                  Select File
                </Button>
              </label>
              {file && <p className="text-sm text-green-600 mt-2">Selected: {file.name}</p>}
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsImportOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={!file}>
                Import
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}