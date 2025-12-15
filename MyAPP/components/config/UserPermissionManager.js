import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2, User, Save } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

const AVAILABLE_PAGES = [
  "Dashboard",
  "CrmCustomers",
  "ConfigCenter"
];

const ACTIONS = [
  { key: "can_view", label: "View" },
  { key: "can_create", label: "Create" },
  { key: "can_edit", label: "Edit" },
  { key: "can_delete", label: "Delete" }
];

export default function UserPermissionManager() {
  const [userPermissions, setUserPermissions] = useState([
    {
      id: "1",
      user_name: "John Doe",
      role: "Manager",
      permissions: {
        Dashboard: { can_view: true, can_create: false, can_edit: false, can_delete: false },
        CrmCustomers: { can_view: true, can_create: true, can_edit: true, can_delete: false }
      }
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    user_name: "",
    role: "",
    permissions: {}
  });

  const handleSaveToSystem = () => {
    console.log("Saving user permissions to system:", userPermissions);
    alert("User permissions saved successfully!");
  };

  const initializePermissions = () => {
    const perms = {};
    AVAILABLE_PAGES.forEach(page => {
      perms[page] = { can_view: false, can_create: false, can_edit: false, can_delete: false };
    });
    return perms;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingUser) {
      setUserPermissions(userPermissions.map(u => u.id === editingUser.id ? { ...u, ...formData } : u));
    } else {
      setUserPermissions([...userPermissions, { id: Date.now().toString(), ...formData }]);
    }
    setIsDialogOpen(false);
    setEditingUser(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      user_name: "",
      role: "",
      permissions: initializePermissions()
    });
  };

  const startEdit = (user) => {
    setEditingUser(user);
    setFormData({
      user_name: user.user_name,
      role: user.role,
      permissions: { ...user.permissions }
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id) => {
    setUserPermissions(userPermissions.filter(u => u.id !== id));
  };

  const updatePagePermission = (page, action, value) => {
    setFormData({
      ...formData,
      permissions: {
        ...formData.permissions,
        [page]: {
          ...formData.permissions[page],
          [action]: value
        }
      }
    });
  };

  const openCreateDialog = () => {
    resetForm();
    setFormData({
      user_name: "",
      role: "",
      permissions: initializePermissions()
    });
    setIsDialogOpen(true);
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between p-4">
        <CardTitle className="text-lg">User Permission Management</CardTitle>
        <div className="flex gap-2">
          <Button onClick={handleSaveToSystem} variant="default" size="sm">
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
          <Button onClick={openCreateDialog} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {userPermissions.map((user) => (
            <Card
              key={user.id}
              className="border hover:shadow-md transition-shadow"
            >
              <CardContent className="p-3">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm truncate">{user.user_name}</h3>
                    <Badge variant="outline" className="text-xs">{user.role}</Badge>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-2 text-xs">
                  {Object.entries(user.permissions).map(([page, perms]) => {
                    const allowedActions = Object.entries(perms)
                      .filter(([_, allowed]) => allowed)
                      .map(([action]) => action.replace("can_", ""));
                    
                    if (allowedActions.length === 0) return null;

                    return (
                      <div key={page} className="bg-blue-50 px-2 py-1 rounded truncate">
                        <span className="font-medium text-blue-900">{page}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => startEdit(user)} className="flex-1">
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(user.id)}
                    className="flex-1"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingUser ? "Edit User Permission" : "Add User Permission"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">User Name</label>
                <Input
                  value={formData.user_name}
                  onChange={(e) => setFormData({ ...formData, user_name: e.target.value })}
                  placeholder="e.g., John Doe"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Role</label>
                <Input
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="e.g., Manager"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-3 block">Page Permissions</label>
              <div className="space-y-3">
                {AVAILABLE_PAGES.map(page => (
                  <div key={page} className="border rounded-lg p-3 bg-gray-50">
                    <div className="font-medium mb-2">{page}</div>
                    <div className="grid grid-cols-4 gap-3">
                      {ACTIONS.map(action => (
                        <div key={action.key} className="flex items-center gap-2">
                          <Checkbox
                            checked={formData.permissions[page]?.[action.key] || false}
                            onCheckedChange={(checked) => updatePagePermission(page, action.key, checked)}
                          />
                          <label className="text-sm">{action.label}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">{editingUser ? "Update" : "Create"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}