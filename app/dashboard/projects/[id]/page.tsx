"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Navigation } from "@/components/navigation";
import { trackProjectViewed } from "@/lib/tracking";
import { getUser } from "@/lib/storage";
import type { Project } from "@/lib/types";
import { ArrowLeft, Calendar, Folder } from "lucide-react";

export default function ProjectDetailPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params?.id as string;

  const [user, setUser] = useState(getUser());
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    const currentUser = getUser();

    if (!currentUser) {
      router.push("/signup");
      return;
    }

    setUser(currentUser);

    // Find the project
    const foundProject = currentUser.projects.find(
      (p) => p.id === projectId
    );

    if (!foundProject) {
      router.push("/dashboard");
      return;
    }

    setProject(foundProject);
    trackProjectViewed(projectId);
  }, [projectId, router]);

  if (!user || !project) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <Link
              href="/dashboard"
              className="mb-4 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>

            <div className="mb-8">
              <div className="flex items-center gap-3">
                <Folder className="h-8 w-8" />
                <div>
                  <h1 className="text-3xl font-bold">{project.name}</h1>
                  <p className="mt-1 text-muted-foreground">
                    {project.description}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Project Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium">Project ID</p>
                    <p className="text-sm text-muted-foreground font-mono">
                      {project.id}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Created</p>
                    <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(project.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Analytics</CardTitle>
                  <CardDescription>
                    View your project analytics in PostHog
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    This is a demo project. In a real application, you would see
                    analytics data here. Check your PostHog dashboard to see the
                    events tracked for this project.
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Tracked Events</CardTitle>
                <CardDescription>
                  Events tracked for this project in PostHog
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-sm font-medium">project_created</p>
                    <p className="text-xs text-muted-foreground">
                      Tracked when this project was created
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-sm font-medium">project_viewed</p>
                    <p className="text-xs text-muted-foreground">
                      Tracked when this project page is viewed
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

