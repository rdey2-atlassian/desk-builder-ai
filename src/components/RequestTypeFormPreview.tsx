import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Clock } from "lucide-react";

interface Field {
  id: string;
  label: string;
  type: string;
  required?: boolean;
  placeholder?: string;
  options?: string[];
  readonly?: boolean;
  policy_hint?: string;
}

interface RequestType {
  key: string;
  name: string;
  fields: Field[];
  routing?: { priority?: string };
  escalations?: Array<{ if: string; then: string }>;
}

interface RequestTypeFormPreviewProps {
  requestType: RequestType;
}

export const RequestTypeFormPreview = ({ requestType }: RequestTypeFormPreviewProps) => {
  const hasUrgentEscalation = requestType.escalations?.some((e) => e.if.includes("hours_to_departure<48"));
  const isPriority = requestType.routing?.priority === "P1";

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold">{requestType.name}</h3>
          <p className="text-sm text-muted-foreground">Request type: {requestType.key}</p>
        </div>
        {isPriority && (
          <Badge variant="destructive" className="gap-1">
            <AlertCircle className="h-3 w-3" />
            P1 Priority
          </Badge>
        )}
      </div>

      {hasUrgentEscalation && (
        <Card className="p-3 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900">
          <div className="flex items-start gap-2">
            <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-amber-900 dark:text-amber-100">Time-sensitive request</p>
              <p className="text-amber-700 dark:text-amber-300">Auto-escalates to P1 if departure is within 48 hours</p>
            </div>
          </div>
        </Card>
      )}

      <div className="space-y-4 pt-2">
        {requestType.fields.map((field) => (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
              {field.policy_hint && (
                <span className="text-xs text-muted-foreground ml-2">({field.policy_hint})</span>
              )}
            </Label>

            {field.type === "text" && (
              <Input
                id={field.id}
                placeholder={field.placeholder}
                readOnly={field.readonly}
                className={field.readonly ? "bg-muted" : ""}
              />
            )}

            {field.type === "textarea" && (
              <Textarea id={field.id} placeholder={field.placeholder} rows={3} />
            )}

            {field.type === "date" && (
              <Input id={field.id} type="date" />
            )}

            {field.type === "select" && field.options && (
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                  {field.options.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {field.type === "boolean" && (
              <div className="flex items-center gap-2">
                <Checkbox id={field.id} />
                <Label htmlFor={field.id} className="font-normal cursor-pointer">
                  Yes
                </Label>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
