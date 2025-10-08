import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface EditStepDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  step: {
    id: string;
    label: string;
    details?: string[];
  } | null;
  onSave: (details: string[]) => void;
}

export const EditStepDialog = ({ open, onOpenChange, step, onSave }: EditStepDialogProps) => {
  const [editedDetails, setEditedDetails] = useState<string[]>(step?.details || []);
  const [newDetail, setNewDetail] = useState("");

  const handleSave = () => {
    onSave(editedDetails);
    onOpenChange(false);
  };

  const handleAddDetail = () => {
    if (newDetail.trim()) {
      setEditedDetails([...editedDetails, newDetail.trim()]);
      setNewDetail("");
    }
  };

  const handleRemoveDetail = (index: number) => {
    setEditedDetails(editedDetails.filter((_, i) => i !== index));
  };

  if (!step) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit {step.label}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Configuration Details</Label>
            <div className="space-y-2">
              {editedDetails.map((detail, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={detail}
                    onChange={(e) => {
                      const updated = [...editedDetails];
                      updated[index] = e.target.value;
                      setEditedDetails(updated);
                    }}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveDetail(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Add New Detail</Label>
            <div className="flex gap-2">
              <Input
                value={newDetail}
                onChange={(e) => setNewDetail(e.target.value)}
                placeholder="Enter new configuration detail..."
                onKeyPress={(e) => e.key === "Enter" && handleAddDetail()}
                className="flex-1"
              />
              <Button onClick={handleAddDetail}>Add</Button>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="gradient-primary">
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
