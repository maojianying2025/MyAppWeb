import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Edit, Users, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import TPAForm from "../components/tpa/TPAForm";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
export default function TPAManagement() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTPA, setEditingTPA] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    regions: [],
    channels: [],
    seller_rates: {}
  });
  const {
    data: tpas = [],
    isLoading
  } = useQuery({
    queryKey: ['tpas'],
    queryFn: () => base44.entities.TPA.list('-created_date', 500)
  });
  const {
    data: regions = []
  } = useQuery({
    queryKey: ['regions'],
    queryFn: () => base44.entities.Region.list('-created_date', 100)
  });
  const {
    data: organizations = []
  } = useQuery({
    queryKey: ['organizations'],
    queryFn: () => base44.entities.Organization.list('-created_date', 200)
  });
  const channels = organizations.filter(o => o.type === "channel");
  const createMutation = useMutation({
    mutationFn: data => base44.entities.TPA.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tpas']
      });
      setIsDialogOpen(false);
      resetForm();
    }
  });
  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data
    }) => base44.entities.TPA.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tpas']
      });
      setIsDialogOpen(false);
      setEditingTPA(null);
      resetForm();
    }
  });
  const handleSubmit = data => {
    if (editingTPA) {
      updateMutation.mutate({
        id: editingTPA.id,
        data
      });
    } else {
      createMutation.mutate(data);
    }
  };
  const resetForm = () => {
    setFormData({
      name: "",
      regions: [],
      channels: [],
      seller_rates: {}
    });
  };
  const startEdit = tpa => {
    setEditingTPA(tpa);
    setFormData({
      name: tpa.name,
      regions: tpa.regions || [],
      channels: tpa.channels || [],
      seller_rates: tpa.seller_rates || {}
    });
    setIsDialogOpen(true);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-3 md:p-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "max-w-7xl mx-auto"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-4 flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    className: "text-2xl md:text-3xl font-bold text-gray-900"
  }, "TPA Management"), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-gray-600"
  }, "Manage Third Party Agents and billing")), /*#__PURE__*/React.createElement(Button, {
    onClick: () => {
      resetForm();
      setIsDialogOpen(true);
    },
    size: "sm"
  }, /*#__PURE__*/React.createElement(Plus, {
    className: "w-4 h-4 mr-2"
  }), "Add TPA")), isLoading ? /*#__PURE__*/React.createElement("div", {
    className: "text-center py-8"
  }, "Loading...") : /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
  }, tpas.map(tpa => /*#__PURE__*/React.createElement(Card, {
    key: tpa.id,
    className: "hover:shadow-lg transition-shadow cursor-pointer",
    onClick: () => startEdit(tpa)
  }, /*#__PURE__*/React.createElement(CardContent, {
    className: "p-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-start justify-between mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center"
  }, /*#__PURE__*/React.createElement(Users, {
    className: "w-6 h-6 text-white"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "font-semibold text-lg"
  }, tpa.name), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap gap-1 mt-1"
  }, tpa.regions?.slice(0, 2).map(region => /*#__PURE__*/React.createElement(Badge, {
    key: region,
    variant: "outline",
    className: "text-xs"
  }, region)), tpa.regions?.length > 2 && /*#__PURE__*/React.createElement(Badge, {
    variant: "outline",
    className: "text-xs"
  }, "+", tpa.regions.length - 2)))), /*#__PURE__*/React.createElement(Edit, {
    className: "w-4 h-4 text-gray-400"
  })), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, Object.entries(tpa.seller_rates || {}).slice(0, 2).map(([region, rate]) => /*#__PURE__*/React.createElement("div", {
    key: region,
    className: "flex items-center justify-between p-2 bg-green-50 rounded"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-medium"
  }, region), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1"
  }, /*#__PURE__*/React.createElement(DollarSign, {
    className: "w-3 h-3 text-green-600"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-sm font-bold text-green-600"
  }, rate)))), Object.keys(tpa.seller_rates || {}).length > 2 && /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-gray-500 text-center"
  }, "+", Object.keys(tpa.seller_rates).length - 2, " more rates")), tpa.channels?.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "mt-2 pt-2 border-t"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-gray-500"
  }, "Channels:"), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap gap-1 mt-1"
  }, tpa.channels.slice(0, 3).map(channel => /*#__PURE__*/React.createElement(Badge, {
    key: channel,
    variant: "secondary",
    className: "text-xs"
  }, channel)), tpa.channels.length > 3 && /*#__PURE__*/React.createElement(Badge, {
    variant: "secondary",
    className: "text-xs"
  }, "+", tpa.channels.length - 3))))))), /*#__PURE__*/React.createElement(Dialog, {
    open: isDialogOpen,
    onOpenChange: setIsDialogOpen
  }, /*#__PURE__*/React.createElement(DialogContent, {
    className: "max-w-2xl max-h-[90vh] overflow-y-auto"
  }, /*#__PURE__*/React.createElement(DialogHeader, null, /*#__PURE__*/React.createElement(DialogTitle, null, editingTPA ? "Edit TPA" : "Add New TPA")), /*#__PURE__*/React.createElement(TPAForm, {
    formData: formData,
    setFormData: setFormData,
    regions: regions,
    channels: channels,
    onCancel: () => setIsDialogOpen(false),
    onSubmit: handleSubmit,
    isEditing: !!editingTPA
  })))));
}