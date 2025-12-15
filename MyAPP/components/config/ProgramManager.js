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
  
  const { data: organizations = [], isLoading } = useQuery({
    queryKey: ['organizations'],
    queryFn: () => base44.entities.Organization.list(),
  });

  const departments = organizations.filter(o => o.type === "department");
  const channels = organizations.filter(o => o.type === "channel");
  const subChannels = organizations.filter(o => o.type === "subchannel");

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Organization.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Organization.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
    },
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState("department");
  const [formData, setFormData] = useState({ name: "", department_id: "", channel_id: "" });
  const [expandedDepts, setExpandedDepts] = useState({});
  const [expandedChannels, setExpandedChannels] = useState({});

  const handleSaveToSystem = () => {
    console.log("Saving organization to system:", { departments, channels, subChannels });
    alert("Organization saved successfully!");
  };

  const openDialog = (type, parentData = {}) => {
    setDialogType(type);
    setFormData({ name: "", ...parentData });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const dataToSubmit = {
      name: formData.name,
      type: dialogType === "department" ? "department" : dialogType === "channel" ? "channel" : "subchannel",
      parent_id: formData.department_id || formData.channel_id || undefined
    };
    
    createMutation.mutate(dataToSubmit);
    
    setIsDialogOpen(false);
    setFormData({ name: "", department_id: "", channel_id: "" });
  };

  const handleDelete = (type, id) => {
    if (confirm("Are you sure you want to delete this organization?")) {
      deleteMutation.mutate(id);
    }
  };

  const toggleExpand = (id, type) => {
    if (type === "dept") {
      setExpandedDepts(prev => ({ ...prev, [id]: !prev[id] }));
    } else if (type === "channel") {
      setExpandedChannels(prev => ({ ...prev, [id]: !prev[id] }));
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between p-4">
        <CardTitle className="text-lg">Organization Management</CardTitle>
        <div className="flex gap-2">
          <Button onClick={handleSaveToSystem} variant="default" size="sm">
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
          <Button onClick={() => openDialog("department")} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-2">
          {departments.map((dept) => {
            const deptChannels = channels.filter(c => c.parent_id === dept.id);
            const isDeptExpanded = expandedDepts[dept.id];
            
            return (
              <Card key={dept.id} className="border">
                <div className="flex items-center justify-between p-2 bg-blue-50">
                  <div className="flex items-center gap-2">
                    <button onClick={() => toggleExpand(dept.id, "dept")} className="hover:bg-blue-100 rounded p-1">
                      {isDeptExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                    <FolderTree className="w-4 h-4" />
                    <span className="font-semibold text-sm">{dept.name}</span>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" onClick={() => openDialog("channel", { department_id: dept.id })} className="h-7 px-2">
                      <Plus className="w-3 h-3 mr-1" />
                      <span className="text-xs">Channel</span>
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete("department", dept.id)} className="h-7 px-2">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                
                {isDeptExpanded && (
                  <div className="ml-4 p-2 space-y-1">
                    {deptChannels.map((channel) => {
                      const channelSubs = subChannels.filter(s => s.parent_id === channel.id);
                      const isChannelExpanded = expandedChannels[channel.id];
                      
                      return (
                        <Card key={channel.id} className="border">
                          <div className="flex items-center justify-between p-2 bg-green-50">
                            <div className="flex items-center gap-2">
                              <button onClick={() => toggleExpand(channel.id, "channel")} className="hover:bg-green-100 rounded p-1">
                                {isChannelExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                              </button>
                              <Radio className="w-3 h-3" />
                              <span className="font-medium text-sm">{channel.name}</span>
                            </div>
                            <div className="flex gap-1">
                              <Button size="sm" variant="outline" onClick={() => openDialog("subchannel", { channel_id: channel.id })} className="h-6 px-2">
                                <Plus className="w-3 h-3 mr-1" />
                                <span className="text-xs">Sub</span>
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => handleDelete("channel", channel.id)} className="h-6 px-2">
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          
                          {isChannelExpanded && (
                            <div className="ml-4 p-1 space-y-1">
                              {channelSubs.map((sub) => (
                                <div key={sub.id} className="flex items-center justify-between p-2 bg-purple-50 rounded text-sm">
                                  <div className="flex items-center gap-2">
                                    <Layers className="w-3 h-3" />
                                    <span className="text-xs">{sub.name}</span>
                                  </div>
                                  <Button size="sm" variant="destructive" onClick={() => handleDelete("subchannel", sub.id)} className="h-6 px-2">
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </Card>
                      );
                    })}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogType === "department" && "Add Department"}
              {dialogType === "channel" && "Add Channel"}
              {dialogType === "subchannel" && "Add Sub-Channel"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}