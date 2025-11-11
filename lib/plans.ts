import type { Plan } from "./types";

export const plans: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    price: 29,
    interval: "month",
    features: [
      "Up to 10,000 events/month",
      "Basic analytics",
      "Email support",
      "1 project",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 99,
    interval: "month",
    features: [
      "Up to 100,000 events/month",
      "Advanced analytics",
      "Priority support",
      "Unlimited projects",
      "Custom dashboards",
      "Export data",
    ],
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 299,
    interval: "month",
    features: [
      "Unlimited events",
      "Advanced analytics",
      "24/7 support",
      "Unlimited projects",
      "Custom dashboards",
      "Export data",
      "API access",
      "Custom integrations",
    ],
  },
];

