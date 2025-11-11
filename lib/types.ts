export type Plan = {
  id: string;
  name: string;
  price: number;
  interval: "month" | "year";
  features: string[];
  popular?: boolean;
};

export type User = {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  plan?: Plan | null;
  subscribedAt?: string | null;
  projects: Project[];
};

export type Project = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
};

export type MarketingSource = {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
};

