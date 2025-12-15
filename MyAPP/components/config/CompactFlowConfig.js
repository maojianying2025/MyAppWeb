import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, GripVertical, CheckSquare, FileText, Clock, CheckCircle, XCircle, Box, Radio, UserCircle, Calendar, AlertCircle, MapPin, Image, Users, Hash, Target } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { MODULE_LIBRARY } from "./ModuleLibrary";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const ICON_MAP = {
  CheckSquare, FileText, Clock, CheckCircle, XCircle, Box, Radio, UserCircle, Calendar, AlertCircle, MapPin, Image, Users, Hash, Target
};

const HANDLER_OPTIONS = [
  { value: "initiator", label: "Initiator" },
  { value: "current", label: "Current Handler" }
];

const FLOW_NODES = [
  { id: "draft", name: "Draft", icon: FileText, color: "#94A3B8" },
  { id: "pending", name: "Pending", icon: Clock, color: "#F59E0B" },
  { id: "done", name: "Done", icon: CheckCircle, color: "#10B981" },
  { id: "cancelled", name: "Cancelled", icon: XCircle, color: "#EF4444" }
];

const ACTION_TYPES = [
  { id: "save", name: "Save", color: "#94A3B8" },
  { id: "submit", name: "Submit", color: "#3B82F6" },
  { id: "approve", name: "Approve", color: "#10B981" },
  { id: "reject", name: "Reject", color: "#EF4444" },
  { id: "rollback", name: "Rollback", color: "#F59E0B" },
  { id: "cancel", name: "Cancel", color: "#6B7280" }
];

export default function CompactFlowConfig() {
  const queryClient = useQueryClient();
  
  const { data: tasks = [] } = useQuery({
    queryKey: ['taskConfigs'],
    queryFn: async () => {
      const configs = await base44.entities.Task.filter({ status: undefined });
      return configs;
    },
  });

  const { data: roles = [] } = useQuery({
    queryKey: ['roles'],
    queryFn: () => base44.entities.Role.list(),
  });
  
  const [isNodeDialogOpen, setIsNodeDialogOpen] = useState(false);
  const [editingNodeIndex, setEditingNodeIndex] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [nodeFormData, setNodeFormData] = useState({
    id: "",
    currentHandler: "",
    modules: [],
    actions: [],
    ccRoles: []
  });
  const [showCCConfig, setShowCCConfig] = useState(false);

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Task.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskConfigs'] });
      setIsNodeDialogOpen(false);
    },
  });

  const handleNodeSubmit = () => {
    const task = tasks.find(t => t.id === selectedTaskId);
    const flowConfig = task.flow_config || { nodes: [] };
    
    const updatedNodes = [...flowConfig.nodes];
    if (editingNodeIndex !== null) {
      updatedNodes[editingNodeIndex] = nodeFormData;
    } else {
      updatedNodes.push(nodeFormData);
    }

    updateMutation.mutate({
      id: selectedTaskId,
      data: { ...task, flow_config: { ...flowConfig, nodes: updatedNodes } }
    });
    
    setIsNodeDialogOpen(false);
    setNodeFormData({ id: "", currentHandler: "", modules: [], actions: [], ccRoles: [] });
    setEditingNodeIndex(null);
  };

  const handleDeleteNode = (taskId, nodeIndex) => {
    const task = tasks.find(t => t.id === taskId);
    const flowConfig = task.flow_config || { nodes: [] };
    const updatedNodes = flowConfig.nodes.filter((_, i) => i !== nodeIndex);
    
    updateMutation.mutate({
      id: taskId,
      data: { ...task, flow_config: { ...flowConfig, nodes: updatedNodes } }
    });
  };

  const openNodeDialog = (taskId, nodeIndex = null) => {
    setSelectedTaskId(taskId);
    const task = tasks.find(t => t.id === taskId);
    const flowConfig = task.flow_config || { nodes: [] };
    
    if (nodeIndex !== null) {
      setEditingNodeIndex(nodeIndex);
      setNodeFormData(flowConfig.nodes[nodeIndex]);
    } else {
      setEditingNodeIndex(null);
      setNodeFormData({ id: "", currentHandler: "", modules: [], actions: [], ccRoles: [] });
    }
    setIsNodeDialogOpen(true);
  };

  const getNodeInfo = (nodeId) => {
    return FLOW_NODES.find(n => n.id === nodeId) || FLOW_NODES[0];
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold">Flow Configuration</h3>
      </div>

      {tasks.map((task) => {
        const flow = task.flow_config || { nodes: [] };
        return (
          <Card key={task.id} className="border">
            <CardContent className="p-2">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="font-medium text-sm">{task.name}</h4>
                  <p className="text-xs text-gray-500">{flow.nodes.length} steps</p>
                </div>
                <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => openNodeDialog(task.id)}>
                  <Plus className="w-3 h-3" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-1">
                {flow.nodes.map((node, index) => {
                  const nodeInfo = getNodeInfo(node.id);
                  const NodeIcon = nodeInfo.icon;
                  
                  return (
                    <Card key={index} className="border text-xs" style={{ borderColor: nodeInfo.color }}>
                      <CardContent className="p-1.5">
                        <div className="flex items-center gap-1">
                          <NodeIcon className="w-3 h-3" style={{ color: nodeInfo.color }} />
                          <div>
                            <div className="font-medium">{nodeInfo.name}</div>
                            {node.currentHandler && <div className="text-gray-500 text-xs">Handler: {node.currentHandler}</div>}
                          </div>
                          <div className="flex gap-0.5 ml-1">
                            <Button size="sm" variant="ghost" onClick={() => openNodeDialog(task.id, index)} className="h-5 w-5 p-0">
                              <Edit className="w-2.5 h-2.5" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleDeleteNode(task.id, index)} className="h-5 w-5 p-0">
                              <Trash2 className="w-2.5 h-2.5" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}

      <Dialog open={isNodeDialogOpen} onOpenChange={setIsNodeDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base">{editingNodeIndex !== null ? "Edit Step" : "Add Step"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Step Type</Label>
              <Select
                value={nodeFormData.id}
                onValueChange={(value) => setNodeFormData({ ...nodeFormData, id: value })}
              >
                <SelectTrigger className="text-xs">
                  <SelectValue placeholder="Select step" />
                </SelectTrigger>
                <SelectContent>
                  {FLOW_NODES.map(node => {
                    const Icon = node.icon;
                    return (
                      <SelectItem key={node.id} value={node.id}>
                        <div className="flex items-center gap-2">
                          <Icon className="w-3 h-3" style={{ color: node.color }} />
                          <span className="text-xs">{node.name}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs">Current Handler</Label>
              <Select
                value={nodeFormData.currentHandler}
                onValueChange={(value) => setNodeFormData({ ...nodeFormData, currentHandler: value })}
              >
                <SelectTrigger className="text-xs">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="initiator">Initiator</SelectItem>
                  <SelectItem value="current">Current Handler</SelectItem>
                  {roles.map(role => (
                    <SelectItem key={role.id} value={role.name}>{role.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs">Action Buttons</Label>
              <div className="grid grid-cols-3 gap-1 mt-1">
                {ACTION_TYPES.map(action => {
                  const isSelected = nodeFormData.actions?.some(a => a.id === action.id);
                  return (
                    <Button
                      key={action.id}
                      type="button"
                      size="sm"
                      variant={isSelected ? "default" : "outline"}
                      className="h-8 text-xs"
                      onClick={() => {
                        const actions = nodeFormData.actions || [];
                        if (isSelected) {
                          setNodeFormData({ 
                            ...nodeFormData, 
                            actions: actions.filter(a => a.id !== action.id) 
                          });
                        } else {
                          setNodeFormData({ 
                            ...nodeFormData, 
                            actions: [...actions, { id: action.id, name: action.name, targetStep: "" }] 
                          });
                        }
                      }}
                      style={isSelected ? { backgroundColor: action.color } : {}}
                    >
                      {action.name}
                    </Button>
                  );
                })}
              </div>
            </div>

            {nodeFormData.actions?.map((action, idx) => (
              <div key={idx} className="p-2 bg-gray-50 rounded border space-y-2">
                <Label className="text-xs font-medium">{action.name} Configuration</Label>
                <div>
                  <Label className="text-xs text-gray-600">Target Step</Label>
                  <Select
                    value={action.targetStep}
                    onValueChange={(value) => {
                      const updatedActions = [...nodeFormData.actions];
                      updatedActions[idx] = { ...updatedActions[idx], targetStep: value };
                      setNodeFormData({ ...nodeFormData, actions: updatedActions });
                    }}
                  >
                    <SelectTrigger className="text-xs">
                      <SelectValue placeholder="Select step" />
                    </SelectTrigger>
                    <SelectContent>
                      {FLOW_NODES.map(node => (
                        <SelectItem key={node.id} value={node.id}>{node.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs text-gray-600">Next Handler</Label>
                  <Select
                    value={action.nextHandler}
                    onValueChange={(value) => {
                      const updatedActions = [...nodeFormData.actions];
                      updatedActions[idx] = { ...updatedActions[idx], nextHandler: value };
                      setNodeFormData({ ...nodeFormData, actions: updatedActions });
                    }}
                  >
                    <SelectTrigger className="text-xs">
                      <SelectValue placeholder="Select handler" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="initiator">Initiator</SelectItem>
                      <SelectItem value="current">Current Handler</SelectItem>
                      {roles.map(role => (
                        <SelectItem key={role.id} value={role.name}>{role.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}

            <div>
              <Label className="text-xs">CC Roles (Carbon Copy)</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full mt-1"
                onClick={() => setShowCCConfig(!showCCConfig)}
              >
                {showCCConfig ? "Hide" : "Configure"} CC ({nodeFormData.ccRoles?.length || 0})
              </Button>
              {showCCConfig && (
                <div className="grid grid-cols-2 gap-1 mt-2 p-2 border rounded max-h-32 overflow-y-auto">
                  {roles.map(role => {
                    const isSelected = nodeFormData.ccRoles?.includes(role.name);
                    return (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => {
                          const ccRoles = nodeFormData.ccRoles || [];
                          setNodeFormData({
                            ...nodeFormData,
                            ccRoles: isSelected 
                              ? ccRoles.filter(r => r !== role.name)
                              : [...ccRoles, role.name]
                          });
                        }}
                        className={`p-1.5 text-xs border rounded ${
                          isSelected ? 'border-blue-500 bg-blue-50' : ''
                        }`}
                      >
                        {role.name}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div>
              <Label className="text-xs">Modules</Label>
              <div className="grid grid-cols-3 gap-1 max-h-48 overflow-y-auto mt-1 p-1 border rounded">
                {MODULE_LIBRARY.map(module => {
                  const ModuleIcon = ICON_MAP[module.icon] || Box;
                  const isSelected = nodeFormData.modules?.includes(module.id);
                  return (
                    <button
                      key={module.id}
                      type="button"
                      onClick={() => {
                        const modules = nodeFormData.modules || [];
                        setNodeFormData({
                          ...nodeFormData,
                          modules: isSelected 
                            ? modules.filter(m => m !== module.id)
                            : [...modules, module.id]
                        });
                      }}
                      className={`p-1.5 border rounded text-left hover:bg-gray-50 ${
                        isSelected ? 'border-blue-500 bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex flex-col gap-0.5">
                        <ModuleIcon className="w-3 h-3" />
                        <span className="text-xs font-medium">{module.name}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsNodeDialogOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleNodeSubmit} disabled={!nodeFormData.id}>
                {editingNodeIndex !== null ? "Update" : "Add"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}