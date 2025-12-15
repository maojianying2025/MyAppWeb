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

  const { data: billings = [], isLoading } = useQuery({
    queryKey: ['tpa-billings'],
    queryFn: () => base44.entities.TPABilling.list('-billing_date', 500),
  });

  // Filter by date range
  const filteredBillings = billings.filter(b => {
    if (!b.billing_date) return true;
    const date = b.billing_date.split('T')[0];
    return date >= dateRange.start && date <= dateRange.end;
  });

  const handleExport = () => {
    const csvContent = [
      ["TPA Name", "Activity Session", "Required Sellers", "Actual Sellers", "Approved Sellers", "Seller Rate", "Total Amount", "Status", "Billing Date"],
      ...filteredBillings.map(b => [
        b.tpa_name,
        b.activity_session,
        b.required_sellers || 0,
        b.actual_sellers || 0,
        b.approved_sellers || 0,
        b.seller_rate || 0,
        b.total_amount || 0,
        b.status,
        b.billing_date ? b.billing_date.split('T')[0] : ""
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tpa_billing_${dateRange.start}_to_${dateRange.end}.csv`;
    a.click();
  };

  const totalAmount = filteredBillings.reduce((sum, b) => sum + (b.total_amount || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-3 md:p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">TPA Billing</h1>
            <p className="text-sm text-gray-600">{filteredBillings.length} billing records</p>
          </div>
          <Button onClick={handleExport} size="sm">
            <Download className="w-4 h-4 mr-1" /> Export
          </Button>
        </div>

        {/* Date Range Filter */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <Label className="text-sm">Date Range:</Label>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  className="w-40"
                />
                <span className="text-gray-500">to</span>
                <Input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  className="w-40"
                />
              </div>
              <div className="ml-auto">
                <div className="text-sm text-gray-600">Total Amount</div>
                <div className="text-2xl font-bold text-green-600">
                  ${totalAmount.toLocaleString()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Billing Cards */}
        <div className="space-y-3">
          {isLoading ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="animate-pulse">Loading...</div>
              </CardContent>
            </Card>
          ) : filteredBillings.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500">No billing records found for this period</p>
              </CardContent>
            </Card>
          ) : (
            filteredBillings.map((billing) => (
              <Card key={billing.id} className="hover:shadow-lg transition-shadow border">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{billing.tpa_name}</h3>
                        <Badge 
                          variant="outline"
                          className={
                            billing.status === "paid" ? "bg-green-50 text-green-700" :
                            billing.status === "approved" ? "bg-blue-50 text-blue-700" :
                            billing.status === "pending" ? "bg-yellow-50 text-yellow-700" :
                            "bg-gray-50 text-gray-700"
                          }
                        >
                          {billing.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div>Session: {billing.activity_session}</div>
                        <div className="flex gap-4">
                          <span>Required: {billing.required_sellers || 0}</span>
                          <span>Actual: {billing.actual_sellers || 0}</span>
                          <span>Approved: {billing.approved_sellers || 0}</span>
                        </div>
                        <div>Rate: ${billing.seller_rate || 0} per seller</div>
                        {billing.billing_date && (
                          <div className="flex items-center gap-1 text-gray-500">
                            <Calendar className="w-3 h-3" />
                            {billing.billing_date.split('T')[0]}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Total Amount</div>
                      <div className="text-2xl font-bold text-green-600 flex items-center gap-1">
                        <DollarSign className="w-5 h-5" />
                        {(billing.total_amount || 0).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}