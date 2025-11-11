"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Navigation } from "@/components/navigation";
import {
  trackDashboardView,
  trackProjectViewed,
} from "@/lib/tracking";
import { getUser } from "@/lib/storage";
import type { Project } from "@/lib/types";
import { Plus, Folder, Calendar } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(getUser());
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const currentUser = getUser();

    if (!currentUser) {
      router.push("/signup");
      return;
    }

    setUser(currentUser);
    setProjects(currentUser.projects || []);
    trackDashboardView();
  }, [router]);

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="mt-2 text-muted-foreground">
              Welcome back, {user.name}!
            </p>
          </div>

          {/* User Info Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Plan</p>
                <p className="text-sm text-muted-foreground">
                  {user.plan ? user.plan.name : "No plan selected"}
                </p>
              </div>
              {user.plan && (
                <div>
                  <p className="text-sm font-medium">Subscription</p>
                  <p className="text-sm text-muted-foreground">
                    ${user.plan.price}/{user.plan.interval}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Projects Section */}
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Projects</h2>
              <p className="text-sm text-muted-foreground">
                Manage your analytics projects
              </p>
            </div>
            <Link href="/dashboard/projects/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Project
              </Button>
            </Link>
          </div>

          {projects.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Folder className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-semibold">No projects yet</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  Get started by creating your first project
                </p>
                <Link href="/dashboard/projects/new">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Project
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <Card
                  key={project.id}
                  className="cursor-pointer transition-shadow hover:shadow-md"
                  onClick={() => {
                    trackProjectViewed(project.id);
                    router.push(`/dashboard/projects/${project.id}`);
                  }}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Folder className="h-5 w-5" />
                      {project.name}
                    </CardTitle>
                    <CardDescription>{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Created{" "}
                        {new Date(project.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* CTA for users without plan */}
          {!user.plan && (
            <Card className="mt-8 border-primary">
              <CardHeader>
                <CardTitle>Upgrade to unlock projects</CardTitle>
                <CardDescription>
                  Choose a plan to start creating projects and tracking
                  analytics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/pricing">
                  <Button>View Pricing</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}

