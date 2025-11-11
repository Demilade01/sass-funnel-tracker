"use client";

import { posthog } from "./posthog";
import type { Plan, Project, MarketingSource } from "./types";

// Extract UTM parameters from URL
export function getMarketingSource(): MarketingSource {
  if (typeof window === "undefined") return {};

  const params = new URLSearchParams(window.location.search);
  return {
    source: params.get("utm_source") || undefined,
    medium: params.get("utm_medium") || undefined,
    campaign: params.get("utm_campaign") || undefined,
    term: params.get("utm_term") || undefined,
    content: params.get("utm_content") || undefined,
  };
}

// Set marketing properties on user
export function setMarketingProperties(source: MarketingSource): void {
  if (!posthog) return;

  Object.entries(source).forEach(([key, value]) => {
    if (value) {
      posthog.setPersonProperties({ [`marketing_${key}`]: value });
    }
  });
}

// Landing page events
export function trackLandingPageView(): void {
  if (!posthog) return;

  const source = getMarketingSource();
  posthog.capture("landing_page_viewed", {
    ...source,
    referrer: document.referrer,
  });

  setMarketingProperties(source);
}

export function trackCTAClicked(location: string): void {
  if (!posthog) return;
  posthog.capture("cta_clicked", { location });
}

export function trackPricingLinkClicked(): void {
  if (!posthog) return;
  posthog.capture("pricing_link_clicked");
}

// Signup events
export function trackSignupPageView(): void {
  if (!posthog) return;
  posthog.capture("signup_page_viewed");
}

export function trackSignupFormStarted(): void {
  if (!posthog) return;
  posthog.capture("signup_form_started");
}

export function trackSignupFormCompleted(email: string, name: string): void {
  if (!posthog) return;
  posthog.capture("signup_form_completed", {
    email,
    name,
  });
}

export function trackSignupFormAbandoned(): void {
  if (!posthog) return;
  posthog.capture("signup_form_abandoned");
}

// Pricing events
export function trackPricingPageView(): void {
  if (!posthog) return;
  posthog.capture("pricing_page_viewed");
}

export function trackPlanViewed(planId: string, planName: string): void {
  if (!posthog) return;
  posthog.capture("plan_viewed", {
    plan_id: planId,
    plan_name: planName,
  });
}

export function trackPlanSelected(plan: Plan): void {
  if (!posthog) return;
  posthog.capture("plan_selected", {
    plan_id: plan.id,
    plan_name: plan.name,
    plan_price: plan.price,
    plan_interval: plan.interval,
  });
}

export function trackCheckoutInitiated(plan: Plan): void {
  if (!posthog) return;
  posthog.capture("checkout_initiated", {
    plan_id: plan.id,
    plan_name: plan.name,
    plan_price: plan.price,
  });
}

// Checkout events
export function trackCheckoutPageView(): void {
  if (!posthog) return;
  posthog.capture("checkout_page_viewed");
}

export function trackPaymentMethodSelected(method: string): void {
  if (!posthog) return;
  posthog.capture("payment_method_selected", { method });
}

export function trackPaymentCompleted(plan: Plan): void {
  if (!posthog) return;
  posthog.capture("payment_completed", {
    plan_id: plan.id,
    plan_name: plan.name,
    plan_price: plan.price,
    plan_interval: plan.interval,
  });
}

export function trackPaymentFailed(plan: Plan, reason?: string): void {
  if (!posthog) return;
  posthog.capture("payment_failed", {
    plan_id: plan.id,
    plan_name: plan.name,
    reason,
  });
}

// Dashboard events
export function trackDashboardView(): void {
  if (!posthog) return;
  posthog.capture("dashboard_viewed");
}

export function trackProjectCreationStarted(): void {
  if (!posthog) return;
  posthog.capture("project_creation_started");
}

export function trackProjectCreated(project: Project): void {
  if (!posthog) return;
  posthog.capture("project_created", {
    project_id: project.id,
    project_name: project.name,
  });
}

export function trackProjectViewed(projectId: string): void {
  if (!posthog) return;
  posthog.capture("project_viewed", { project_id: projectId });
}

// Identify user in PostHog
export function identifyUser(userId: string, email: string, name: string, properties?: Record<string, any>): void {
  if (!posthog) return;
  posthog.identify(userId, {
    email,
    name,
    ...properties,
  });
}

// Set user properties
export function setUserProperties(properties: Record<string, any>): void {
  if (!posthog) return;
  posthog.setPersonProperties(properties);
}

