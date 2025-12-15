import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Phone, Mail, Plus, Edit, ChevronDown, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import CreateCustomerModal from "../components/crm/CreateCustomerModal";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export default function CrmCustomers() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [expandedChannels, setExpandedChannels] = useState({});

  const { data: customers = [], isLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      try {
        return await base44.entities.Customer.list("-created_date", 500);
      } catch (err) {
        console.error("Error loading customers:", err);
        return [];
      }
    },
    staleTime: 30000,
    retry: 1
  });

  const { data: regions = [] } = useQuery({
    queryKey: ['regions'],
    queryFn: () => base44.entities.Region.list('-created_date', 100),
  });

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: () => base44.entities.User.list('-created_date', 500),
  });

  // Map region colors and follow-up names
  const regionColorMap = regions.reduce((acc, r) => {
    acc[r.name] = r.color;
    return acc;
  }, {});

  const userNameMap = users.reduce((acc, u) => {
    acc[u.email] = u.nickname || u.full_name;
    return acc;
  }, {});

  const enrichedCustomers = customers.map(c => ({
    ...c,
    region_color: regionColorMap[c.region],
    follow_up_display: userNameMap[c.follow_up_sss] || c.follow_up_sss
  }));

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Customer.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      setShowCreateModal(false);
    },
  });

  const filteredCustomers = enrichedCustomers.filter(customer => {
    if (!searchQuery) return true;
    return customer.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.channel?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Group customers by channel
  const customersByChannel = filteredCustomers.reduce((acc, customer) => {
    const channel = customer.channel || "Uncategorized";
    if (!acc[channel]) acc[channel] = [];
    acc[channel].push(customer);
    return acc;
  }, {});

  const channelKeys = Object.keys(customersByChannel).sort();

  const toggleChannel = (channel) => {
    setExpandedChannels(prev => ({
      ...prev,
      [channel]: !prev[channel]
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-3">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
            {[1, 2, 3].map(i => <div key={i} className="h-32 bg-gray-200 rounded"></div>)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-3 md:p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
            <p className="text-sm text-gray-600">{filteredCustomers.length} customers</p>
          </div>
          <Button onClick={() => setShowCreateModal(true)} size="sm">
            <Plus className="w-4 h-4 mr-1" /> New Customer
          </Button>
        </div>

        <Card className="mb-4">
          <CardContent className="p-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search customers..."
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          {channelKeys.map(channel => {
            const channelCustomers = customersByChannel[channel];
            const isExpanded = expandedChannels[channel] !== false; // Default expanded
            
            return (
              <Card key={channel} className="border-2">
                <Collapsible open={isExpanded} onOpenChange={() => toggleChannel(channel)}>
                  <CollapsibleTrigger className="w-full">
                    <CardHeader className="p-3 hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                          <h3 className="font-semibold text-base">{channel}</h3>
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                            {channelCustomers.length}
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="p-3 pt-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {channelCustomers.map(customer => (
                          <Card key={customer.id} className="hover:shadow-md transition-shadow border">
                            <CardContent className="p-3">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold text-sm truncate">{customer.customer_name}</h4>
                                  <span className="text-xs font-mono bg-gray-100 px-1.5 py-0.5 rounded">
                                    {customer.code}
                                  </span>
                                </div>
                                <Link to={createPageUrl(`CustomerDetail?id=${customer.id}`)}>
                                  <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                                    <Edit className="w-3 h-3" />
                                  </Button>
                                </Link>
                              </div>

                              <div className="text-xs space-y-1">
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Region:</span>
                                  <Badge 
                                    variant="outline" 
                                    className="text-xs"
                                    style={{ 
                                      backgroundColor: customer.region_color ? customer.region_color + "20" : "#3B82F620",
                                      color: customer.region_color || "#3B82F6",
                                      borderColor: customer.region_color || "#3B82F6"
                                    }}
                                  >
                                    {customer.region || "N/A"}
                                  </Badge>
                                </div>
                                
                                {customer.address && (
                                  <div className="flex items-start gap-1 text-gray-600 pt-1">
                                    <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                    <span className="line-clamp-1">{customer.address}</span>
                                  </div>
                                )}

                                {customer.follow_up_sss && (
                                  <div className="text-gray-600 pt-1">
                                    Follow-up: {customer.follow_up_display}
                                  </div>
                                )}
                                
                                {customer.program && (
                                  <div className="flex flex-wrap gap-1 pt-1">
                                    {(Array.isArray(customer.program) ? customer.program : [customer.program]).map((prog, idx) => (
                                      <Badge key={idx} variant="secondary" className="text-xs">
                                        {prog}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            );
          })}
        </div>

        {filteredCustomers.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">No customers found</p>
            </CardContent>
          </Card>
        )}

        <CreateCustomerModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={(data) => createMutation.mutate(data)}
        />
      </div>
    </div>
  );
}