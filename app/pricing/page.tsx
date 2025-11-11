"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Navigation } from "@/components/navigation";
import {
  trackPricingPageView,
  trackPlanViewed,
  trackPlanSelected,
  trackCheckoutInitiated,
} from "@/lib/tracking";
import { getUser } from "@/lib/storage";
import { plans } from "@/lib/plans";
import type { Plan } from "@/lib/types";
import { Check } from "lucide-react";

export default function PricingPage() {
  const router = useRouter();
  const [user, setUser] = useState(getUser());
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  useEffect(() => {
    trackPricingPageView();
    setUser(getUser());

    // Track plan views on mount
    plans.forEach((plan) => {
      trackPlanViewed(plan.id, plan.name);
    });
  }, []);

  const handlePlanSelect = (plan: Plan) => {
    setSelectedPlan(plan);
    trackPlanSelected(plan);

    if (user) {
      // User is logged in, go to checkout
      trackCheckoutInitiated(plan);
      router.push(`/checkout?plan=${plan.id}`);
    } else {
      // User not logged in, go to signup
      router.push("/signup");
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Simple, transparent pricing
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Choose the plan that's right for you. All plans include a 14-day
              free trial.
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 lg:grid-cols-3">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={`relative ${
                  plan.popular
                    ? "border-primary shadow-lg ring-2 ring-primary"
                    : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                      Most Popular
                    </span>
                  </div>
                )}

                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>
                    <div className="mt-4 flex items-baseline">
                      <span className="text-4xl font-bold">
                        ${plan.price}
                      </span>
                      <span className="ml-2 text-muted-foreground">
                        /{plan.interval}
                      </span>
                    </div>
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter>
                  <Button
                    className="w-full"
                    variant={plan.popular ? "default" : "outline"}
                    onClick={() => handlePlanSelect(plan)}
                  >
                    {user ? "Select Plan" : "Get Started"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {!user && (
            <div className="mx-auto mt-12 max-w-2xl text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/" className="font-medium text-primary hover:underline">
                  Go to home
                </Link>
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

