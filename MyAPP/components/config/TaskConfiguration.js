import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Edit, Trash2, GripVertical, Save, CheckSquare, Briefcase, FileText, Zap, Target, Clipboard, Flag, Star, Box, Radio, UserCircle, Calendar, AlertCircle, MapPin, Image, Users, Hash } from "lucide-react";
import { MODULE_LIBRARY } from "./ModuleLibrary";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const ICON_MAP = {
  CheckSquare, Briefcase, FileText, Zap, Target, Clipboard, Flag, Star, Box, Radio, UserCircle, Calendar, AlertCircle, MapPin, Image, Users, Hash
};

const ICON_OPTIONS = ["CheckSquare", "Briefcase", "FileText", "Zap", "Target", "Clipboard", "Flag", "Star"];
const COLOR_OPTIONS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#06B6D4"];
const ROLE_OPTIONS = ["Viewer", "TPA", "SSS", "Manager", "Head", "Director", "Owner"];

export default function TaskConfiguration() {
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
  const [moduleConfig, setModuleConfig] = useState({
    displayName: "",
    required: false,
    visibleTo: []
  });
  const [editingModuleIndex, setEditingModuleIndex] = useState(null);

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['taskConfigs'],
    queryFn: async () => {
      const configs = await base44.entities.Task.filter({ status: undefined });
      return configs
        .map(c => ({
          ...c,
          iconColor: c.icon_color,
          modules: c.modules || [],
          display_order: c.display_order ?? 999
        }))
        .sort((a, b) => a.display_order - b.display_order);
    },
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Task.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskConfigs'] });
      setIsTaskDialogOpen(false);
      setTaskFormData({ name: "", icon: "CheckSquare", icon_color: "#3B82F6" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Task.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskConfigs'] });
      setEditingTask(null);
      setIsTaskDialogOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Task.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskConfigs'] });
    },
  });

  const handleTaskSubmit = (e) => {
    e.preventDefault();
    if (editingTask) {
      updateMutation.mutate({ id: editingTask.id, data: taskFormData });
    } else {
      createMutation.mutate({ ...taskFormData, modules: [] });
    }
  };

  const handleDeleteTask = (id) => {
    if (confirm("Are you sure?")) {
      deleteMutation.mutate(id);
    }
  };

  const startEditTask = (task) => {
    setEditingTask(task);
    setTaskFormData({ name: task.name, icon: task.icon, icon_color: task.iconColor });
    setIsTaskDialogOpen(true);
  };

  const openModuleDialog = (taskId) => {
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
      data: { ...task, modules: updatedModules, icon_color: task.iconColor }
    });

    setIsModuleDialogOpen(false);
  };

  const handleTaskDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(tasks);
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);
    
    // Update all tasks with new order
    items.forEach((task, index) => {
      updateMutation.mutate({
        id: task.id,
        data: { ...task, display_order: index }
      });
    });
  };

  const handleDragEnd = (result, taskId) => {
    if (!result.destination) return;

    const task = tasks.find(t => t.id === taskId);
    const items = Array.from(task.modules);
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);
    
    updateMutation.mutate({
      id: taskId,
      data: { ...task, modules: items, icon_color: task.iconColor }
    });
  };

  const getIconComponent = (iconName) => {
    return ICON_MAP[iconName] || CheckSquare;
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between p-4 md:p-6">
          <CardTitle className="text-lg md:text-xl">Task Configuration</CardTitle>
          <Button onClick={() => { setEditingTask(null); setTaskFormData({ name: "", icon: "CheckSquare", icon_color: "#3B82F6" }); setIsTaskDialogOpen(true); }} size="sm">
            <Plus className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">New</span>
          </Button>
        </CardHeader>
        <CardContent className="space-y-3 md:space-y-4 p-4 md:p-6">
          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <DragDropContext onDragEnd={handleTaskDragEnd}>
              <Droppable droppableId="tasks">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                    {tasks.map((task, taskIndex) => (
                      <Draggable key={task.id} draggableId={task.id} index={taskIndex}>
                        {(provided) => (
                          <div ref={provided.innerRef} {...provided.draggableProps}>
                            <Card className="border-2">
                              <CardContent className="p-3 md:p-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                                  <div className="flex items-center gap-3">
                                    <div {...provided.dragHandleProps}>
                                      <GripVertical className="w-5 h-5 text-gray-400" />
                                    </div>
                                    {(() => {
                                      const IconComponent = getIconComponent(task.icon);
                                      return (
                                        <div 
                                          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                                          style={{ backgroundColor: task.iconColor }}
                                        >
                                          <IconComponent className="w-6 h-6 text-white" />
                                        </div>
                                      );
                                    })()}
                                    <div>
                                      <h3 className="font-semibold text-base md:text-lg">{task.name}</h3>
                                      <p className="text-xs md:text-sm text-gray-500">
                                        {task.modules.length} modules
                                        {task.flow_config?.nodes?.length > 0 && ` • ${task.flow_config.nodes.length} flow steps`}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex gap-1 flex-wrap">
                                    <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); openModuleDialog(task.id); }}>
                                      <Plus className="w-3 h-3" />
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); startEditTask(task); }}>
                                      <Edit className="w-3 h-3" />
                                    </Button>
                                    <Button size="sm" variant="destructive" onClick={(e) => { e.stopPropagation(); handleDeleteTask(task.id); }}>
                                      <Trash2 className="w-3 h-3" />
                                    </Button>
                                  </div>
                                  </div>

                                  <DragDropContext onDragEnd={(result) => handleDragEnd(result, task.id)}>
                                  <Droppable droppableId={`task-${task.id}`}>
                                    {(provided) => (
                                      <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                                        {task.modules.map((module, index) => {
                                          const moduleTemplate = MODULE_LIBRARY.find(m => m.id === module.moduleId);
                                          const ModuleIcon = ICON_MAP[moduleTemplate?.icon] || Box;

                                          return (
                                            <Draggable key={`${module.moduleId}-${index}`} draggableId={`${module.moduleId}-${index}`} index={index}>
                                              {(provided) => (
                                                <div
                                                  ref={provided.innerRef}
                                                  {...provided.draggableProps}
                                                  className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border"
                                                >
                                                  <div {...provided.dragHandleProps}>
                                                    <GripVertical className="w-4 h-4 text-gray-400" />
                                                  </div>
                                                  <ModuleIcon className="w-4 h-4 text-gray-600 flex-shrink-0" />
                                                  <div className="flex-1 min-w-0">
                                                    <div className="font-medium text-sm truncate">{module.displayName}</div>
                                                  </div>
                                                </div>
                                              )}
                                            </Draggable>
                                          );
                                        })}
                                        {provided.placeholder}
                                      </div>
                                    )}
                                  </Droppable>
                                  </DragDropContext>
                                  </CardContent>
                                  </Card>
                                  </div>
                                  )}
                                  </Draggable>
                                  ))}
                                  {provided.placeholder}
                                  </div>
                                  )}
                                  </Droppable>
                                  </DragDropContext>
                                  )}
                                  </CardContent>
      </Card>

      {/* Task Dialog */}
      <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTask ? "Edit Task" : "New Task"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleTaskSubmit} className="space-y-4">
            <div>
              <Label>Task Name</Label>
              <Input
                value={taskFormData.name}
                onChange={(e) => setTaskFormData({ ...taskFormData, name: e.target.value })}
                required
              />
            </div>

            <div>
              <Label>Icon</Label>
              <Select
                value={taskFormData.icon}
                onValueChange={(value) => setTaskFormData({ ...taskFormData, icon: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ICON_OPTIONS.map(icon => {
                    const Icon = getIconComponent(icon);
                    return (
                      <SelectItem key={icon} value={icon}>
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          {icon}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Icon Color</Label>
              <div className="flex gap-2 flex-wrap">
                {COLOR_OPTIONS.map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setTaskFormData({ ...taskFormData, icon_color: color })}
                    className={`w-10 h-10 rounded-lg border-2 ${taskFormData.icon_color === color ? 'border-gray-800' : 'border-gray-200'}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsTaskDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">{editingTask ? "Update" : "Create"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Module Dialog */}
      <Dialog open={isModuleDialogOpen} onOpenChange={setIsModuleDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Select Modules</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto p-1">
              {MODULE_LIBRARY.map(module => {
                const ModuleIcon = ICON_MAP[module.icon] || Box;
                const isSelected = selectedModules.includes(module.id);
                return (
                  <button
                    key={module.id}
                    type="button"
                    onClick={() => {
                      setSelectedModules(prev =>
                        prev.includes(module.id)
                          ? prev.filter(id => id !== module.id)
                          : [...prev, module.id]
                      );
                    }}
                    className={`p-2 border rounded-lg text-left hover:bg-gray-50 transition ${
                      isSelected ? 'border-blue-500 bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <ModuleIcon className="w-4 h-4 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-xs">{module.name}</div>
                      </div>
                      {isSelected && <CheckSquare className="w-4 h-4 text-blue-600 flex-shrink-0" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <Button type="button" variant="outline" onClick={() => setIsModuleDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleModuleSubmit}>
                Save Modules ({selectedModules.length})
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}