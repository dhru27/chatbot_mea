import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DynamicForm from "@/components/DynamicForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, Clock, MapPin, Users } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

interface EventData {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  start_datetime: string;
  end_datetime?: string;
  location?: string;
  capacity?: number;
  form_id?: string;
}

export default function RegisterPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const [eventData, setEventData] = useState<EventData | null>(null);
  const [formSchema, setFormSchema] = useState<any>(null);
  const [defaultValues, setDefaultValues] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchEventData = async () => {
      if (!eventId) {
        toast.error("Event ID is missing");
        navigate("/events");
        return;
      }

      try {
        // Fetch event details
        const eventRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/events/${eventId}`);
        
        if (!eventRes.ok) {
          if (eventRes.status === 404) {
            toast.error("Event not found");
            navigate("/events");
            return;
          }
          throw new Error(`Failed to fetch event: ${eventRes.statusText}`);
        }
        
        const eventData = await eventRes.json();
        setEventData(eventData);
        
        // If event has a form_id, fetch the form schema
        if (eventData.form_id) {
          const formRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/forms/${eventData.form_id}`);
          
          if (!formRes.ok) {
            throw new Error(`Failed to fetch form: ${formRes.statusText}`);
          }
          
          const formData = await formRes.json();
          setFormSchema(formData.schema);
          
          // Try to load saved form data from localStorage
          const savedFormKey = `formData_event_${eventId}`;
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
        } else {
          // If no form_id, create a default form schema
          setFormSchema({
            fields: [
              {
                key: "email",
                label: "Email",
                type: "email",
                required: true,
                placeholder: "your.email@example.com"
              },
              {
                key: "name",
                label: "Full Name",
                type: "text",
                required: true,
                placeholder: "John Doe"
              },
              {
                key: "comments",
                label: "Comments",
                type: "textarea",
                required: false,
                placeholder: "Any additional information..."
              }
            ],
            submit_label: "Register for Event"
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load event information");
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [eventId, navigate]);

  const handleSubmit = async (data: Record<string, any>) => {
    if (!eventId || !eventData) return;
    
    setSubmitting(true);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/registrations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event_id: eventId,
          data: data
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Registration failed");
      }

      // Save form data to localStorage
      localStorage.setItem(`formData_event_${eventId}`, JSON.stringify(data));
      
      // Save guest profile for future pre-filling
      if (data.email) {
        const profile = {
          email: data.email,
          name: data.name || ""
        };
        localStorage.setItem("guest_profile", JSON.stringify(profile));
      }
      
      toast.success("Registration successful! A confirmation email has been sent.");
      
      // Redirect back to events page after a short delay
      setTimeout(() => {
        navigate("/events");
      }, 2000);
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(`Registration failed: ${error instanceof Error ? error.message : "Unknown error"}`);
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

  if (!eventData) {
    return (
      <div className="container max-w-3xl mx-auto py-10 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
        <p className="mb-6">The event you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate("/events")}>Back to Events</Button>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">
        Register for Event
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Please fill out the form below to register for this event.
      </p>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">{eventData.title}</CardTitle>
          {eventData.description && (
            <CardDescription className="text-base">{eventData.description}</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {eventData.start_datetime && (
              <div className="flex items-center">
                <CalendarIcon className="h-5 w-5 mr-2 text-amber-500" />
                <span>
                  {format(new Date(eventData.start_datetime), "MMMM d, yyyy")}
                </span>
              </div>
            )}
            {eventData.start_datetime && (
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-amber-500" />
                <span>
                  {format(new Date(eventData.start_datetime), "h:mm a")}
                  {eventData.end_datetime && ` - ${format(new Date(eventData.end_datetime), "h:mm a")}`}
                </span>
              </div>
            )}
            {eventData.location && (
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-amber-500" />
                <span>{eventData.location}</span>
              </div>
            )}
            {eventData.capacity && (
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-amber-500" />
                <span>Capacity: {eventData.capacity}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Registration Form</CardTitle>
          <CardDescription>
            Fields marked with an asterisk (*) are required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {formSchema && (
            <DynamicForm
              schema={formSchema}
              defaultValues={defaultValues}
              onSubmit={handleSubmit}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
} 