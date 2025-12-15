function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, GripVertical, CheckSquare, Briefcase, FileText, Zap, Target, Clipboard, Flag, Star, Box, Radio, UserCircle, Calendar, AlertCircle, MapPin, Image, Users, Hash } from "lucide-react";
import { MODULE_LIBRARY } from "./ModuleLibrary";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
const ICON_MAP = {
  CheckSquare,
  Briefcase,
  FileText,
  Zap,
  Target,
  Clipboard,
  Flag,
  Star,
  Box,
  Radio,
  UserCircle,
  Calendar,
  AlertCircle,
  MapPin,
  Image,
  Users,
  Hash
};
const ICON_OPTIONS = ["CheckSquare", "Briefcase", "FileText", "Zap", "Target", "Clipboard", "Flag", "Star"];
const COLOR_OPTIONS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#06B6D4"];
export default function CompactTaskConfig() {
  const queryClient = useQueryClient();
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [isModuleDialogOpen, setIsModuleDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [taskFormData, setTaskFormData] = useState({
    name: "",
    icon: "CheckSquare",
    icon_color: "#3B82F6"
  });
  const [selectedModules, setSelectedModules] = useState([]);
  const {
    data: tasks = [],
    isLoading
  } = useQuery({
    queryKey: ['taskConfigs'],
    queryFn: async () => {
      const configs = await base44.entities.Task.filter({
        status: undefined
      });
      return configs.map(c => ({
        ...c,
        iconColor: c.icon_color,
        modules: c.modules || [],
        display_order: c.display_order ?? 999
      })).sort((a, b) => a.display_order - b.display_order);
    }
  });
  const createMutation = useMutation({
    mutationFn: data => base44.entities.Task.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['taskConfigs']
      });
      setIsTaskDialogOpen(false);
      setTaskFormData({
        name: "",
        icon: "CheckSquare",
        icon_color: "#3B82F6"
      });
    }
  });
  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data
    }) => base44.entities.Task.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['taskConfigs']
      });
      setEditingTask(null);
      setIsTaskDialogOpen(false);
    }
  });
  const deleteMutation = useMutation({
    mutationFn: id => base44.entities.Task.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['taskConfigs']
      });
    }
  });
  const handleTaskSubmit = e => {
    e.preventDefault();
    if (editingTask) {
      updateMutation.mutate({
        id: editingTask.id,
        data: taskFormData
      });
    } else {
      createMutation.mutate({
        ...taskFormData,
        modules: []
      });
    }
  };
  const handleDeleteTask = id => {
    if (confirm("Are you sure?")) {
      deleteMutation.mutate(id);
    }
  };
  const startEditTask = task => {
    setEditingTask(task);
    setTaskFormData({
      name: task.name,
      icon: task.icon,
      icon_color: task.iconColor
    });
    setIsTaskDialogOpen(true);
  };
  const openModuleDialog = taskId => {
    setSelectedTaskId(taskId);
    const task = tasks.find(t => t.id === taskId);
    setSelectedModules(task.modules.map(m => m.moduleId) || []);
    setIsModuleDialogOpen(true);
  };
  const handleModuleSubmit = () => {
    const task = tasks.find(t => t.id === selectedTaskId);
    const updatedModules = selectedModules.map(moduleId => {
      const existing = task.modules.find(m => m.moduleId === moduleId);
      const template = MODULE_LIBRARY.find(m => m.id === moduleId);
      return existing || {
        moduleId,
        displayName: template.name,
        required: false,
        visibleTo: ["all"]
      };
    });
    updateMutation.mutate({
      id: selectedTaskId,
      data: {
        ...task,
        modules: updatedModules,
        icon_color: task.iconColor
      }
    });
    setIsModuleDialogOpen(false);
  };
  const handleTaskDragEnd = result => {
    if (!result.destination) return;
    const items = Array.from(tasks);
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);
    items.forEach((task, index) => {
      updateMutation.mutate({
        id: task.id,
        data: {
          ...task,
          display_order: index,
          icon_color: task.iconColor
        }
      });
    });
  };
  const handleModuleDragEnd = (result, taskId) => {
    if (!result.destination) return;
    const task = tasks.find(t => t.id === taskId);
    const items = Array.from(task.modules);
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);
    updateMutation.mutate({
      id: taskId,
      data: {
        ...task,
        modules: items,
        icon_color: task.iconColor
      }
    });
  };
  const getIconComponent = iconName => {
    return ICON_MAP[iconName] || CheckSquare;
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-sm font-semibold"
  }, "Task Configuration"), /*#__PURE__*/React.createElement(Button, {
    onClick: () => {
      setEditingTask(null);
      setTaskFormData({
        name: "",
        icon: "CheckSquare",
        icon_color: "#3B82F6"
      });
      setIsTaskDialogOpen(true);
    },
    size: "sm"
  }, /*#__PURE__*/React.createElement(Plus, {
    className: "w-3 h-3 mr-1"
  }), " Add")), isLoading ? /*#__PURE__*/React.createElement("div", {
    className: "text-center py-4 text-xs"
  }, "Loading...") : /*#__PURE__*/React.createElement(DragDropContext, {
    onDragEnd: handleTaskDragEnd
  }, /*#__PURE__*/React.createElement(Droppable, {
    droppableId: "tasks"
  }, provided => /*#__PURE__*/React.createElement("div", _extends({}, provided.droppableProps, {
    ref: provided.innerRef,
    className: "space-y-2"
  }), tasks.map((task, taskIndex) => /*#__PURE__*/React.createElement(Draggable, {
    key: task.id,
    draggableId: task.id,
    index: taskIndex
  }, provided => /*#__PURE__*/React.createElement("div", _extends({
    ref: provided.innerRef
  }, provided.draggableProps), /*#__PURE__*/React.createElement(Card, {
    className: "border"
  }, /*#__PURE__*/React.createElement(CardContent, {
    className: "p-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between mb-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 flex-1 min-w-0"
  }, /*#__PURE__*/React.createElement("div", provided.dragHandleProps, /*#__PURE__*/React.createElement(GripVertical, {
    className: "w-4 h-4 text-gray-400 flex-shrink-0"
  })), (() => {
    const IconComponent = getIconComponent(task.icon);
    return /*#__PURE__*/React.createElement("div", {
      className: "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
      style: {
        backgroundColor: task.iconColor
      }
    }, /*#__PURE__*/React.createElement(IconComponent, {
      className: "w-4 h-4 text-white"
    }));
  })(), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 min-w-0"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "font-medium text-sm truncate"
  }, task.name), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-500"
  }, task.modules.length, " modules"))), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-1 flex-shrink-0"
  }, /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "ghost",
    className: "h-7 w-7 p-0",
    onClick: () => openModuleDialog(task.id)
  }, /*#__PURE__*/React.createElement(Plus, {
    className: "w-3 h-3"
  })), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "ghost",
    className: "h-7 w-7 p-0",
    onClick: () => startEditTask(task)
  }, /*#__PURE__*/React.createElement(Edit, {
    className: "w-3 h-3"
  })), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "ghost",
    className: "h-7 w-7 p-0",
    onClick: () => handleDeleteTask(task.id)
  }, /*#__PURE__*/React.createElement(Trash2, {
    className: "w-3 h-3"
  })))), /*#__PURE__*/React.createElement(DragDropContext, {
    onDragEnd: result => handleModuleDragEnd(result, task.id)
  }, /*#__PURE__*/React.createElement(Droppable, {
    droppableId: `task-${task.id}`
  }, provided => /*#__PURE__*/React.createElement("div", _extends({}, provided.droppableProps, {
    ref: provided.innerRef,
    className: "space-y-1"
  }), task.modules.map((module, index) => {
    const moduleTemplate = MODULE_LIBRARY.find(m => m.id === module.moduleId);
    const ModuleIcon = ICON_MAP[moduleTemplate?.icon] || Box;
    return /*#__PURE__*/React.createElement(Draggable, {
      key: `${module.moduleId}-${index}`,
      draggableId: `${module.moduleId}-${index}`,
      index: index
    }, provided => /*#__PURE__*/React.createElement("div", _extends({
      ref: provided.innerRef
    }, provided.draggableProps, {
      className: "flex items-center gap-2 p-1.5 bg-gray-50 rounded text-xs border"
    }), /*#__PURE__*/React.createElement("div", provided.dragHandleProps, /*#__PURE__*/React.createElement(GripVertical, {
      className: "w-3 h-3 text-gray-400"
    })), /*#__PURE__*/React.createElement(ModuleIcon, {
      className: "w-3 h-3 text-gray-600 flex-shrink-0"
    }), /*#__PURE__*/React.createElement("span", {
      className: "flex-1 truncate"
    }, module.displayName)));
  }), provided.placeholder)))))))), provided.placeholder))), /*#__PURE__*/React.createElement(Dialog, {
    open: isTaskDialogOpen,
    onOpenChange: setIsTaskDialogOpen
  }, /*#__PURE__*/React.createElement(DialogContent, {
    className: "max-w-md"
  }, /*#__PURE__*/React.createElement(DialogHeader, null, /*#__PURE__*/React.createElement(DialogTitle, {
    className: "text-base"
  }, editingTask ? "Edit Task" : "New Task")), /*#__PURE__*/React.createElement("form", {
    onSubmit: handleTaskSubmit,
    className: "space-y-3"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Input, {
    value: taskFormData.name,
    onChange: e => setTaskFormData({
      ...taskFormData,
      name: e.target.value
    }),
    placeholder: "Task name",
    required: true,
    className: "text-sm"
  })), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-2"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Select, {
    value: taskFormData.icon,
    onValueChange: value => setTaskFormData({
      ...taskFormData,
      icon: value
    })
  }, /*#__PURE__*/React.createElement(SelectTrigger, {
    className: "text-xs"
  }, /*#__PURE__*/React.createElement(SelectValue, null)), /*#__PURE__*/React.createElement(SelectContent, null, ICON_OPTIONS.map(icon => {
    const Icon = getIconComponent(icon);
    return /*#__PURE__*/React.createElement(SelectItem, {
      key: icon,
      value: icon
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-2"
    }, /*#__PURE__*/React.createElement(Icon, {
      className: "w-3 h-3"
    }), /*#__PURE__*/React.createElement("span", {
      className: "text-xs"
    }, icon)));
  })))), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-1 flex-wrap"
  }, COLOR_OPTIONS.map(color => /*#__PURE__*/React.createElement("button", {
    key: color,
    type: "button",
    onClick: () => setTaskFormData({
      ...taskFormData,
      icon_color: color
    }),
    className: `w-7 h-7 rounded border-2 ${taskFormData.icon_color === color ? 'border-gray-800' : 'border-gray-200'}`,
    style: {
      backgroundColor: color
    }
  })))), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-end gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    type: "button",
    variant: "outline",
    size: "sm",
    onClick: () => setIsTaskDialogOpen(false)
  }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    size: "sm"
  }, editingTask ? "Update" : "Create"))))), /*#__PURE__*/React.createElement(Dialog, {
    open: isModuleDialogOpen,
    onOpenChange: setIsModuleDialogOpen
  }, /*#__PURE__*/React.createElement(DialogContent, {
    className: "max-w-2xl max-h-[80vh]"
  }, /*#__PURE__*/React.createElement(DialogHeader, null, /*#__PURE__*/React.createElement(DialogTitle, {
    className: "text-base"
  }, "Select Modules")), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-3 gap-2 max-h-96 overflow-y-auto p-1"
  }, MODULE_LIBRARY.map(module => {
    const ModuleIcon = ICON_MAP[module.icon] || Box;
    const isSelected = selectedModules.includes(module.id);
    return /*#__PURE__*/React.createElement("button", {
      key: module.id,
      type: "button",
      onClick: () => {
        setSelectedModules(prev => prev.includes(module.id) ? prev.filter(id => id !== module.id) : [...prev, module.id]);
      },
      className: `p-2 border rounded-lg text-left hover:bg-gray-50 transition ${isSelected ? 'border-blue-500 bg-blue-50' : ''}`
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex flex-col gap-1"
    }, /*#__PURE__*/React.createElement(ModuleIcon, {
      className: "w-4 h-4"
    }), /*#__PURE__*/React.createElement("div", {
      className: "font-medium text-xs"
    }, module.name)));
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-end gap-2 pt-2 border-t"
  }, /*#__PURE__*/React.createElement(Button, {
    type: "button",
    variant: "outline",
    size: "sm",
    onClick: () => setIsModuleDialogOpen(false)
  }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    onClick: handleModuleSubmit
  }, "Save (", selectedModules.length, ")")))));
}