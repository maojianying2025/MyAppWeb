import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
export default function CreateCustomerModal({
  isOpen,
  onClose,
  onSubmit
}) {
  const [formData, setFormData] = useState({
    customer_name: "",
    code: "",
    region: "",
    channel: "",
    sub_channel: "",
    follow_up_sss: "",
    population: "",
    longitude: "",
    latitude: "",
    signal: "Good",
    address: "",
    program: "",
    contact_person: "",
    contact_phone: "",
    contact_email: ""
  });
  const [currentUser, setCurrentUser] = useState(null);
  const {
    data: organizations = []
  } = useQuery({
    queryKey: ['organizations'],
    queryFn: () => base44.entities.Organization.list(),
    enabled: isOpen
  });
  const {
    data: programs = []
  } = useQuery({
    queryKey: ['programs'],
    queryFn: () => base44.entities.Program.list(),
    enabled: isOpen
  });
  const regions = organizations.filter(o => o.type === "department");
  const channels = organizations.filter(o => o.type === "channel");
  const subChannels = organizations.filter(o => o.type === "subchannel");
  useEffect(() => {
    if (isOpen) {
      loadUser();
      generateCode();
    }
  }, [isOpen]);
  const loadUser = async () => {
    try {
      const user = await base44.auth.me();
      setCurrentUser(user);
      setFormData(prev => ({
        ...prev,
        follow_up_sss: user.email
      }));
    } catch (err) {
      console.error("Failed to load user", err);
    }
  };
  const generateCode = async () => {
    try {
      const customers = await base44.entities.Customer.list();
      const codes = customers.map(c => c.code).filter(code => /^S\d{4}$/.test(code)).map(code => parseInt(code.substring(1)));
      if (codes.length === 0) {
        setFormData(prev => ({
          ...prev,
          code: "S0001"
        }));
        return;
      }
      codes.sort((a, b) => a - b);
      let nextCode = 1;
      for (let i = 0; i < codes.length; i++) {
        if (codes[i] !== nextCode) {
          break;
        }
        nextCode++;
      }
      setFormData(prev => ({
        ...prev,
        code: `S${String(nextCode).padStart(4, '0')}`
      }));
    } catch (err) {
      console.error("Failed to generate code", err);
      setFormData(prev => ({
        ...prev,
        code: "S0001"
      }));
    }
  };
  const handleSubmit = e => {
    e.preventDefault();
    const dataToSubmit = {
      ...formData,
      customer_name: formData.customer_name.toUpperCase(),
      population: formData.population ? parseFloat(formData.population) : undefined,
      longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
      latitude: formData.latitude ? parseFloat(formData.latitude) : undefined
    };
    onSubmit(dataToSubmit);
    setFormData({
      customer_name: "",
      code: "",
      region: "",
      channel: "",
      sub_channel: "",
      follow_up_sss: "",
      population: "",
      longitude: "",
      latitude: "",
      signal: "Good",
      address: "",
      program: "",
      contact_person: "",
      contact_phone: "",
      contact_email: ""
    });
  };
  return /*#__PURE__*/React.createElement(Dialog, {
    open: isOpen,
    onOpenChange: onClose
  }, /*#__PURE__*/React.createElement(DialogContent, {
    className: "max-w-3xl max-h-[90vh] overflow-y-auto"
  }, /*#__PURE__*/React.createElement(DialogHeader, null, /*#__PURE__*/React.createElement(DialogTitle, {
    className: "text-xl"
  }, "Create New Customer")), /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit,
    className: "space-y-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-2 gap-3"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    className: "text-sm font-medium"
  }, "Customer Name *"), /*#__PURE__*/React.createElement(Input, {
    value: formData.customer_name,
    onChange: e => setFormData({
      ...formData,
      customer_name: e.target.value
    }),
    placeholder: "Auto-converts to uppercase",
    required: true,
    className: "mt-1"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    className: "text-sm font-medium"
  }, "Customer Code *"), /*#__PURE__*/React.createElement(Input, {
    value: formData.code,
    onChange: e => setFormData({
      ...formData,
      code: e.target.value
    }),
    required: true,
    className: "mt-1"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-3 gap-3"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    className: "text-sm font-medium"
  }, "Region"), /*#__PURE__*/React.createElement(Select, {
    value: formData.region,
    onValueChange: value => setFormData({
      ...formData,
      region: value
    })
  }, /*#__PURE__*/React.createElement(SelectTrigger, {
    className: "mt-1"
  }, /*#__PURE__*/React.createElement(SelectValue, {
    placeholder: "Select"
  })), /*#__PURE__*/React.createElement(SelectContent, null, regions.map(region => /*#__PURE__*/React.createElement(SelectItem, {
    key: region.id,
    value: region.name
  }, region.name))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    className: "text-sm font-medium"
  }, "Channel"), /*#__PURE__*/React.createElement(Select, {
    value: formData.channel,
    onValueChange: value => setFormData({
      ...formData,
      channel: value
    })
  }, /*#__PURE__*/React.createElement(SelectTrigger, {
    className: "mt-1"
  }, /*#__PURE__*/React.createElement(SelectValue, {
    placeholder: "Select"
  })), /*#__PURE__*/React.createElement(SelectContent, null, channels.map(channel => /*#__PURE__*/React.createElement(SelectItem, {
    key: channel.id,
    value: channel.name
  }, channel.name))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    className: "text-sm font-medium"
  }, "Sub-Channel"), /*#__PURE__*/React.createElement(Select, {
    value: formData.sub_channel,
    onValueChange: value => setFormData({
      ...formData,
      sub_channel: value
    })
  }, /*#__PURE__*/React.createElement(SelectTrigger, {
    className: "mt-1"
  }, /*#__PURE__*/React.createElement(SelectValue, {
    placeholder: "Select"
  })), /*#__PURE__*/React.createElement(SelectContent, null, subChannels.map(subChannel => /*#__PURE__*/React.createElement(SelectItem, {
    key: subChannel.id,
    value: subChannel.name
  }, subChannel.name)))))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-2 gap-3"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    className: "text-sm font-medium"
  }, "Follow-up SSS"), /*#__PURE__*/React.createElement(Input, {
    value: currentUser?.full_name || currentUser?.email || "",
    disabled: true,
    className: "bg-gray-50 mt-1"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    className: "text-sm font-medium"
  }, "Program"), /*#__PURE__*/React.createElement(Select, {
    value: formData.program,
    onValueChange: value => setFormData({
      ...formData,
      program: value
    })
  }, /*#__PURE__*/React.createElement(SelectTrigger, {
    className: "mt-1"
  }, /*#__PURE__*/React.createElement(SelectValue, {
    placeholder: "Select"
  })), /*#__PURE__*/React.createElement(SelectContent, null, programs.map(prog => /*#__PURE__*/React.createElement(SelectItem, {
    key: prog.id,
    value: prog.name
  }, prog.name)))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    className: "text-sm font-medium"
  }, "Address"), /*#__PURE__*/React.createElement(Input, {
    value: formData.address,
    onChange: e => setFormData({
      ...formData,
      address: e.target.value
    }),
    placeholder: "Full address",
    className: "mt-1"
  })), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-3 gap-3"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    className: "text-sm font-medium"
  }, "Population"), /*#__PURE__*/React.createElement(Input, {
    type: "number",
    value: formData.population,
    onChange: e => setFormData({
      ...formData,
      population: e.target.value
    }),
    className: "mt-1"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    className: "text-sm font-medium"
  }, "Longitude"), /*#__PURE__*/React.createElement(Input, {
    type: "number",
    step: "any",
    value: formData.longitude,
    onChange: e => setFormData({
      ...formData,
      longitude: e.target.value
    }),
    className: "mt-1"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    className: "text-sm font-medium"
  }, "Latitude"), /*#__PURE__*/React.createElement(Input, {
    type: "number",
    step: "any",
    value: formData.latitude,
    onChange: e => setFormData({
      ...formData,
      latitude: e.target.value
    }),
    className: "mt-1"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "space-y-3 pt-2 border-t"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    className: "text-sm font-medium"
  }, "Contact Person"), /*#__PURE__*/React.createElement(Input, {
    value: formData.contact_person,
    onChange: e => setFormData({
      ...formData,
      contact_person: e.target.value
    }),
    placeholder: "Full name",
    className: "mt-1"
  })), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-2 gap-3"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    className: "text-sm font-medium"
  }, "Contact Phone"), /*#__PURE__*/React.createElement(Input, {
    value: formData.contact_phone,
    onChange: e => setFormData({
      ...formData,
      contact_phone: e.target.value
    }),
    placeholder: "Phone number",
    className: "mt-1"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, {
    className: "text-sm font-medium"
  }, "Contact Email"), /*#__PURE__*/React.createElement(Input, {
    type: "email",
    value: formData.contact_email,
    onChange: e => setFormData({
      ...formData,
      contact_email: e.target.value
    }),
    placeholder: "Email address",
    className: "mt-1"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-end gap-2 pt-3 border-t"
  }, /*#__PURE__*/React.createElement(Button, {
    type: "button",
    variant: "outline",
    onClick: onClose
  }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    className: "bg-blue-600 hover:bg-blue-700"
  }, "Create Customer")))));
}