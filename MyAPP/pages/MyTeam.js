import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, Download, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
export default function MyTeam() {
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [selectedRole, setSelectedRole] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const {
    data: schedules = []
  } = useQuery({
    queryKey: ['sales-schedules'],
    queryFn: () => base44.entities.SalesSchedule.list('-date', 1000)
  });
  const {
    data: users = []
  } = useQuery({
    queryKey: ['users'],
    queryFn: () => base44.entities.User.list('-created_date', 500)
  });
  const {
    data: roles = []
  } = useQuery({
    queryKey: ['roles'],
    queryFn: () => base44.entities.Role.list('-created_date', 100)
  });

  // Filter schedules by date range
  const filteredSchedules = schedules.filter(s => {
    if (!s.date) return false;
    const date = s.date.split('T')[0];
    return date >= dateRange.start && date <= dateRange.end;
  });

  // Calculate statistics by role
  const roleStats = roles.map(role => {
    // Get users with this role
    const roleUsers = users.filter(u => u.role === role.name);
    const userEmails = roleUsers.map(u => u.email);

    // Get schedules for these users (assuming created_by = user email)
    const roleSchedules = filteredSchedules.filter(s => userEmails.includes(s.created_by));

    // Count unique dates
    const uniqueDates = new Set(roleSchedules.map(s => s.date.split('T')[0]));
    return {
      role: role.name,
      roleId: role.id,
      color: role.color,
      sessionCount: roleSchedules.length,
      daysCount: uniqueDates.size,
      schedules: roleSchedules,
      users: roleUsers
    };
  });
  const handleExport = roleData => {
    const csvContent = [["Date", "Customer", "Region", "Channel", "Status", "Notes"], ...roleData.schedules.map(s => [s.date.split('T')[0], s.customer_name, s.region || "", s.channel || "", s.status, s.notes || ""])].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], {
      type: "text/csv"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${roleData.role}_sales_${dateRange.start}_to_${dateRange.end}.csv`;
    a.click();
  };
  const handleExportAll = () => {
    const csvContent = [["Role", "Session Count", "Days Count"], ...roleStats.map(r => [r.role, r.sessionCount, r.daysCount])].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], {
      type: "text/csv"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `team_stats_${dateRange.start}_to_${dateRange.end}.csv`;
    a.click();
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-3 md:p-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "max-w-7xl mx-auto"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-4 flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    className: "text-2xl font-bold text-gray-900"
  }, "My Team"), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-gray-600"
  }, "Sales performance by role")), /*#__PURE__*/React.createElement(Button, {
    onClick: handleExportAll,
    size: "sm",
    variant: "outline"
  }, /*#__PURE__*/React.createElement(Download, {
    className: "w-4 h-4 mr-1"
  }), " Export Summary")), /*#__PURE__*/React.createElement(Card, {
    className: "mb-4"
  }, /*#__PURE__*/React.createElement(CardContent, {
    className: "p-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-4 flex-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(Calendar, {
    className: "w-4 h-4 text-gray-500"
  }), /*#__PURE__*/React.createElement(Label, {
    className: "text-sm"
  }, "Date Range:")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(Input, {
    type: "date",
    value: dateRange.start,
    onChange: e => setDateRange({
      ...dateRange,
      start: e.target.value
    }),
    className: "w-40"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-gray-500"
  }, "to"), /*#__PURE__*/React.createElement(Input, {
    type: "date",
    value: dateRange.end,
    onChange: e => setDateRange({
      ...dateRange,
      end: e.target.value
    }),
    className: "w-40"
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
  }, roleStats.map(roleData => /*#__PURE__*/React.createElement(Card, {
    key: roleData.roleId,
    className: "hover:shadow-lg transition-shadow cursor-pointer border-2",
    style: {
      borderColor: roleData.color || "#3B82F6"
    }
  }, /*#__PURE__*/React.createElement(CardContent, {
    className: "p-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-start justify-between mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-12 h-12 rounded-lg flex items-center justify-center",
    style: {
      backgroundColor: (roleData.color || "#3B82F6") + "20"
    }
  }, /*#__PURE__*/React.createElement(Users, {
    className: "w-6 h-6",
    style: {
      color: roleData.color || "#3B82F6"
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "font-semibold text-lg"
  }, roleData.role), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-500"
  }, roleData.users.length, " members")))), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between p-2 bg-blue-50 rounded"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-sm font-medium"
  }, "Sales Sessions"), /*#__PURE__*/React.createElement(Badge, {
    variant: "secondary",
    className: "text-base font-bold"
  }, roleData.sessionCount)), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between p-2 bg-green-50 rounded"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-sm font-medium"
  }, "Active Days"), /*#__PURE__*/React.createElement(Badge, {
    variant: "secondary",
    className: "text-base font-bold"
  }, roleData.daysCount))), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2 mt-3 pt-3 border-t"
  }, /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "outline",
    className: "flex-1",
    onClick: () => {
      setSelectedRole(roleData);
      setShowDetails(true);
    }
  }, /*#__PURE__*/React.createElement(Eye, {
    className: "w-3 h-3 mr-1"
  }), " View"), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "outline",
    className: "flex-1",
    onClick: () => handleExport(roleData)
  }, /*#__PURE__*/React.createElement(Download, {
    className: "w-3 h-3 mr-1"
  }), " Export")))))), /*#__PURE__*/React.createElement(Dialog, {
    open: showDetails,
    onOpenChange: setShowDetails
  }, /*#__PURE__*/React.createElement(DialogContent, {
    className: "max-w-4xl max-h-[90vh] overflow-y-auto"
  }, /*#__PURE__*/React.createElement(DialogHeader, null, /*#__PURE__*/React.createElement(DialogTitle, null, selectedRole?.role, " - Sales Details")), selectedRole && /*#__PURE__*/React.createElement("div", {
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-sm text-gray-600"
  }, "Total Sessions"), /*#__PURE__*/React.createElement("div", {
    className: "text-2xl font-bold"
  }, selectedRole.sessionCount)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-sm text-gray-600"
  }, "Active Days"), /*#__PURE__*/React.createElement("div", {
    className: "text-2xl font-bold"
  }, selectedRole.daysCount)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-sm text-gray-600"
  }, "Team Members"), /*#__PURE__*/React.createElement("div", {
    className: "text-2xl font-bold"
  }, selectedRole.users.length))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", {
    className: "font-semibold mb-2"
  }, "Team Members"), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap gap-2"
  }, selectedRole.users.map(user => /*#__PURE__*/React.createElement(Badge, {
    key: user.id,
    variant: "outline"
  }, user.full_name)))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", {
    className: "font-semibold mb-2"
  }, "Sales Schedule (", selectedRole.schedules.length, ")"), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2 max-h-96 overflow-y-auto"
  }, selectedRole.schedules.map(schedule => /*#__PURE__*/React.createElement(Card, {
    key: schedule.id,
    className: "border"
  }, /*#__PURE__*/React.createElement(CardContent, {
    className: "p-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-start justify-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "font-semibold"
  }, schedule.customer_name), /*#__PURE__*/React.createElement("div", {
    className: "text-sm text-gray-600 mt-1"
  }, /*#__PURE__*/React.createElement("div", null, "Date: ", schedule.date.split('T')[0]), /*#__PURE__*/React.createElement("div", null, "Region: ", schedule.region || "N/A"), /*#__PURE__*/React.createElement("div", null, "Channel: ", schedule.channel || "N/A"), schedule.notes && /*#__PURE__*/React.createElement("div", null, "Notes: ", schedule.notes))), /*#__PURE__*/React.createElement(Badge, {
    variant: "outline",
    className: schedule.status === "completed" ? "bg-green-50 text-green-700" : schedule.status === "cancelled" ? "bg-red-50 text-red-700" : "bg-blue-50 text-blue-700"
  }, schedule.status))))))))))));
}