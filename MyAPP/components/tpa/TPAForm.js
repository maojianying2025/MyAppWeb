import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, X } from "lucide-react";

export default function TPAForm({ formData, setFormData, regions, channels, onCancel, onSubmit, isEditing }) {
  const [selectedRegions, setSelectedRegions] = useState(formData.regions || []);
  const [selectedChannels, setSelectedChannels] = useState(formData.channels || []);
  const [sellerRates, setSellerRates] = useState(formData.seller_rates || {});
  
  // Sync with formData when editing
  React.useEffect(() => {
    setSelectedRegions(formData.regions || []);
    setSelectedChannels(formData.channels || []);
    setSellerRates(formData.seller_rates || {});
  }, [formData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      regions: selectedRegions,
      channels: selectedChannels,
      seller_rates: sellerRates
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>TPA Name *</Label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div>
        <Label>Responsible Regions (Multi-select)</Label>
        <div className="grid grid-cols-2 gap-2 mt-2 max-h-32 overflow-y-auto p-2 border rounded">
          {regions.map(region => (
            <div key={region.id} className="flex items-center gap-2">
              <Checkbox
                id={`region-${region.id}`}
                checked={selectedRegions.includes(region.name)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedRegions([...selectedRegions, region.name]);
                  } else {
                    setSelectedRegions(selectedRegions.filter(r => r !== region.name));
                    const newRates = { ...sellerRates };
                    delete newRates[region.name];
                    setSellerRates(newRates);
                  }
                }}
              />
              <label htmlFor={`region-${region.id}`} className="text-sm cursor-pointer">
                {region.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      {selectedRegions.length > 0 && (
        <div>
          <Label>Seller Rates by Region *</Label>
          <div className="space-y-2 mt-2">
            {selectedRegions.map(region => (
              <div key={region} className="flex items-center gap-2">
                <Label className="w-32 text-sm">{region}</Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Rate"
                  value={sellerRates[region] || ""}
                  onChange={(e) => setSellerRates({ ...sellerRates, [region]: parseFloat(e.target.value) })}
                  required
                  className="flex-1"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <Label>Responsible Channels (Multi-select)</Label>
        <div className="grid grid-cols-2 gap-2 mt-2 max-h-32 overflow-y-auto p-2 border rounded">
          {channels.map(channel => (
            <div key={channel.id} className="flex items-center gap-2">
              <Checkbox
                id={`channel-${channel.id}`}
                checked={selectedChannels.includes(channel.name)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedChannels([...selectedChannels, channel.name]);
                  } else {
                    setSelectedChannels(selectedChannels.filter(c => c !== channel.name));
                  }
                }}
              />
              <label htmlFor={`channel-${channel.id}`} className="text-sm cursor-pointer">
                {channel.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{isEditing ? "Update" : "Create"}</Button>
      </div>
    </form>
  );
}