"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Navigation } from "@/components/navigation";
import {
  trackProjectCreationStarted,
  trackProjectCreated,
  setUserProperties,
} from "@/lib/tracking";
import { getUser, addProjectToUser } from "@/lib/storage";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const projectSchema = z.object({
  name: z.string().min(2, "Project name must be at least 2 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters"),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

export default function NewProjectPage() {
  const router = useRouter();
  const [user, setUser] = useState(getUser());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    const currentUser = getUser();

    if (!currentUser) {
      router.push("/signup");
      return;
    }

    if (!currentUser.plan) {
      router.push("/pricing");
      return;
    }

    setUser(currentUser);
  }, [router]);

  useEffect(() => {
    if (user && !hasStarted) {
      setHasStarted(true);
      trackProjectCreationStarted();
    }
  }, [user, hasStarted]);

  const onSubmit = async (values: ProjectFormValues) => {
    if (!user) return;

    setIsSubmitting(true);

    try {
      const project = {
        id: `project_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        name: values.name,
        description: values.description,
        createdAt: new Date().toISOString(),
      };

      // Add project to user
      const updatedUser = addProjectToUser(user, project);

      // Update user properties in PostHog
      setUserProperties({
        projects_count: updatedUser.projects.length,
        has_projects: true,
      });

      // Track project creation
      trackProjectCreated(project);

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("Project creation error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl">
            <Link
              href="/dashboard"
              className="mb-4 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>

            <div className="mb-8">
              <h1 className="text-3xl font-bold">Create New Project</h1>
              <p className="mt-2 text-muted-foreground">
                Set up a new analytics project to start tracking events
              </p>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="My Awesome Project"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Choose a name for your project
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <textarea
                          className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                          placeholder="Describe what this project is about..."
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Provide a brief description of your project
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/dashboard")}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Creating..." : "Create Project"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </main>
    </div>
  );
}

