import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Edit, Trash2, Save, ArrowRight, GitBranch, CheckCircle, XCircle, Clock, FileText, GripVertical } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { MODULE_LIBRARY } from "./ModuleLibrary";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const FLOW_NODES = [
  { id: "draft", name: "Draft", icon: FileText, color: "#94A3B8" },
  { id: "pending", name: "Pending", icon: Clock, color: "#F59E0B" },
  { id: "pending1", name: "Pending 1", icon: Clock, color: "#F59E0B" },
  { id: "pending2", name: "Pending 2", icon: Clock, color: "#F59E0B" },
  { id: "pending3", name: "Pending 3", icon: Clock, color: "#F59E0B" },
  { id: "done", name: "Done", icon: CheckCircle, color: "#10B981" },
  { id: "cancel", name: "Cancel", icon: XCircle, color: "#EF4444" }
];

const HANDLER_TYPES = [
  { value: "role", label: "By Role" },
  { value: "current", label: "Keep Current Person" },
  { value: "initiator", label: "Initiator" }
];

const ACTION_TYPES = [
  { id: "save", name: "Save Draft", color: "#94A3B8" },
  { id: "submit", name: "Submit", color: "#3B82F6" },
  { id: "approve", name: "Approve", color: "#10B981" },
  { id: "reject", name: "Reject", color: "#EF4444" },
  { id: "rollback", name: "Rollback", color: "#F59E0B" },
  { id: "cancel", name: "Cancel", color: "#6B7280" }
];

export default function FlowConfiguration() {
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
  
  const [isFlowDialogOpen, setIsFlowDialogOpen] = useState(false);
  const [isNodeDialogOpen, setIsNodeDialogOpen] = useState(false);
  const [editingFlow, setEditingFlow] = useState(null);
  const [editingNodeIndex, setEditingNodeIndex] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [nodeFormData, setNodeFormData] = useState({
    id: "",
    handlerType: "role",
    handlerValue: "",
    nextNode: "",
    modules: [],
    actions: []
  });
  const [showModuleSelect, setShowModuleSelect] = useState(false);
  const [showActionConfig, setShowActionConfig] = useState(false);

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Task.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskConfigs'] });
      setIsFlowDialogOpen(false);
      setIsNodeDialogOpen(false);
    },
  });

  const handleFlowSubmit = (taskId, flowConfig) => {
    const task = tasks.find(t => t.id === taskId);
    updateMutation.mutate({
      id: taskId,
      data: { ...task, flow_config: flowConfig }
    });
  };

  const handleDragEnd = (result, taskId) => {
    if (!result.destination) return;

    const task = tasks.find(t => t.id === taskId);
    const nodes = Array.from(task.flow_config?.nodes || []);
    const [reordered] = nodes.splice(result.source.index, 1);
    nodes.splice(result.destination.index, 0, reordered);
    
    updateMutation.mutate({
      id: taskId,
      data: { ...task, flow_config: { ...task.flow_config, nodes } }
    });
  };

  const handleNodeSubmit = () => {
    const task = tasks.find(t => t.id === selectedTaskId);
    const flowConfig = task.flow_config || { nodes: [], ccRoles: [] };
    
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
    setNodeFormData({ id: "", handlerType: "role", handlerValue: "", nextNode: "", modules: [] });
    setEditingNodeIndex(null);
  };

  const handleDeleteNode = (taskId, nodeIndex) => {
    const task = tasks.find(t => t.id === taskId);
    const flowConfig = task.flow_config || { nodes: [], ccRoles: [] };
    const updatedNodes = flowConfig.nodes.filter((_, i) => i !== nodeIndex);
    
    updateMutation.mutate({
      id: taskId,
      data: { ...task, flow_config: { ...flowConfig, nodes: updatedNodes } }
    });
  };

  const openNodeDialog = (taskId, nodeIndex = null) => {
    setSelectedTaskId(taskId);
    const task = tasks.find(t => t.id === taskId);
    const flowConfig = task.flow_config || { nodes: [], ccRoles: [] };
    
    if (nodeIndex !== null) {
    setEditingNodeIndex(nodeIndex);
    setNodeFormData(flowConfig.nodes[nodeIndex]);
    } else {
    setEditingNodeIndex(null);
    setNodeFormData({ id: "", handlerType: "role", handlerValue: "", nextNode: "", modules: [], actions: [] });
    }
    setIsNodeDialogOpen(true);
  };

  const getNodeInfo = (nodeId) => {
    return FLOW_NODES.find(n => n.id === nodeId) || FLOW_NODES[0];
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="p-3 md:p-4">
          <CardTitle className="text-base md:text-lg">Flow Configuration (by Task)</CardTitle>
        </CardHeader>
        <CardContent className="p-3 md:p-4 space-y-2">
          {tasks.map((task) => {
            const flow = task.flow_config || { nodes: [], ccRoles: [] };
            return (
              <Card key={task.id} className="border">
                <CardContent className="p-2">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-sm">{task.name}</h3>
                      <p className="text-xs text-gray-500">{flow.nodes.length} nodes</p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => openNodeDialog(task.id)}>
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>

                  <DragDropContext onDragEnd={(result) => handleDragEnd(result, task.id)}>
                    <Droppable droppableId={`flow-${task.id}`} direction="horizontal">
                      {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className="flex flex-wrap gap-1">
                          {flow.nodes.map((node, index) => {
                            const nodeInfo = getNodeInfo(node.id);
                            const NodeIcon = nodeInfo.icon;
                            const hasNext = node.nextNode && flow.nodes.some(n => n.id === node.nextNode);
                            
                            return (
                              <Draggable key={`${node.id}-${index}`} draggableId={`${node.id}-${index}`} index={index}>
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    className="flex items-center gap-1"
                                  >
                                    <Card className="border" style={{ borderColor: nodeInfo.color }}>
                                      <CardContent className="p-1">
                                        <div className="flex items-center gap-1">
                                          <div {...provided.dragHandleProps}>
                                            <GripVertical className="w-3 h-3 text-gray-400" />
                                          </div>
                                          <NodeIcon className="w-3 h-3" style={{ color: nodeInfo.color }} />
                                          <div className="text-xs">
                                            <div className="font-medium">{nodeInfo.name}</div>
                                            <div className="text-gray-500">
                                              {node.handlerType === "role" && `${node.handlerValue}`}
                                              {node.handlerType === "current" && "Current"}
                                              {node.handlerType === "initiator" && "Initiator"}
                                            </div>
                                          </div>
                                          <div className="flex gap-0.5">
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
                                    {hasNext && <ArrowRight className="w-3 h-3 text-gray-400" />}
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
            );
          })}
        </CardContent>
      </Card>



      {/* Node Dialog */}
      <Dialog open={isNodeDialogOpen} onOpenChange={setIsNodeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingNodeIndex !== null ? "Edit Node" : "Add Node"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Node Type</Label>
              <Select
                value={nodeFormData.id}
                onValueChange={(value) => setNodeFormData({ ...nodeFormData, id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select node type" />
                </SelectTrigger>
                <SelectContent>
                  {FLOW_NODES.map(node => {
                    const Icon = node.icon;
                    return (
                      <SelectItem key={node.id} value={node.id}>
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4" style={{ color: node.color }} />
                          {node.name}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Next Handler</Label>
              <Select
                value={nodeFormData.handlerType}
                onValueChange={(value) => setNodeFormData({ ...nodeFormData, handlerType: value, handlerValue: "" })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="initiator">Initiator</SelectItem>
                  <SelectItem value="role">By Role</SelectItem>
                  <SelectItem value="current">Current Handler</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {nodeFormData.handlerType === "role" && (
              <div>
                <Label>Role</Label>
                <Select
                  value={nodeFormData.handlerValue}
                  onValueChange={(value) => setNodeFormData({ ...nodeFormData, handlerValue: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map(role => (
                      <SelectItem key={role.id} value={role.name}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Label>Next Node</Label>
              <Select
                value={nodeFormData.nextNode}
                onValueChange={(value) => setNodeFormData({ ...nodeFormData, nextNode: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select next node (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={null}>None</SelectItem>
                  {FLOW_NODES.map(node => (
                    <SelectItem key={node.id} value={node.id}>
                      {node.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Action Buttons</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {ACTION_TYPES.map(action => {
                  const isSelected = nodeFormData.actions?.some(a => a.id === action.id);
                  return (
                    <Button
                      key={action.id}
                      type="button"
                      variant={isSelected ? "default" : "outline"}
                      className="h-12 text-xs"
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
                            actions: [...actions, { id: action.id, name: action.name, targetNode: "", targetRole: "" }] 
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

            {nodeFormData.actions?.filter(a => a.id === "rollback").length > 0 && (
              <div className="p-3 bg-orange-50 rounded border border-orange-200">
                <Label className="text-sm font-medium mb-2">Rollback Configuration</Label>
                {nodeFormData.actions.filter(a => a.id === "rollback").map((action, idx) => (
                  <div key={idx} className="space-y-2 mt-2">
                    <Select
                      value={action.targetNode}
                      onValueChange={(value) => {
                        const updatedActions = [...nodeFormData.actions];
                        const actionIdx = updatedActions.findIndex(a => a.id === "rollback");
                        updatedActions[actionIdx] = { ...updatedActions[actionIdx], targetNode: value };
                        setNodeFormData({ ...nodeFormData, actions: updatedActions });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Rollback to step..." />
                      </SelectTrigger>
                      <SelectContent>
                        {FLOW_NODES.map(node => (
                          <SelectItem key={node.id} value={node.id}>{node.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            )}

            <div>
              <Label>Modules (GPS, Image, etc.)</Label>
              <div className="flex gap-2 flex-wrap mt-2">
                {(nodeFormData.modules || []).map((mod, idx) => (
                  <div key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs flex items-center gap-1">
                    {mod}
                    <button 
                      type="button"
                      onClick={() => {
                        setNodeFormData({ 
                          ...nodeFormData, 
                          modules: nodeFormData.modules.filter((_, i) => i !== idx) 
                        });
                      }}
                      className="ml-1 hover:text-blue-900"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const mod = prompt("Enter module name (e.g., GPS, Image, Note):");
                    if (mod) {
                      setNodeFormData({ 
                        ...nodeFormData, 
                        modules: [...(nodeFormData.modules || []), mod] 
                      });
                    }
                  }}
                >
                  + Add Module
                </Button>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <Button type="button" variant="outline" onClick={() => setIsNodeDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleNodeSubmit} disabled={!nodeFormData.id}>
                {editingNodeIndex !== null ? "Update" : "Add"} Node
              </Button>
            </div>
            </div>
        </DialogContent>
      </Dialog>


    </div>
  );
}