import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface FormData {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export default function FormsListPage() {
  const [forms, setForms] = useState<FormData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/forms`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch forms: ${response.statusText}`);
        }
        
        const data = await response.json();
        setForms(data);
      } catch (error) {
        console.error("Error fetching forms:", error);
        setError("Failed to load forms. Please try again later.");
        toast.error("Failed to load forms");
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">Forms</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Browse and fill out available forms.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="h-full">
              <CardHeader>
                <Skeleton className="h-8 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-10 px-4 text-center">
        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">Forms</h1>
        <p className="text-red-500 mb-6">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  if (forms.length === 0) {
    return (
      <div className="container mx-auto py-10 px-4 text-center">
        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">Forms</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          No forms are currently available.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">Forms</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Browse and fill out available forms.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {forms.map((form) => (
          <motion.div
            key={form.id}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="h-full flex flex-col border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 dark:bg-gray-800/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900 dark:text-gray-100">{form.name}</CardTitle>
                {form.description && (
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    {form.description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Last updated: {new Date(form.updated_at).toLocaleDateString()}
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  asChild
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white transition-colors duration-200"
                >
                  <Link to={`/forms/${form.id}`}>Open Form</Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 