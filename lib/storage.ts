import type { User, Project, Plan } from "./types";

const USER_STORAGE_KEY = "saas_demo_user";
const PROJECTS_STORAGE_KEY = "saas_demo_projects";

export function getUser(): User | null {
  if (typeof window === "undefined") return null;

  const stored = localStorage.getItem(USER_STORAGE_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function saveUser(user: User): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
}

export function createUser(email: string, name: string): User {
  const user: User = {
    id: `user_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    email,
    name,
    createdAt: new Date().toISOString(),
    projects: [],
  };

  saveUser(user);
  return user;
}

export function updateUserPlan(user: User, plan: Plan): User {
  const updatedUser: User = {
    ...user,
    plan,
    subscribedAt: new Date().toISOString(),
  };

  saveUser(updatedUser);
  return updatedUser;
}

export function addProjectToUser(user: User, project: Project): User {
  const updatedUser: User = {
    ...user,
    projects: [...user.projects, project],
  };

  saveUser(updatedUser);
  return updatedUser;
}

export function getProjects(): Project[] {
  const user = getUser();
  return user?.projects || [];
}

export function clearUser(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(USER_STORAGE_KEY);
  localStorage.removeItem(PROJECTS_STORAGE_KEY);
}

