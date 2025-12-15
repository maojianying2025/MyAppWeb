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
const AVAILABLE_PAGES = ["Dashboard", "Tasks", "CrmCustomers", "TPAManagement", "Support", "ConfigCenter"];
const ACTIONS = [{
  key: "can_view",
  label: "View"
}, {
  key: "can_create",
  label: "Create"
}, {
  key: "can_edit",
  label: "Edit"
}, {
  key: "can_delete",
  label: "Delete"
}];
export default function RolePermissionManager() {
  const queryClient = useQueryClient();
  const [selectedPage, setSelectedPage] = useState("Dashboard");
  const {
    data: permissions = [],
    isLoading
  } = useQuery({
    queryKey: ['permissions'],
    queryFn: () => base44.entities.Permission.list()
  });
  const {
    data: roles = []
  } = useQuery({
    queryKey: ['roles'],
    queryFn: () => base44.entities.Role.list()
  });
  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data
    }) => base44.entities.Permission.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['permissions']
      });
    }
  });
  const createMutation = useMutation({
    mutationFn: data => base44.entities.Permission.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['permissions']
      });
    }
  });
  const getPermissionForRoleAndPage = (roleId, page) => {
    return permissions.find(p => p.role_id === roleId && p.page === page);
  };
  const handlePermissionChange = (roleId, roleName, action, value) => {
    const existing = getPermissionForRoleAndPage(roleId, selectedPage);
    if (existing) {
      updateMutation.mutate({
        id: existing.id,
        data: {
          ...existing,
          [action]: value
        }
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
  return /*#__PURE__*/React.createElement(Card, {
    className: "w-full"
  }, /*#__PURE__*/React.createElement(CardHeader, {
    className: "p-3 md:p-4"
  }, /*#__PURE__*/React.createElement(CardTitle, {
    className: "text-base md:text-lg"
  }, "Role Permission Management"), /*#__PURE__*/React.createElement("div", {
    className: "mt-2"
  }, /*#__PURE__*/React.createElement(Select, {
    value: selectedPage,
    onValueChange: setSelectedPage
  }, /*#__PURE__*/React.createElement(SelectTrigger, {
    className: "w-full md:w-64"
  }, /*#__PURE__*/React.createElement(SelectValue, null)), /*#__PURE__*/React.createElement(SelectContent, null, AVAILABLE_PAGES.map(page => /*#__PURE__*/React.createElement(SelectItem, {
    key: page,
    value: page
  }, page)))))), /*#__PURE__*/React.createElement(CardContent, {
    className: "p-3 md:p-4"
  }, isLoading ? /*#__PURE__*/React.createElement("div", {
    className: "text-center py-4"
  }, "Loading...") : /*#__PURE__*/React.createElement("div", {
    className: "overflow-x-auto"
  }, /*#__PURE__*/React.createElement("table", {
    className: "w-full text-sm"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    className: "border-b"
  }, /*#__PURE__*/React.createElement("th", {
    className: "text-left p-2 font-medium"
  }, "Role"), ACTIONS.map(action => /*#__PURE__*/React.createElement("th", {
    key: action.key,
    className: "text-center p-2 font-medium"
  }, action.label)))), /*#__PURE__*/React.createElement("tbody", null, roles.map(role => {
    const perm = getPermissionForRoleAndPage(role.id, selectedPage);
    return /*#__PURE__*/React.createElement("tr", {
      key: role.id,
      className: "border-b hover:bg-gray-50"
    }, /*#__PURE__*/React.createElement("td", {
      className: "p-2"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-2"
    }, /*#__PURE__*/React.createElement("div", {
      className: "w-6 h-6 rounded-full flex items-center justify-center",
      style: {
        backgroundColor: role.color
      }
    }, /*#__PURE__*/React.createElement(Shield, {
      className: "w-3 h-3 text-white"
    })), /*#__PURE__*/React.createElement("span", {
      className: "font-medium"
    }, role.name))), ACTIONS.map(action => /*#__PURE__*/React.createElement("td", {
      key: action.key,
      className: "text-center p-2"
    }, /*#__PURE__*/React.createElement(Checkbox, {
      checked: perm?.[action.key] || false,
      onCheckedChange: checked => handlePermissionChange(role.id, role.name, action.key, checked)
    }))));
  }))))));
}