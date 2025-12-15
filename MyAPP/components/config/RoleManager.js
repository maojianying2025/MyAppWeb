import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Shield, Save } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
const LEVEL_COLORS = ["#94A3B8", "#60A5FA", "#34D399", "#FBBF24", "#FB923C", "#F87171", "#C084FC", "#DC2626"];
export default function RoleManager() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    level: 0,
    color: "#94A3B8"
  });
  const {
    data: roles = [],
    isLoading
  } = useQuery({
    queryKey: ['roles'],
    queryFn: () => base44.entities.Role.list()
  });
  const createMutation = useMutation({
    mutationFn: data => base44.entities.Role.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['roles']
      });
      setIsDialogOpen(false);
      setFormData({
        name: "",
        level: 0,
        color: "#94A3B8"
      });
    }
  });
  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data
    }) => base44.entities.Role.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['roles']
      });
      setEditingRole(null);
      setIsDialogOpen(false);
    }
  });
  const deleteMutation = useMutation({
    mutationFn: id => base44.entities.Role.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['roles']
      });
    }
  });
  const handleSubmit = e => {
    e.preventDefault();
    if (editingRole) {
      updateMutation.mutate({
        id: editingRole.id,
        data: formData
      });
    } else {
      createMutation.mutate(formData);
    }
  };
  const startEdit = role => {
    setEditingRole(role);
    setFormData({
      name: role.name,
      level: role.level,
      color: role.color
    });
    setIsDialogOpen(true);
  };
  const handleDelete = id => {
    if (confirm("Are you sure you want to delete this role?")) {
      deleteMutation.mutate(id);
    }
  };
  return /*#__PURE__*/React.createElement(Card, {
    className: "w-full"
  }, /*#__PURE__*/React.createElement(CardHeader, {
    className: "flex flex-row items-center justify-between p-4"
  }, /*#__PURE__*/React.createElement(CardTitle, {
    className: "text-lg"
  }, "Role Management"), /*#__PURE__*/React.createElement(Button, {
    onClick: () => {
      setEditingRole(null);
      setFormData({
        name: "",
        level: 0,
        color: "#94A3B8"
      });
      setIsDialogOpen(true);
    },
    size: "sm"
  }, /*#__PURE__*/React.createElement(Plus, {
    className: "w-4 h-4 mr-2"
  }), "Add")), /*#__PURE__*/React.createElement(CardContent, {
    className: "p-4"
  }, isLoading ? /*#__PURE__*/React.createElement("div", {
    className: "text-center py-8"
  }, "Loading...") : roles.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "text-center py-8 text-gray-500"
  }, "No roles yet. Click Add to create one.") : /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-2 gap-3"
  }, roles.map(role => /*#__PURE__*/React.createElement(Card, {
    key: role.id,
    className: "border hover:shadow-md transition-shadow"
  }, /*#__PURE__*/React.createElement(CardContent, {
    className: "p-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 mb-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
    style: {
      backgroundColor: role.color
    }
  }, /*#__PURE__*/React.createElement(Shield, {
    className: "w-4 h-4 text-white"
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 min-w-0"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "font-semibold text-sm truncate"
  }, role.name), /*#__PURE__*/React.createElement(Badge, {
    variant: "outline",
    className: "text-xs mt-1"
  }, "Level ", role.level))), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "outline",
    onClick: () => startEdit(role),
    className: "flex-1"
  }, /*#__PURE__*/React.createElement(Edit, {
    className: "w-3 h-3"
  })), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "destructive",
    onClick: () => handleDelete(role.id),
    className: "flex-1"
  }, /*#__PURE__*/React.createElement(Trash2, {
    className: "w-3 h-3"
  })))))))), /*#__PURE__*/React.createElement(Dialog, {
    open: isDialogOpen,
    onOpenChange: setIsDialogOpen
  }, /*#__PURE__*/React.createElement(DialogContent, null, /*#__PURE__*/React.createElement(DialogHeader, null, /*#__PURE__*/React.createElement(DialogTitle, null, editingRole ? "Edit Role" : "Add Role")), /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit,
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "text-sm font-medium mb-2 block"
  }, "Role Name"), /*#__PURE__*/React.createElement(Input, {
    value: formData.name,
    onChange: e => setFormData({
      ...formData,
      name: e.target.value
    }),
    required: true
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "text-sm font-medium mb-2 block"
  }, "Role Level (0-7)"), /*#__PURE__*/React.createElement(Input, {
    type: "number",
    min: "0",
    max: "7",
    value: formData.level,
    onChange: e => {
      const level = parseInt(e.target.value);
      setFormData({
        ...formData,
        level,
        color: LEVEL_COLORS[level] || "#94A3B8"
      });
    },
    required: true
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "text-sm font-medium mb-2 block"
  }, "Role Color"), /*#__PURE__*/React.createElement("input", {
    type: "color",
    value: formData.color,
    onChange: e => setFormData({
      ...formData,
      color: e.target.value
    }),
    className: "w-full h-12 rounded border cursor-pointer"
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-end gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    type: "button",
    variant: "outline",
    onClick: () => setIsDialogOpen(false)
  }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
    type: "submit"
  }, editingRole ? "Update" : "Create"))))));
}