import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
export default function RegionManager() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRegion, setEditingRegion] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    color: "#3B82F6"
  });
  const {
    data: regions = [],
    isLoading
  } = useQuery({
    queryKey: ['regions'],
    queryFn: () => base44.entities.Region.list()
  });
  const createMutation = useMutation({
    mutationFn: data => base44.entities.Region.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['regions']
      });
      setIsDialogOpen(false);
      setFormData({
        name: "",
        color: "#3B82F6"
      });
    }
  });
  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data
    }) => base44.entities.Region.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['regions']
      });
      setEditingRegion(null);
    }
  });
  const deleteMutation = useMutation({
    mutationFn: id => base44.entities.Region.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['regions']
      });
    }
  });
  const handleSubmit = e => {
    e.preventDefault();
    if (editingRegion) {
      updateMutation.mutate({
        id: editingRegion.id,
        data: formData
      });
    } else {
      createMutation.mutate(formData);
    }
  };
  const startEdit = region => {
    setEditingRegion(region);
    setFormData({
      name: region.name,
      color: region.color
    });
  };
  const cancelEdit = () => {
    setEditingRegion(null);
    setFormData({
      name: "",
      color: "#3B82F6"
    });
  };
  const handleDelete = id => {
    if (confirm("Are you sure you want to delete this region?")) {
      deleteMutation.mutate(id);
    }
  };
  return /*#__PURE__*/React.createElement(Card, {
    className: "w-full"
  }, /*#__PURE__*/React.createElement(CardHeader, {
    className: "flex flex-row items-center justify-between p-4"
  }, /*#__PURE__*/React.createElement(CardTitle, {
    className: "text-lg"
  }, "Region Management"), /*#__PURE__*/React.createElement(Button, {
    onClick: () => setIsDialogOpen(true),
    size: "sm"
  }, /*#__PURE__*/React.createElement(Plus, {
    className: "w-4 h-4 mr-2"
  }), "Add")), /*#__PURE__*/React.createElement(CardContent, {
    className: "p-4"
  }, isLoading ? /*#__PURE__*/React.createElement("div", {
    className: "text-center py-8 text-gray-500"
  }, "Loading...") : /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
  }, regions.map(region => /*#__PURE__*/React.createElement(Card, {
    key: region.id,
    className: "border hover:shadow-md transition-shadow"
  }, editingRegion?.id === region.id ? /*#__PURE__*/React.createElement(CardContent, {
    className: "p-3 space-y-2"
  }, /*#__PURE__*/React.createElement(Input, {
    value: formData.name,
    onChange: e => setFormData({
      ...formData,
      name: e.target.value
    }),
    className: "h-9"
  }), /*#__PURE__*/React.createElement("input", {
    type: "color",
    value: formData.color,
    onChange: e => setFormData({
      ...formData,
      color: e.target.value
    }),
    className: "w-full h-9 rounded border cursor-pointer"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    onClick: () => {
      updateMutation.mutate({
        id: region.id,
        data: formData
      });
    },
    className: "flex-1"
  }, /*#__PURE__*/React.createElement(Save, {
    className: "w-3 h-3 mr-1"
  }), "Save"), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "outline",
    onClick: cancelEdit,
    className: "flex-1"
  }, /*#__PURE__*/React.createElement(X, {
    className: "w-3 h-3 mr-1"
  }), "Cancel"))) : /*#__PURE__*/React.createElement(CardContent, {
    className: "p-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 mb-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-6 h-6 rounded flex-shrink-0",
    style: {
      backgroundColor: region.color
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "font-medium text-sm truncate"
  }, region.name)), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "outline",
    onClick: () => startEdit(region),
    className: "flex-1"
  }, /*#__PURE__*/React.createElement(Edit, {
    className: "w-3 h-3"
  })), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "destructive",
    onClick: () => handleDelete(region.id),
    className: "flex-1"
  }, /*#__PURE__*/React.createElement(Trash2, {
    className: "w-3 h-3"
  })))))))), /*#__PURE__*/React.createElement(Dialog, {
    open: isDialogOpen,
    onOpenChange: setIsDialogOpen
  }, /*#__PURE__*/React.createElement(DialogContent, null, /*#__PURE__*/React.createElement(DialogHeader, null, /*#__PURE__*/React.createElement(DialogTitle, null, "Add Region")), /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit,
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "text-sm font-medium mb-2 block"
  }, "Region Name"), /*#__PURE__*/React.createElement(Input, {
    value: formData.name,
    onChange: e => setFormData({
      ...formData,
      name: e.target.value
    }),
    required: true
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "text-sm font-medium mb-2 block"
  }, "Region Color"), /*#__PURE__*/React.createElement("input", {
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
  }, "Create"))))));
}