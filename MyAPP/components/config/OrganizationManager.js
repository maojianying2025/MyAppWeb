import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, ChevronRight, ChevronDown, FolderTree, Radio, Layers, Edit, Trash2, Save } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
export default function OrganizationManager() {
  const queryClient = useQueryClient();
  const {
    data: organizations = [],
    isLoading
  } = useQuery({
    queryKey: ['organizations'],
    queryFn: () => base44.entities.Organization.list()
  });
  const departments = organizations.filter(o => o.type === "department");
  const channels = organizations.filter(o => o.type === "channel");
  const subChannels = organizations.filter(o => o.type === "subchannel");
  const createMutation = useMutation({
    mutationFn: data => base44.entities.Organization.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['organizations']
      });
    }
  });
  const deleteMutation = useMutation({
    mutationFn: id => base44.entities.Organization.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['organizations']
      });
    }
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState("department");
  const [formData, setFormData] = useState({
    name: "",
    department_id: "",
    channel_id: ""
  });
  const [expandedDepts, setExpandedDepts] = useState({});
  const [expandedChannels, setExpandedChannels] = useState({});
  const handleSaveToSystem = () => {
    console.log("Saving organization to system:", {
      departments,
      channels,
      subChannels
    });
    alert("Organization saved successfully!");
  };
  const openDialog = (type, parentData = {}) => {
    setDialogType(type);
    setFormData({
      name: "",
      ...parentData
    });
    setIsDialogOpen(true);
  };
  const handleSubmit = e => {
    e.preventDefault();
    const dataToSubmit = {
      name: formData.name,
      type: dialogType === "department" ? "department" : dialogType === "channel" ? "channel" : "subchannel",
      parent_id: formData.department_id || formData.channel_id || undefined
    };
    createMutation.mutate(dataToSubmit);
    setIsDialogOpen(false);
    setFormData({
      name: "",
      department_id: "",
      channel_id: ""
    });
  };
  const handleDelete = (type, id) => {
    if (confirm("Are you sure you want to delete this organization?")) {
      deleteMutation.mutate(id);
    }
  };
  const toggleExpand = (id, type) => {
    if (type === "dept") {
      setExpandedDepts(prev => ({
        ...prev,
        [id]: !prev[id]
      }));
    } else if (type === "channel") {
      setExpandedChannels(prev => ({
        ...prev,
        [id]: !prev[id]
      }));
    }
  };
  return /*#__PURE__*/React.createElement(Card, {
    className: "w-full"
  }, /*#__PURE__*/React.createElement(CardHeader, {
    className: "flex flex-row items-center justify-between p-4"
  }, /*#__PURE__*/React.createElement(CardTitle, {
    className: "text-lg"
  }, "Organization Management"), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    onClick: handleSaveToSystem,
    variant: "default",
    size: "sm"
  }, /*#__PURE__*/React.createElement(Save, {
    className: "w-4 h-4 mr-2"
  }), "Save"), /*#__PURE__*/React.createElement(Button, {
    onClick: () => openDialog("department"),
    size: "sm"
  }, /*#__PURE__*/React.createElement(Plus, {
    className: "w-4 h-4 mr-2"
  }), "Add"))), /*#__PURE__*/React.createElement(CardContent, {
    className: "p-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, departments.map(dept => {
    const deptChannels = channels.filter(c => c.parent_id === dept.id);
    const isDeptExpanded = expandedDepts[dept.id];
    return /*#__PURE__*/React.createElement(Card, {
      key: dept.id,
      className: "border"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center justify-between p-2 bg-blue-50"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-2"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => toggleExpand(dept.id, "dept"),
      className: "hover:bg-blue-100 rounded p-1"
    }, isDeptExpanded ? /*#__PURE__*/React.createElement(ChevronDown, {
      className: "w-4 h-4"
    }) : /*#__PURE__*/React.createElement(ChevronRight, {
      className: "w-4 h-4"
    })), /*#__PURE__*/React.createElement(FolderTree, {
      className: "w-4 h-4"
    }), /*#__PURE__*/React.createElement("span", {
      className: "font-semibold text-sm"
    }, dept.name)), /*#__PURE__*/React.createElement("div", {
      className: "flex gap-1"
    }, /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: "outline",
      onClick: () => openDialog("channel", {
        department_id: dept.id
      }),
      className: "h-7 px-2"
    }, /*#__PURE__*/React.createElement(Plus, {
      className: "w-3 h-3 mr-1"
    }), /*#__PURE__*/React.createElement("span", {
      className: "text-xs"
    }, "Channel")), /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: "destructive",
      onClick: () => handleDelete("department", dept.id),
      className: "h-7 px-2"
    }, /*#__PURE__*/React.createElement(Trash2, {
      className: "w-3 h-3"
    })))), isDeptExpanded && /*#__PURE__*/React.createElement("div", {
      className: "ml-4 p-2 space-y-1"
    }, deptChannels.map(channel => {
      const channelSubs = subChannels.filter(s => s.parent_id === channel.id);
      const isChannelExpanded = expandedChannels[channel.id];
      return /*#__PURE__*/React.createElement(Card, {
        key: channel.id,
        className: "border"
      }, /*#__PURE__*/React.createElement("div", {
        className: "flex items-center justify-between p-2 bg-green-50"
      }, /*#__PURE__*/React.createElement("div", {
        className: "flex items-center gap-2"
      }, /*#__PURE__*/React.createElement("button", {
        onClick: () => toggleExpand(channel.id, "channel"),
        className: "hover:bg-green-100 rounded p-1"
      }, isChannelExpanded ? /*#__PURE__*/React.createElement(ChevronDown, {
        className: "w-3 h-3"
      }) : /*#__PURE__*/React.createElement(ChevronRight, {
        className: "w-3 h-3"
      })), /*#__PURE__*/React.createElement(Radio, {
        className: "w-3 h-3"
      }), /*#__PURE__*/React.createElement("span", {
        className: "font-medium text-sm"
      }, channel.name)), /*#__PURE__*/React.createElement("div", {
        className: "flex gap-1"
      }, /*#__PURE__*/React.createElement(Button, {
        size: "sm",
        variant: "outline",
        onClick: () => openDialog("subchannel", {
          channel_id: channel.id
        }),
        className: "h-6 px-2"
      }, /*#__PURE__*/React.createElement(Plus, {
        className: "w-3 h-3 mr-1"
      }), /*#__PURE__*/React.createElement("span", {
        className: "text-xs"
      }, "Sub")), /*#__PURE__*/React.createElement(Button, {
        size: "sm",
        variant: "destructive",
        onClick: () => handleDelete("channel", channel.id),
        className: "h-6 px-2"
      }, /*#__PURE__*/React.createElement(Trash2, {
        className: "w-3 h-3"
      })))), isChannelExpanded && /*#__PURE__*/React.createElement("div", {
        className: "ml-4 p-1 space-y-1"
      }, channelSubs.map(sub => /*#__PURE__*/React.createElement("div", {
        key: sub.id,
        className: "flex items-center justify-between p-2 bg-purple-50 rounded text-sm"
      }, /*#__PURE__*/React.createElement("div", {
        className: "flex items-center gap-2"
      }, /*#__PURE__*/React.createElement(Layers, {
        className: "w-3 h-3"
      }), /*#__PURE__*/React.createElement("span", {
        className: "text-xs"
      }, sub.name)), /*#__PURE__*/React.createElement(Button, {
        size: "sm",
        variant: "destructive",
        onClick: () => handleDelete("subchannel", sub.id),
        className: "h-6 px-2"
      }, /*#__PURE__*/React.createElement(Trash2, {
        className: "w-3 h-3"
      }))))));
    })));
  }))), /*#__PURE__*/React.createElement(Dialog, {
    open: isDialogOpen,
    onOpenChange: setIsDialogOpen
  }, /*#__PURE__*/React.createElement(DialogContent, null, /*#__PURE__*/React.createElement(DialogHeader, null, /*#__PURE__*/React.createElement(DialogTitle, null, dialogType === "department" && "Add Department", dialogType === "channel" && "Add Channel", dialogType === "subchannel" && "Add Sub-Channel")), /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit,
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "text-sm font-medium mb-2 block"
  }, "Name"), /*#__PURE__*/React.createElement(Input, {
    value: formData.name,
    onChange: e => setFormData({
      ...formData,
      name: e.target.value
    }),
    required: true
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