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
  const {
    data: iccids = [],
    isLoading
  } = useQuery({
    queryKey: ['iccids'],
    queryFn: () => base44.entities.ICCID.list('-created_date', 1000)
  });
  const {
    data: programs = []
  } = useQuery({
    queryKey: ['programs'],
    queryFn: () => base44.entities.Program.list('-created_date', 200)
  });
  const {
    data: customers = []
  } = useQuery({
    queryKey: ['customers'],
    queryFn: () => base44.entities.Customer.list('-created_date', 500)
  });
  const createMutation = useMutation({
    mutationFn: data => base44.entities.ICCID.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['iccids']
      });
      setIsDialogOpen(false);
      resetForm();
    }
  });
  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data
    }) => base44.entities.ICCID.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['iccids']
      });
      setIsDialogOpen(false);
      setEditingICCID(null);
      resetForm();
    }
  });
  const deleteMutation = useMutation({
    mutationFn: id => base44.entities.ICCID.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['iccids']
      });
    }
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
  const handleSubmit = e => {
    e.preventDefault();
    const dataToSubmit = {
      ...formData
    };
    if (formData.type === "MD") {
      delete dataToSubmit.customer_name;
      delete dataToSubmit.program;
    }
    if (editingICCID) {
      updateMutation.mutate({
        id: editingICCID.id,
        data: dataToSubmit
      });
    } else {
      createMutation.mutate(dataToSubmit);
    }
  };
  const startEdit = iccid => {
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
  const handleDelete = id => {
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
  const toggleSelectICCID = id => {
    setSelectedICCIDs(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };
  const handleImport = async e => {
    e.preventDefault();
    if (!file) return;

    // TODO: Implement CSV/Excel parsing and bulk import
    alert("Import functionality will be implemented");
    setIsImportOpen(false);
    setFile(null);
  };
  const handleExport = () => {
    const csvContent = [["ICCID", "Type", "Program", "Customer", "Department", "Channel", "Region"], ...iccids.map(i => [i.iccid, i.type, i.program || "", i.customer_name || "", i.department || "", i.channel || "", i.region || ""])].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], {
      type: "text/csv"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `iccids_${Date.now()}.csv`;
    a.click();
  };
  return /*#__PURE__*/React.createElement(Card, {
    className: "w-full"
  }, /*#__PURE__*/React.createElement(CardHeader, {
    className: "flex flex-row items-center justify-between p-4"
  }, /*#__PURE__*/React.createElement(CardTitle, {
    className: "text-lg"
  }, "ICCID Management"), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2 flex-wrap"
  }, /*#__PURE__*/React.createElement(Button, {
    onClick: () => {
      resetForm();
      setIsDialogOpen(true);
    },
    size: "sm"
  }, /*#__PURE__*/React.createElement(Plus, {
    className: "w-4 h-4 mr-2"
  }), "Add"), /*#__PURE__*/React.createElement(Button, {
    onClick: () => setIsImportOpen(true),
    size: "sm",
    variant: "outline"
  }, /*#__PURE__*/React.createElement(Upload, {
    className: "w-4 h-4 mr-2"
  }), "Import"), /*#__PURE__*/React.createElement(Button, {
    onClick: handleExport,
    size: "sm",
    variant: "outline"
  }, /*#__PURE__*/React.createElement(Download, {
    className: "w-4 h-4 mr-2"
  }), "Export"), selectedICCIDs.length > 0 && /*#__PURE__*/React.createElement(Button, {
    onClick: handleBulkDelete,
    size: "sm",
    variant: "destructive"
  }, /*#__PURE__*/React.createElement(Trash2, {
    className: "w-4 h-4 mr-2"
  }), "Delete (", selectedICCIDs.length, ")"))), /*#__PURE__*/React.createElement(CardContent, {
    className: "p-4"
  }, isLoading ? /*#__PURE__*/React.createElement("div", {
    className: "text-center py-8 text-gray-500"
  }, "Loading...") : iccids.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "text-center py-8 text-gray-500"
  }, "No ICCIDs configured") : /*#__PURE__*/React.createElement("div", {
    className: "overflow-x-auto"
  }, /*#__PURE__*/React.createElement("table", {
    className: "w-full"
  }, /*#__PURE__*/React.createElement("thead", {
    className: "bg-gray-50 border-b"
  }, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "p-2 text-left"
  }, /*#__PURE__*/React.createElement(Checkbox, {
    checked: selectedICCIDs.length === iccids.length,
    onCheckedChange: checked => {
      setSelectedICCIDs(checked ? iccids.map(i => i.id) : []);
    }
  })), /*#__PURE__*/React.createElement("th", {
    className: "p-2 text-left text-sm font-medium"
  }, "ICCID"), /*#__PURE__*/React.createElement("th", {
    className: "p-2 text-left text-sm font-medium"
  }, "Type"), /*#__PURE__*/React.createElement("th", {
    className: "p-2 text-left text-sm font-medium"
  }, "Program"), /*#__PURE__*/React.createElement("th", {
    className: "p-2 text-left text-sm font-medium"
  }, "Customer"), /*#__PURE__*/React.createElement("th", {
    className: "p-2 text-left text-sm font-medium"
  }, "Region"), /*#__PURE__*/React.createElement("th", {
    className: "p-2 text-right text-sm font-medium"
  }, "Actions"))), /*#__PURE__*/React.createElement("tbody", null, iccids.map(iccid => /*#__PURE__*/React.createElement("tr", {
    key: iccid.id,
    className: "border-b hover:bg-gray-50"
  }, /*#__PURE__*/React.createElement("td", {
    className: "p-2"
  }, /*#__PURE__*/React.createElement(Checkbox, {
    checked: selectedICCIDs.includes(iccid.id),
    onCheckedChange: () => toggleSelectICCID(iccid.id)
  })), /*#__PURE__*/React.createElement("td", {
    className: "p-2 text-sm"
  }, iccid.iccid), /*#__PURE__*/React.createElement("td", {
    className: "p-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: `text-xs px-2 py-1 rounded ${iccid.type === "A2P" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"}`
  }, iccid.type)), /*#__PURE__*/React.createElement("td", {
    className: "p-2 text-sm"
  }, iccid.program || "-"), /*#__PURE__*/React.createElement("td", {
    className: "p-2 text-sm"
  }, iccid.customer_name || "-"), /*#__PURE__*/React.createElement("td", {
    className: "p-2 text-sm"
  }, iccid.region || "-"), /*#__PURE__*/React.createElement("td", {
    className: "p-2 text-right"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex gap-1 justify-end"
  }, /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "ghost",
    onClick: () => startEdit(iccid)
  }, /*#__PURE__*/React.createElement(Edit, {
    className: "w-3 h-3"
  })), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "ghost",
    onClick: () => handleDelete(iccid.id)
  }, /*#__PURE__*/React.createElement(Trash2, {
    className: "w-3 h-3"
  })))))))))), /*#__PURE__*/React.createElement(Dialog, {
    open: isDialogOpen,
    onOpenChange: setIsDialogOpen
  }, /*#__PURE__*/React.createElement(DialogContent, {
    className: "max-w-2xl"
  }, /*#__PURE__*/React.createElement(DialogHeader, null, /*#__PURE__*/React.createElement(DialogTitle, null, editingICCID ? "Edit ICCID" : "Add ICCID")), /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit,
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "ICCID *"), /*#__PURE__*/React.createElement(Input, {
    value: formData.iccid,
    onChange: e => setFormData({
      ...formData,
      iccid: e.target.value
    }),
    required: true
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "Type *"), /*#__PURE__*/React.createElement(Select, {
    value: formData.type,
    onValueChange: value => setFormData({
      ...formData,
      type: value
    })
  }, /*#__PURE__*/React.createElement(SelectTrigger, null, /*#__PURE__*/React.createElement(SelectValue, null)), /*#__PURE__*/React.createElement(SelectContent, null, /*#__PURE__*/React.createElement(SelectItem, {
    value: "A2P"
  }, "A2P"), /*#__PURE__*/React.createElement(SelectItem, {
    value: "MD"
  }, "MD"))))), formData.type === "A2P" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "Program"), /*#__PURE__*/React.createElement(Select, {
    value: formData.program,
    onValueChange: value => {
      const selected = programs.find(p => p.id === value);
      setFormData({
        ...formData,
        program: value,
        program_name: selected?.name || ""
      });
    }
  }, /*#__PURE__*/React.createElement(SelectTrigger, null, /*#__PURE__*/React.createElement(SelectValue, {
    placeholder: "Select program"
  })), /*#__PURE__*/React.createElement(SelectContent, null, programs.map(p => /*#__PURE__*/React.createElement(SelectItem, {
    key: p.id,
    value: p.id
  }, p.name))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "Customer"), /*#__PURE__*/React.createElement(Select, {
    value: formData.customer_name,
    onValueChange: value => setFormData({
      ...formData,
      customer_name: value
    })
  }, /*#__PURE__*/React.createElement(SelectTrigger, null, /*#__PURE__*/React.createElement(SelectValue, {
    placeholder: "Select customer"
  })), /*#__PURE__*/React.createElement(SelectContent, null, customers.map(c => /*#__PURE__*/React.createElement(SelectItem, {
    key: c.id,
    value: c.customer_name
  }, c.customer_name))))))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-3 gap-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "Department"), /*#__PURE__*/React.createElement(Input, {
    value: formData.department,
    onChange: e => setFormData({
      ...formData,
      department: e.target.value
    })
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "Channel"), /*#__PURE__*/React.createElement(Input, {
    value: formData.channel,
    onChange: e => setFormData({
      ...formData,
      channel: e.target.value
    })
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "Region"), /*#__PURE__*/React.createElement(Input, {
    value: formData.region,
    onChange: e => setFormData({
      ...formData,
      region: e.target.value
    })
  }))), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-end gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    type: "button",
    variant: "outline",
    onClick: () => setIsDialogOpen(false)
  }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
    type: "submit"
  }, editingICCID ? "Update" : "Create"))))), /*#__PURE__*/React.createElement(Dialog, {
    open: isImportOpen,
    onOpenChange: setIsImportOpen
  }, /*#__PURE__*/React.createElement(DialogContent, null, /*#__PURE__*/React.createElement(DialogHeader, null, /*#__PURE__*/React.createElement(DialogTitle, null, "Import ICCIDs")), /*#__PURE__*/React.createElement("form", {
    onSubmit: handleImport,
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
    onChange: e => setFile(e.target.files[0]),
    className: "hidden",
    id: "iccid-file-upload"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "iccid-file-upload"
  }, /*#__PURE__*/React.createElement(Button, {
    type: "button",
    variant: "outline",
    onClick: () => document.getElementById('iccid-file-upload').click()
  }, "Select File")), file && /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-green-600 mt-2"
  }, "Selected: ", file.name)), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-end gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    type: "button",
    variant: "outline",
    onClick: () => setIsImportOpen(false)
  }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    disabled: !file
  }, "Import"))))));
}