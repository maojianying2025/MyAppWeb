import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Phone, Building, MapPin, Shield, Save } from "lucide-react";
import { useQueryClient, useMutation } from "@tanstack/react-query";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    nickname: "",
    dito_email: "",
    contact_phone: ""
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);
      setFormData({
        nickname: userData.nickname || "",
        dito_email: userData.dito_email || "",
        contact_phone: userData.contact_phone || ""
      });
    } catch (err) {
      console.error("Failed to load user", err);
    } finally {
      setLoading(false);
    }
  };

  const updateMutation = useMutation({
    mutationFn: (data) => base44.auth.updateMe(data),
    onSuccess: () => {
      queryClient.invalidateQueries();
      loadUser();
      alert("Profile updated successfully!");
    },
    onError: (err) => {
      alert("Failed to update profile: " + err.message);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your personal information and settings</p>
        </div>

        <div className="grid gap-6">
          {/* Read-only Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <User className="w-5 h-5" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-600 text-sm">Email</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">{user?.email || "N/A"}</span>
                  </div>
                </div>
                <div>
                  <Label className="text-gray-600 text-sm">Role</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Shield className="w-4 h-4 text-gray-400" />
                    <span className="font-medium capitalize">{user?.role || "N/A"}</span>
                  </div>
                </div>
                <div>
                  <Label className="text-gray-600 text-sm">Organization</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Building className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">{user?.organization || "N/A"}</span>
                  </div>
                </div>
                <div>
                  <Label className="text-gray-600 text-sm">Region</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">{user?.region || "N/A"}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Editable Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Nickname *</Label>
                  <Input
                    value={formData.nickname}
                    onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                    placeholder="Enter your display name"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">This name will be displayed publicly</p>
                </div>

                <div>
                  <Label>DITO Email *</Label>
                  <Input
                    type="email"
                    value={formData.dito_email}
                    onChange={(e) => setFormData({ ...formData, dito_email: e.target.value })}
                    placeholder="your.email@dito.com"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">This email will be used for external communication</p>
                </div>

                <div>
                  <Label>Contact Phone *</Label>
                  <Input
                    type="tel"
                    value={formData.contact_phone}
                    onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                    placeholder="+1234567890"
                    required
                  />
                </div>

                <div className="flex justify-end pt-4">
                  <Button type="submit" disabled={updateMutation.isPending}>
                    <Save className="w-4 h-4 mr-2" />
                    {updateMutation.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}