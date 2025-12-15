import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2, Shield } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const AVAILABLE_PAGES = [
  "Dashboard",
  "Tasks",
  "CrmCustomers",
  "TPAManagement",
  "Support",
  "ConfigCenter"
];

const ACTIONS = [
  { key: "can_view", label: "View" },
  { key: "can_create", label: "Create" },
  { key: "can_edit", label: "Edit" },
  { key: "can_delete", label: "Delete" }
];

export default function RolePermissionManager() {
  const queryClient = useQueryClient();
  const [selectedPage, setSelectedPage] = useState("Dashboard");

  const { data: permissions = [], isLoading } = useQuery({
    queryKey: ['permissions'],
    queryFn: () => base44.entities.Permission.list(),
  });

  const { data: roles = [] } = useQuery({
    queryKey: ['roles'],
    queryFn: () => base44.entities.Role.list(),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Permission.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
    },
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Permission.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
    },
  });

  const getPermissionForRoleAndPage = (roleId, page) => {
    return permissions.find(p => p.role_id === roleId && p.page === page);
  };

  const handlePermissionChange = (roleId, roleName, action, value) => {
    const existing = getPermissionForRoleAndPage(roleId, selectedPage);
    
    if (existing) {
      updateMutation.mutate({
        id: existing.id,
        data: { ...existing, [action]: value }
      });
    } else {
      createMutation.mutate({
        role_id: roleId,
        role_name: roleName,
        page: selectedPage,
        can_view: action === 'can_view' ? value : false,
        can_create: action === 'can_create' ? value : false,
        can_edit: action === 'can_edit' ? value : false,
        can_delete: action === 'can_delete' ? value : false
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="p-3 md:p-4">
        <CardTitle className="text-base md:text-lg">Role Permission Management</CardTitle>
        <div className="mt-2">
          <Select value={selectedPage} onValueChange={setSelectedPage}>
            <SelectTrigger className="w-full md:w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {AVAILABLE_PAGES.map(page => (
                <SelectItem key={page} value={page}>{page}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="p-3 md:p-4">
        {isLoading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 font-medium">Role</th>
                  {ACTIONS.map(action => (
                    <th key={action.key} className="text-center p-2 font-medium">{action.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {roles.map(role => {
                  const perm = getPermissionForRoleAndPage(role.id, selectedPage);
                  return (
                    <tr key={role.id} className="border-b hover:bg-gray-50">
                      <td className="p-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: role.color }}>
                            <Shield className="w-3 h-3 text-white" />
                          </div>
                          <span className="font-medium">{role.name}</span>
                        </div>
                      </td>
                      {ACTIONS.map(action => (
                        <td key={action.key} className="text-center p-2">
                          <Checkbox
                            checked={perm?.[action.key] || false}
                            onCheckedChange={(checked) => handlePermissionChange(role.id, role.name, action.key, checked)}
                          />
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}