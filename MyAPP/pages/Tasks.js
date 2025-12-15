import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, CheckSquare, Briefcase, FileText, Zap, Target, Clipboard, Flag, Star, Clock, CheckCircle, XCircle, ArrowRight, User } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
const ICON_MAP = {
  CheckSquare,
  Briefcase,
  FileText,
  Zap,
  Target,
  Clipboard,
  Flag,
  Star
};
const STATUS_CONFIG = {
  draft: {
    label: "Draft",
    icon: FileText,
    color: "#94A3B8"
  },
  pending: {
    label: "Pending",
    icon: Clock,
    color: "#F59E0B"
  },
  done: {
    label: "Done",
    icon: CheckCircle,
    color: "#10B981"
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    color: "#EF4444"
  }
};
export default function TasksPage() {
  const queryClient = useQueryClient();
  const [selectedTask, setSelectedTask] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const {
    data: taskTemplates = []
  } = useQuery({
    queryKey: ['taskConfigs'],
    queryFn: async () => {
      const configs = await base44.entities.Task.filter({
        status: undefined
      });
      return configs;
    }
  });
  const {
    data: tasks = []
  } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const allTasks = await base44.entities.Task.filter({
        status: {
          $ne: undefined
        }
      });
      return allTasks.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    }
  });
  const createMutation = useMutation({
    mutationFn: data => base44.entities.Task.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tasks']
      });
      setShowCreate(false);
      setSelectedTemplate(null);
    }
  });
  const handleStartTask = () => {
    if (!selectedTemplate) return;
    const template = taskTemplates.find(t => t.id === selectedTemplate);
    createMutation.mutate({
      name: template.name,
      icon: template.icon,
      icon_color: template.icon_color,
      modules: template.modules,
      flow_config: template.flow_config,
      status: "draft"
    });
  };
  const tasksByStatus = {
    draft: tasks.filter(t => t.status === "draft"),
    pending: tasks.filter(t => t.status === "pending"),
    done: tasks.filter(t => t.status === "done"),
    cancelled: tasks.filter(t => t.status === "cancelled")
  };
  const filteredTasks = filterStatus === "all" ? tasks : tasks.filter(t => t.status === filterStatus);
  return /*#__PURE__*/React.createElement("div", {
    className: "min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-3 md:p-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "max-w-7xl mx-auto"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-4 flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    className: "text-2xl font-bold text-gray-900"
  }, "Workflow Tasks"), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-gray-600"
  }, tasks.length, " total tasks")), /*#__PURE__*/React.createElement(Button, {
    onClick: () => setShowCreate(true),
    size: "sm"
  }, /*#__PURE__*/React.createElement(Plus, {
    className: "w-4 h-4 mr-1"
  }), " New Task")), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 md:grid-cols-4 gap-3 mb-4"
  }, Object.entries(STATUS_CONFIG).map(([status, config]) => {
    const StatusIcon = config.icon;
    const count = tasksByStatus[status]?.length || 0;
    return /*#__PURE__*/React.createElement(Card, {
      key: status,
      className: "cursor-pointer hover:shadow-md transition-shadow border-2",
      style: {
        borderColor: filterStatus === status ? config.color : 'transparent'
      },
      onClick: () => setFilterStatus(filterStatus === status ? "all" : status)
    }, /*#__PURE__*/React.createElement(CardContent, {
      className: "p-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-2 mb-1"
    }, /*#__PURE__*/React.createElement("div", {
      className: "w-8 h-8 rounded-lg flex items-center justify-center",
      style: {
        backgroundColor: config.color + "20"
      }
    }, /*#__PURE__*/React.createElement(StatusIcon, {
      className: "w-4 h-4",
      style: {
        color: config.color
      }
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "text-xs text-gray-600"
    }, config.label), /*#__PURE__*/React.createElement("div", {
      className: "text-lg font-bold"
    }, count)))));
  })), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, filteredTasks.map(task => {
    const Icon = ICON_MAP[task.icon] || Briefcase;
    const statusConfig = STATUS_CONFIG[task.status];
    const StatusIcon = statusConfig.icon;
    return /*#__PURE__*/React.createElement(Card, {
      key: task.id,
      className: "hover:shadow-md transition-shadow cursor-pointer border",
      onClick: () => {
        setSelectedTask(task);
        setShowDetail(true);
      }
    }, /*#__PURE__*/React.createElement(CardContent, {
      className: "p-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center justify-between"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-3 flex-1 min-w-0"
    }, /*#__PURE__*/React.createElement("div", {
      className: "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
      style: {
        backgroundColor: task.icon_color
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      className: "w-5 h-5 text-white"
    })), /*#__PURE__*/React.createElement("div", {
      className: "flex-1 min-w-0"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "font-semibold text-sm truncate"
    }, task.name), /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-2 text-xs text-gray-500"
    }, /*#__PURE__*/React.createElement("span", null, "Created: ", new Date(task.created_date).toLocaleDateString()), task.assigned_to && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", null, "\u2022"), /*#__PURE__*/React.createElement("span", null, "Assigned: ", task.assigned_to))))), /*#__PURE__*/React.createElement(Badge, {
      className: "text-xs",
      style: {
        backgroundColor: statusConfig.color + "20",
        color: statusConfig.color
      }
    }, /*#__PURE__*/React.createElement(StatusIcon, {
      className: "w-3 h-3 mr-1"
    }), statusConfig.label))));
  })), filteredTasks.length === 0 && /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardContent, {
    className: "p-8 text-center"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-gray-500"
  }, "No tasks found"))), /*#__PURE__*/React.createElement(Dialog, {
    open: showCreate,
    onOpenChange: setShowCreate
  }, /*#__PURE__*/React.createElement(DialogContent, {
    className: "max-w-4xl"
  }, /*#__PURE__*/React.createElement(DialogHeader, null, /*#__PURE__*/React.createElement(DialogTitle, null, "Start New Workflow")), /*#__PURE__*/React.createElement("div", {
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 md:grid-cols-3 gap-3"
  }, taskTemplates.map(template => {
    const Icon = ICON_MAP[template.icon] || Briefcase;
    const isSelected = selectedTemplate === template.id;
    return /*#__PURE__*/React.createElement(Card, {
      key: template.id,
      className: `cursor-pointer hover:shadow-lg transition-all border-2 ${isSelected ? 'border-blue-500 shadow-lg' : 'border-transparent'}`,
      onClick: () => setSelectedTemplate(template.id)
    }, /*#__PURE__*/React.createElement(CardContent, {
      className: "p-4 text-center"
    }, /*#__PURE__*/React.createElement("div", {
      className: "w-16 h-16 mx-auto rounded-lg flex items-center justify-center mb-2",
      style: {
        backgroundColor: template.icon_color
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      className: "w-8 h-8 text-white"
    })), /*#__PURE__*/React.createElement("div", {
      className: "font-semibold text-sm"
    }, template.name), template.description && /*#__PURE__*/React.createElement("div", {
      className: "text-xs text-gray-500 mt-1"
    }, template.description)));
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-end gap-2 pt-2 border-t"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    onClick: () => setShowCreate(false)
  }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
    onClick: handleStartTask,
    disabled: !selectedTemplate
  }, "Start Workflow"))))), /*#__PURE__*/React.createElement(Dialog, {
    open: showDetail,
    onOpenChange: setShowDetail
  }, /*#__PURE__*/React.createElement(DialogContent, {
    className: "max-w-3xl max-h-[90vh] overflow-y-auto"
  }, /*#__PURE__*/React.createElement(DialogHeader, null, /*#__PURE__*/React.createElement(DialogTitle, null, "Task Details")), selectedTask && /*#__PURE__*/React.createElement("div", {
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3 pb-3 border-b"
  }, (() => {
    const Icon = ICON_MAP[selectedTask.icon] || Briefcase;
    return /*#__PURE__*/React.createElement("div", {
      className: "w-12 h-12 rounded-lg flex items-center justify-center",
      style: {
        backgroundColor: selectedTask.icon_color
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      className: "w-6 h-6 text-white"
    }));
  })(), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "font-bold text-lg"
  }, selectedTask.name), /*#__PURE__*/React.createElement(Badge, {
    className: "text-xs mt-1",
    style: {
      backgroundColor: STATUS_CONFIG[selectedTask.status].color + "20",
      color: STATUS_CONFIG[selectedTask.status].color
    }
  }, STATUS_CONFIG[selectedTask.status].label))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-4 text-sm"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-gray-500"
  }, "Created By"), /*#__PURE__*/React.createElement("div", {
    className: "font-medium"
  }, selectedTask.created_by || "N/A")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-gray-500"
  }, "Created Date"), /*#__PURE__*/React.createElement("div", {
    className: "font-medium"
  }, new Date(selectedTask.created_date).toLocaleString())), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-gray-500"
  }, "Assigned To"), /*#__PURE__*/React.createElement("div", {
    className: "font-medium"
  }, selectedTask.assigned_to || "Unassigned")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-gray-500"
  }, "Last Updated"), /*#__PURE__*/React.createElement("div", {
    className: "font-medium"
  }, new Date(selectedTask.updated_date).toLocaleString()))), selectedTask.flow_config?.nodes && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", {
    className: "font-semibold mb-2"
  }, "Workflow Steps"), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap gap-2"
  }, selectedTask.flow_config.nodes.map((node, idx) => {
    const nodeConfig = STATUS_CONFIG[node.id];
    const NodeIcon = nodeConfig?.icon || FileText;
    return /*#__PURE__*/React.createElement("div", {
      key: idx,
      className: "flex items-center gap-1"
    }, /*#__PURE__*/React.createElement(Card, {
      className: "border",
      style: {
        borderColor: nodeConfig?.color
      }
    }, /*#__PURE__*/React.createElement(CardContent, {
      className: "p-2"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-2"
    }, /*#__PURE__*/React.createElement(NodeIcon, {
      className: "w-4 h-4",
      style: {
        color: nodeConfig?.color
      }
    }), /*#__PURE__*/React.createElement("div", {
      className: "text-xs"
    }, /*#__PURE__*/React.createElement("div", {
      className: "font-medium"
    }, nodeConfig?.label), node.currentHandler && /*#__PURE__*/React.createElement("div", {
      className: "text-gray-500"
    }, node.currentHandler))))), idx < selectedTask.flow_config.nodes.length - 1 && /*#__PURE__*/React.createElement(ArrowRight, {
      className: "w-3 h-3 text-gray-400"
    }));
  }))), selectedTask.modules?.length > 0 && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", {
    className: "font-semibold mb-2"
  }, "Task Modules"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-2"
  }, selectedTask.modules.map((mod, idx) => /*#__PURE__*/React.createElement("div", {
    key: idx,
    className: "p-2 bg-gray-50 rounded border text-xs"
  }, mod.displayName)))))))));
}