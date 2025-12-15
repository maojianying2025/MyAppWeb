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
    mutationFn: data => base44.auth.updateMe(data),
    onSuccess: () => {
      queryClient.invalidateQueries();
      loadUser();
      alert("Profile updated successfully!");
    },
    onError: err => {
      alert("Failed to update profile: " + err.message);
    }
  });
  const handleSubmit = e => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };
  if (loading) {
    return /*#__PURE__*/React.createElement("div", {
      className: "min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 flex items-center justify-center"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-gray-500"
    }, "Loading..."));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "max-w-4xl mx-auto"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-8"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "text-3xl md:text-4xl font-bold text-gray-900 mb-2"
  }, "My Profile"), /*#__PURE__*/React.createElement("p", {
    className: "text-gray-600"
  }, "Manage your personal information and settings")), /*#__PURE__*/React.createElement("div", {
    className: "grid gap-6"
  }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardHeader, null, /*#__PURE__*/React.createElement(CardTitle, {
    className: "text-xl flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(User, {
    className: "w-5 h-5"
  }), "Account Information")), /*#__PURE__*/React.createElement(CardContent, {
    className: "grid gap-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-2 gap-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    className: "text-gray-600 text-sm"
  }, "Email"), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 mt-1"
  }, /*#__PURE__*/React.createElement(Mail, {
    className: "w-4 h-4 text-gray-400"
  }), /*#__PURE__*/React.createElement("span", {
    className: "font-medium"
  }, user?.email || "N/A"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    className: "text-gray-600 text-sm"
  }, "Role"), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 mt-1"
  }, /*#__PURE__*/React.createElement(Shield, {
    className: "w-4 h-4 text-gray-400"
  }), /*#__PURE__*/React.createElement("span", {
    className: "font-medium capitalize"
  }, user?.role || "N/A"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    className: "text-gray-600 text-sm"
  }, "Organization"), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 mt-1"
  }, /*#__PURE__*/React.createElement(Building, {
    className: "w-4 h-4 text-gray-400"
  }), /*#__PURE__*/React.createElement("span", {
    className: "font-medium"
  }, user?.organization || "N/A"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    className: "text-gray-600 text-sm"
  }, "Region"), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 mt-1"
  }, /*#__PURE__*/React.createElement(MapPin, {
    className: "w-4 h-4 text-gray-400"
  }), /*#__PURE__*/React.createElement("span", {
    className: "font-medium"
  }, user?.region || "N/A")))))), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardHeader, null, /*#__PURE__*/React.createElement(CardTitle, {
    className: "text-xl flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(User, {
    className: "w-5 h-5"
  }), "Personal Information")), /*#__PURE__*/React.createElement(CardContent, null, /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit,
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "Nickname *"), /*#__PURE__*/React.createElement(Input, {
    value: formData.nickname,
    onChange: e => setFormData({
      ...formData,
      nickname: e.target.value
    }),
    placeholder: "Enter your display name",
    required: true
  }), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-500 mt-1"
  }, "This name will be displayed publicly")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "DITO Email *"), /*#__PURE__*/React.createElement(Input, {
    type: "email",
    value: formData.dito_email,
    onChange: e => setFormData({
      ...formData,
      dito_email: e.target.value
    }),
    placeholder: "your.email@dito.com",
    required: true
  }), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-500 mt-1"
  }, "This email will be used for external communication")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "Contact Phone *"), /*#__PURE__*/React.createElement(Input, {
    type: "tel",
    value: formData.contact_phone,
    onChange: e => setFormData({
      ...formData,
      contact_phone: e.target.value
    }),
    placeholder: "+1234567890",
    required: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-end pt-4"
  }, /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    disabled: updateMutation.isPending
  }, /*#__PURE__*/React.createElement(Save, {
    className: "w-4 h-4 mr-2"
  }), updateMutation.isPending ? "Saving..." : "Save Changes"))))))));
}