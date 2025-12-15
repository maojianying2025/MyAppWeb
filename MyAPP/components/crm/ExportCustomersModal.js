import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const FIELDS = [
  { key: "customer_name", label: "Customer Name" },
  { key: "code", label: "Customer Code" },
  { key: "region", label: "Region" },
  { key: "channel", label: "Channel" },
  { key: "sub_channel", label: "Sub-Channel" },
  { key: "follow_up_sss", label: "Follow-up SSS" },
  { key: "population", label: "Population" },
  { key: "address", label: "Address" },
  { key: "program", label: "Program" },
  { key: "contact_person", label: "Contact Person" },
  { key: "contact_phone", label: "Contact Phone" },
  { key: "contact_email", label: "Contact Email" }
];

export default function ExportCustomersModal({ isOpen, onClose, onExport }) {
  const [selectedFields, setSelectedFields] = useState(FIELDS.map(f => f.key));

  const toggleField = (fieldKey) => {
    setSelectedFields(prev =>
      prev.includes(fieldKey)
        ? prev.filter(k => k !== fieldKey)
        : [...prev, fieldKey]
    );
  };

  const handleExport = () => {
    onExport(selectedFields);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Customer Data</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Select fields to export:</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {FIELDS.map(field => (
                <div key={field.key} className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedFields.includes(field.key)}
                    onCheckedChange={() => toggleField(field.key)}
                  />
                  <label className="text-sm">{field.label}</label>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleExport}>
              Export as CSV
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}