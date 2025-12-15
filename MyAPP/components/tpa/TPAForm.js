import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, X } from "lucide-react";
export default function TPAForm({
  formData,
  setFormData,
  regions,
  channels,
  onCancel,
  onSubmit,
  isEditing
}) {
  const [selectedRegions, setSelectedRegions] = useState(formData.regions || []);
  const [selectedChannels, setSelectedChannels] = useState(formData.channels || []);
  const [sellerRates, setSellerRates] = useState(formData.seller_rates || {});

  // Sync with formData when editing
  React.useEffect(() => {
    setSelectedRegions(formData.regions || []);
    setSelectedChannels(formData.channels || []);
    setSellerRates(formData.seller_rates || {});
  }, [formData]);
  const handleSubmit = e => {
    e.preventDefault();
    onSubmit({
      ...formData,
      regions: selectedRegions,
      channels: selectedChannels,
      seller_rates: sellerRates
    });
  };
  return /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit,
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "TPA Name *"), /*#__PURE__*/React.createElement(Input, {
    value: formData.name,
    onChange: e => setFormData({
      ...formData,
      name: e.target.value
    }),
    required: true
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "Responsible Regions (Multi-select)"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-2 mt-2 max-h-32 overflow-y-auto p-2 border rounded"
  }, regions.map(region => /*#__PURE__*/React.createElement("div", {
    key: region.id,
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(Checkbox, {
    id: `region-${region.id}`,
    checked: selectedRegions.includes(region.name),
    onCheckedChange: checked => {
      if (checked) {
        setSelectedRegions([...selectedRegions, region.name]);
      } else {
        setSelectedRegions(selectedRegions.filter(r => r !== region.name));
        const newRates = {
          ...sellerRates
        };
        delete newRates[region.name];
        setSellerRates(newRates);
      }
    }
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: `region-${region.id}`,
    className: "text-sm cursor-pointer"
  }, region.name))))), selectedRegions.length > 0 && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "Seller Rates by Region *"), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2 mt-2"
  }, selectedRegions.map(region => /*#__PURE__*/React.createElement("div", {
    key: region,
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(Label, {
    className: "w-32 text-sm"
  }, region), /*#__PURE__*/React.createElement(Input, {
    type: "number",
    step: "0.01",
    placeholder: "Rate",
    value: sellerRates[region] || "",
    onChange: e => setSellerRates({
      ...sellerRates,
      [region]: parseFloat(e.target.value)
    }),
    required: true,
    className: "flex-1"
  }))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "Responsible Channels (Multi-select)"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-2 mt-2 max-h-32 overflow-y-auto p-2 border rounded"
  }, channels.map(channel => /*#__PURE__*/React.createElement("div", {
    key: channel.id,
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(Checkbox, {
    id: `channel-${channel.id}`,
    checked: selectedChannels.includes(channel.name),
    onCheckedChange: checked => {
      if (checked) {
        setSelectedChannels([...selectedChannels, channel.name]);
      } else {
        setSelectedChannels(selectedChannels.filter(c => c !== channel.name));
      }
    }
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: `channel-${channel.id}`,
    className: "text-sm cursor-pointer"
  }, channel.name))))), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-end gap-2 pt-2 border-t"
  }, /*#__PURE__*/React.createElement(Button, {
    type: "button",
    variant: "outline",
    onClick: onCancel
  }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
    type: "submit"
  }, isEditing ? "Update" : "Create")));
}