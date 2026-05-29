import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface FieldOption {
  label: string;
  value: string | number;
}

interface Field {
  key: string;
  label: string;
  type: string; // "text", "email", "number", "select", "radio", "checkbox", "textarea", "date", "file", etc.
  required?: boolean;
  placeholder?: string;
  options?: FieldOption[];
}

interface Schema {
  fields: Field[];
  submit_label?: string;
  success_message?: string;
}

interface DynamicFormProps {
  schema: Schema;
  defaultValues?: Record<string, any>;
  onSubmit: (data: Record<string, any>) => Promise<void>;
}

export default function DynamicForm({ schema, defaultValues = {}, onSubmit }: DynamicFormProps) {
  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm({ defaultValues });
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, field: Field) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setUploadingField(field.key);
      
      const formData = new FormData();
      formData.append("file", file);
      
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/upload`, {
          method: "POST",
          body: formData,
        });
        
        if (!res.ok) {
          const errorData = await res.json();
          toast.error(`Upload failed: ${errorData.detail || 'Unknown error'}`);
          return;
        }
        
        const data = await res.json();
        setValue(field.key, data.url, { shouldValidate: true });
        toast.success("File uploaded successfully");
      } catch (err) {
        console.error("Upload error", err);
        toast.error("Failed to upload file. Please try again.");
      } finally {
        setUploadingField(null);
      }
    }
  };

  const renderField = (field: Field) => {
    const { key, label, type, required, placeholder, options } = field;
    const reqRule = required ? { required: `${label} is required` } : {};
    const fieldValue = watch(key);
    
    switch (type) {
      case "text":
      case "email":
      case "number":
      case "password":
        return (
          <div key={key} className="space-y-2">
            <Label htmlFor={key} className="text-sm font-medium">
              {label} {required && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id={key}
              type={type}
              placeholder={placeholder}
              {...register(key, {
                ...reqRule,
                ...(type === "email" && {
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                }),
              })}
              className="w-full"
            />
            {errors[key] && (
              <p className="text-sm text-red-500">{errors[key]?.message as string}</p>
            )}
          </div>
        );
        
      case "date":
        return (
          <div key={key} className="space-y-2">
            <Label htmlFor={key} className="text-sm font-medium">
              {label} {required && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id={key}
              type="date"
              {...register(key, reqRule)}
              className="w-full"
            />
            {errors[key] && (
              <p className="text-sm text-red-500">{errors[key]?.message as string}</p>
            )}
          </div>
        );
        
      case "textarea":
        return (
          <div key={key} className="space-y-2">
            <Label htmlFor={key} className="text-sm font-medium">
              {label} {required && <span className="text-red-500">*</span>}
            </Label>
            <Textarea
              id={key}
              placeholder={placeholder}
              {...register(key, reqRule)}
              className="min-h-[100px]"
            />
            {errors[key] && (
              <p className="text-sm text-red-500">{errors[key]?.message as string}</p>
            )}
          </div>
        );
        
      case "select":
        return (
          <div key={key} className="space-y-2">
            <Label htmlFor={key} className="text-sm font-medium">
              {label} {required && <span className="text-red-500">*</span>}
            </Label>
            <Select
              onValueChange={(value) => setValue(key, value, { shouldValidate: true })}
              defaultValue={defaultValues[key]}
            >
              <SelectTrigger id={key} className="w-full">
                <SelectValue placeholder={`Select ${label}`} />
              </SelectTrigger>
              <SelectContent>
                {options?.map((opt) => (
                  <SelectItem key={opt.value.toString()} value={opt.value.toString()}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {required && !fieldValue && (
              <input
                {...register(key, reqRule)}
                className="hidden"
              />
            )}
            {errors[key] && (
              <p className="text-sm text-red-500">{errors[key]?.message as string}</p>
            )}
          </div>
        );
        
      case "radio":
        return (
          <div key={key} className="space-y-2">
            <Label className="text-sm font-medium">
              {label} {required && <span className="text-red-500">*</span>}
            </Label>
            <RadioGroup
              onValueChange={(value) => setValue(key, value, { shouldValidate: true })}
              defaultValue={defaultValues[key]}
              className="flex flex-col space-y-1"
            >
              {options?.map((opt) => (
                <div key={opt.value.toString()} className="flex items-center space-x-2">
                  <RadioGroupItem value={opt.value.toString()} id={`${key}-${opt.value}`} />
                  <Label htmlFor={`${key}-${opt.value}`}>{opt.label}</Label>
                </div>
              ))}
            </RadioGroup>
            {required && !fieldValue && (
              <input
                {...register(key, reqRule)}
                className="hidden"
              />
            )}
            {errors[key] && (
              <p className="text-sm text-red-500">{errors[key]?.message as string}</p>
            )}
          </div>
        );
        
      case "checkbox":
        return (
          <div key={key} className="flex items-start space-x-2 py-2">
            <Checkbox
              id={key}
              onCheckedChange={(checked) => {
                setValue(key, checked, { shouldValidate: true });
              }}
              defaultChecked={defaultValues[key]}
            />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor={key} className="text-sm font-medium">
                {label} {required && <span className="text-red-500">*</span>}
              </Label>
              {required && (
                <input
                  {...register(key, reqRule)}
                  className="hidden"
                  type="checkbox"
                />
              )}
              {errors[key] && (
                <p className="text-sm text-red-500">{errors[key]?.message as string}</p>
              )}
            </div>
          </div>
        );
        
      case "file":
        return (
          <div key={key} className="space-y-2">
            <Label htmlFor={key} className="text-sm font-medium">
              {label} {required && <span className="text-red-500">*</span>}
            </Label>
            <div className="flex flex-col space-y-2">
              <Input
                id={key}
                type="file"
                onChange={(e) => handleFileChange(e, field)}
                className="w-full cursor-pointer"
                disabled={uploadingField === key}
              />
              {uploadingField === key && (
                <p className="text-sm text-amber-500">Uploading...</p>
              )}
              {fieldValue && (
                <div className="text-sm text-muted-foreground">
                  Current file: <a href={fieldValue} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View uploaded file</a>
                </div>
              )}
              {required && (
                <input
                  {...register(key, reqRule)}
                  className="hidden"
                />
              )}
              {errors[key] && (
                <p className="text-sm text-red-500">{errors[key]?.message as string}</p>
              )}
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  const handleFormSubmit = async (data: Record<string, any>) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Failed to submit form. Please try again.");
    }
  };

  const submitLabel = schema.submit_label || "Submit";

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {schema.fields.map(renderField)}
      <Button
        type="submit"
        className="w-full bg-amber-500 hover:bg-amber-600 text-white"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : submitLabel}
      </Button>
    </form>
  );
} 