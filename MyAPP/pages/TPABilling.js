import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Plus, Download, Calendar, Filter } from "lucide-react";
export default function TPABilling() {
  const queryClient = useQueryClient();
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const {
    data: billings = [],
    isLoading
  } = useQuery({
    queryKey: ['tpa-billings'],
    queryFn: () => base44.entities.TPABilling.list('-billing_date', 500)
  });

  // Filter by date range
  const filteredBillings = billings.filter(b => {
    if (!b.billing_date) return true;
    const date = b.billing_date.split('T')[0];
    return date >= dateRange.start && date <= dateRange.end;
  });
  const handleExport = () => {
    const csvContent = [["TPA Name", "Activity Session", "Required Sellers", "Actual Sellers", "Approved Sellers", "Seller Rate", "Total Amount", "Status", "Billing Date"], ...filteredBillings.map(b => [b.tpa_name, b.activity_session, b.required_sellers || 0, b.actual_sellers || 0, b.approved_sellers || 0, b.seller_rate || 0, b.total_amount || 0, b.status, b.billing_date ? b.billing_date.split('T')[0] : ""])].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], {
      type: "text/csv"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tpa_billing_${dateRange.start}_to_${dateRange.end}.csv`;
    a.click();
  };
  const totalAmount = filteredBillings.reduce((sum, b) => sum + (b.total_amount || 0), 0);
  return /*#__PURE__*/React.createElement("div", {
    className: "min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-3 md:p-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "max-w-7xl mx-auto"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-4 flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    className: "text-2xl font-bold text-gray-900"
  }, "TPA Billing"), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-gray-600"
  }, filteredBillings.length, " billing records")), /*#__PURE__*/React.createElement(Button, {
    onClick: handleExport,
    size: "sm"
  }, /*#__PURE__*/React.createElement(Download, {
    className: "w-4 h-4 mr-1"
  }), " Export")), /*#__PURE__*/React.createElement(Card, {
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
  })), /*#__PURE__*/React.createElement("div", {
    className: "ml-auto"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-sm text-gray-600"
  }, "Total Amount"), /*#__PURE__*/React.createElement("div", {
    className: "text-2xl font-bold text-green-600"
  }, "$", totalAmount.toLocaleString()))))), /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, isLoading ? /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardContent, {
    className: "p-8 text-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "animate-pulse"
  }, "Loading..."))) : filteredBillings.length === 0 ? /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardContent, {
    className: "p-8 text-center"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-gray-500"
  }, "No billing records found for this period"))) : filteredBillings.map(billing => /*#__PURE__*/React.createElement(Card, {
    key: billing.id,
    className: "hover:shadow-lg transition-shadow border"
  }, /*#__PURE__*/React.createElement(CardContent, {
    className: "p-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-start justify-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 mb-2"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "font-semibold text-lg"
  }, billing.tpa_name), /*#__PURE__*/React.createElement(Badge, {
    variant: "outline",
    className: billing.status === "paid" ? "bg-green-50 text-green-700" : billing.status === "approved" ? "bg-blue-50 text-blue-700" : billing.status === "pending" ? "bg-yellow-50 text-yellow-700" : "bg-gray-50 text-gray-700"
  }, billing.status)), /*#__PURE__*/React.createElement("div", {
    className: "text-sm text-gray-600 space-y-1"
  }, /*#__PURE__*/React.createElement("div", null, "Session: ", billing.activity_session), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-4"
  }, /*#__PURE__*/React.createElement("span", null, "Required: ", billing.required_sellers || 0), /*#__PURE__*/React.createElement("span", null, "Actual: ", billing.actual_sellers || 0), /*#__PURE__*/React.createElement("span", null, "Approved: ", billing.approved_sellers || 0)), /*#__PURE__*/React.createElement("div", null, "Rate: $", billing.seller_rate || 0, " per seller"), billing.billing_date && /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1 text-gray-500"
  }, /*#__PURE__*/React.createElement(Calendar, {
    className: "w-3 h-3"
  }), billing.billing_date.split('T')[0]))), /*#__PURE__*/React.createElement("div", {
    className: "text-right"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-sm text-gray-600"
  }, "Total Amount"), /*#__PURE__*/React.createElement("div", {
    className: "text-2xl font-bold text-green-600 flex items-center gap-1"
  }, /*#__PURE__*/React.createElement(DollarSign, {
    className: "w-5 h-5"
  }), (billing.total_amount || 0).toLocaleString())))))))));
}