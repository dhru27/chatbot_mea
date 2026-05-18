import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DynamicForm from "@/components/DynamicForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

interface FormMeta {
  id: string;
  name: string;
  description?: string;
  schema: any;
  created_at: string;
  updated_at: string;
}

export default function FormPage() {
  const { formId } = useParams<{ formId: string }>();
  const navigate = useNavigate();
  const [formMeta, setFormMeta] = useState<FormMeta | null>(null);
  const [defaultValues, setDefaultValues] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchFormData = async () => {
      if (!formId) {
        toast.error("Form ID is missing");
        navigate("/forms");
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/forms/${formId}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            toast.error("Form not found");
            navigate("/forms");
            return;
          }
          throw new Error(`Failed to fetch form: ${response.statusText}`);
        }
        
        const formData = await response.json();
        setFormMeta(formData);
        
        // Try to load saved form data from localStorage
        const savedFormKey = `formData_form_${formId}`;
        const savedForm = localStorage.getItem(savedFormKey);
        
        if (savedForm) {
          try {
            const parsedForm = JSON.parse(savedForm);
            setDefaultValues(parsedForm);
          } catch (err) {
            console.error("Error parsing saved form data:", err);
          }
        } else {
          // Try to load guest profile for pre-filling
          const guestProfile = localStorage.getItem("guest_profile");
          if (guestProfile) {
            try {
              const profile = JSON.parse(guestProfile);
              setDefaultValues(profile);
            } catch (err) {
              console.error("Error parsing guest profile:", err);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching form:", error);
        toast.error("Failed to load form");
      } finally {
        setLoading(false);
      }
    };

    fetchFormData();
  }, [formId, navigate]);

  const handleSubmit = async (data: Record<string, any>) => {
    if (!formId || !formMeta) return;
    
    setSubmitting(true);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/forms/${formId}/responses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: data
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Form submission failed");
      }

      // Save form data to localStorage
      localStorage.setItem(`formData_form_${formId}`, JSON.stringify(data));
      
      // Save guest profile for future pre-filling
      if (data.email) {
        const profile = {
          email: data.email,
          name: data.name || ""
        };
        localStorage.setItem("guest_profile", JSON.stringify(profile));
      }
      
      const successMessage = formMeta.schema.success_message || "Form submitted successfully!";
      toast.success(successMessage);
      
      // Redirect back to forms list after a short delay
      setTimeout(() => {
        navigate("/forms");
      }, 2000);
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error(`Submission failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container max-w-3xl mx-auto py-10 px-4">
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-6 w-full mb-8" />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/2 mb-2" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!formMeta) {
    return (
      <div className="container max-w-3xl mx-auto py-10 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Form Not Found</h1>
        <p className="mb-6">The form you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate("/forms")}>Back to Forms</Button>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">
        {formMeta.name}
      </h1>
      {formMeta.description && (
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {formMeta.description}
        </p>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Form Details</CardTitle>
          <CardDescription>
            Fields marked with an asterisk (*) are required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {formMeta.schema && (
            <DynamicForm
              schema={formMeta.schema}
              defaultValues={defaultValues}
              onSubmit={handleSubmit}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
} 