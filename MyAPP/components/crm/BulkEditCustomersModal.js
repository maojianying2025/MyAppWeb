import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const REGIONS = ["Region A", "Region B", "Region C"];
const ROLES = ["Viewer", "TPA", "SSS", "Manager", "Head", "Director"];

export default function BulkEditCustomersModal({ isOpen, onClose, onSubmit, selectedCount }) {
  const [formData, setFormData] = useState({
    region: "",
    follow_up_sss: "",
    program: "",
    signal: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const updates = {};
    Object.keys(formData).forEach(key => {
      if (formData[key]) {
        updates[key] = formData[key];
      }
    });
    onSubmit(updates);
    setFormData({ region: "", follow_up_sss: "", program: "", signal: "" });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bulk Edit Customers ({selectedCount} selected)</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-sm text-gray-600">Only filled fields will be updated, empty fields will remain unchanged</p>
          
          <div>
            <Label>Region</Label>
            <Select value={formData.region} onValueChange={(value) => setFormData({ ...formData, region: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select region" />
              </SelectTrigger>
              <SelectContent>
                {REGIONS.map(region => (
                  <SelectItem key={region} value={region}>{region}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Follow-up SSS</Label>
            <Select value={formData.follow_up_sss} onValueChange={(value) => setFormData({ ...formData, follow_up_sss: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map(role => (
                  <SelectItem key={role} value={role}>{role}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Program</Label>
            <Input
              value={formData.program}
              onChange={(e) => setFormData({ ...formData, program: e.target.value })}
              placeholder="Enter program name"
            />
          </div>

          <div>
            <Label>Signal Strength</Label>
            <Input
              value={formData.signal}
              onChange={(e) => setFormData({ ...formData, signal: e.target.value })}
              placeholder="Enter signal strength"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Bulk Update</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}