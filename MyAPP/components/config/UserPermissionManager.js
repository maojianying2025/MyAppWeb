import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2, User, Save } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
const AVAILABLE_PAGES = ["Dashboard", "CrmCustomers", "ConfigCenter"];
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
export default function UserPermissionManager() {
  const [userPermissions, setUserPermissions] = useState([{
    id: "1",
    user_name: "John Doe",
    role: "Manager",
    permissions: {
      Dashboard: {
        can_view: true,
        can_create: false,
        can_edit: false,
        can_delete: false
      },
      CrmCustomers: {
        can_view: true,
        can_create: true,
        can_edit: true,
        can_delete: false
      }
    }
  }]);
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
      perms[page] = {
        can_view: false,
        can_create: false,
        can_edit: false,
        can_delete: false
      };
    });
    return perms;
  };
  const handleSubmit = e => {
    e.preventDefault();
    if (editingUser) {
      setUserPermissions(userPermissions.map(u => u.id === editingUser.id ? {
        ...u,
        ...formData
      } : u));
    } else {
      setUserPermissions([...userPermissions, {
        id: Date.now().toString(),
        ...formData
      }]);
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
  const startEdit = user => {
    setEditingUser(user);
    setFormData({
      user_name: user.user_name,
      role: user.role,
      permissions: {
        ...user.permissions
      }
    });
    setIsDialogOpen(true);
  };
  const handleDelete = id => {
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
  return /*#__PURE__*/React.createElement(Card, {
    className: "w-full"
  }, /*#__PURE__*/React.createElement(CardHeader, {
    className: "flex flex-row items-center justify-between p-4"
  }, /*#__PURE__*/React.createElement(CardTitle, {
    className: "text-lg"
  }, "User Permission Management"), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    onClick: handleSaveToSystem,
    variant: "default",
    size: "sm"
  }, /*#__PURE__*/React.createElement(Save, {
    className: "w-4 h-4 mr-2"
  }), "Save"), /*#__PURE__*/React.createElement(Button, {
    onClick: openCreateDialog,
    size: "sm"
  }, /*#__PURE__*/React.createElement(Plus, {
    className: "w-4 h-4 mr-2"
  }), "Add"))), /*#__PURE__*/React.createElement(CardContent, {
    className: "p-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-2 gap-3"
  }, userPermissions.map(user => /*#__PURE__*/React.createElement(Card, {
    key: user.id,
    className: "border hover:shadow-md transition-shadow"
  }, /*#__PURE__*/React.createElement(CardContent, {
    className: "p-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3 mb-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0"
  }, /*#__PURE__*/React.createElement(User, {
    className: "w-5 h-5 text-white"
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 min-w-0"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "font-semibold text-sm truncate"
  }, user.user_name), /*#__PURE__*/React.createElement(Badge, {
    variant: "outline",
    className: "text-xs"
  }, user.role))), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap gap-1 mb-2 text-xs"
  }, Object.entries(user.permissions).map(([page, perms]) => {
    const allowedActions = Object.entries(perms).filter(([_, allowed]) => allowed).map(([action]) => action.replace("can_", ""));
    if (allowedActions.length === 0) return null;
    return /*#__PURE__*/React.createElement("div", {
      key: page,
      className: "bg-blue-50 px-2 py-1 rounded truncate"
    }, /*#__PURE__*/React.createElement("span", {
      className: "font-medium text-blue-900"
    }, page));
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "outline",
    onClick: () => startEdit(user),
    className: "flex-1"
  }, /*#__PURE__*/React.createElement(Edit, {
    className: "w-3 h-3"
  })), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "destructive",
    onClick: () => handleDelete(user.id),
    className: "flex-1"
  }, /*#__PURE__*/React.createElement(Trash2, {
    className: "w-3 h-3"
  })))))))), /*#__PURE__*/React.createElement(Dialog, {
    open: isDialogOpen,
    onOpenChange: setIsDialogOpen
  }, /*#__PURE__*/React.createElement(DialogContent, {
    className: "max-w-3xl max-h-[80vh] overflow-y-auto"
  }, /*#__PURE__*/React.createElement(DialogHeader, null, /*#__PURE__*/React.createElement(DialogTitle, null, editingUser ? "Edit User Permission" : "Add User Permission")), /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit,
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "text-sm font-medium mb-2 block"
  }, "User Name"), /*#__PURE__*/React.createElement(Input, {
    value: formData.user_name,
    onChange: e => setFormData({
      ...formData,
      user_name: e.target.value
    }),
    placeholder: "e.g., John Doe",
    required: true
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "text-sm font-medium mb-2 block"
  }, "Role"), /*#__PURE__*/React.createElement(Input, {
    value: formData.role,
    onChange: e => setFormData({
      ...formData,
      role: e.target.value
    }),
    placeholder: "e.g., Manager",
    required: true
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "text-sm font-medium mb-3 block"
  }, "Page Permissions"), /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, AVAILABLE_PAGES.map(page => /*#__PURE__*/React.createElement("div", {
    key: page,
    className: "border rounded-lg p-3 bg-gray-50"
  }, /*#__PURE__*/React.createElement("div", {
    className: "font-medium mb-2"
  }, page), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-4 gap-3"
  }, ACTIONS.map(action => /*#__PURE__*/React.createElement("div", {
    key: action.key,
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(Checkbox, {
    checked: formData.permissions[page]?.[action.key] || false,
    onCheckedChange: checked => updatePagePermission(page, action.key, checked)
  }), /*#__PURE__*/React.createElement("label", {
    className: "text-sm"
  }, action.label)))))))), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-end gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    type: "button",
    variant: "outline",
    onClick: () => setIsDialogOpen(false)
  }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
    type: "submit"
  }, editingUser ? "Update" : "Create"))))));
}