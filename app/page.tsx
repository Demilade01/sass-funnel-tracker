"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/navigation";
import {
  trackLandingPageView,
  trackCTAClicked,
  trackPricingLinkClicked,
} from "@/lib/tracking";
import { Check, ArrowRight } from "lucide-react";

export default function Home() {
  useEffect(() => {
    trackLandingPageView();
  }, []);

  const handleCTAClick = (location: string) => {
    trackCTAClicked(location);
  };

  const handlePricingClick = () => {
    trackPricingLinkClicked();
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Build, Track, and Scale Your SaaS
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Experience how powerful analytics can transform your user journey.
              Track conversions, optimize funnels, and measure what matters.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/signup">
                <Button
                  size="lg"
                  onClick={() => handleCTAClick("hero_primary")}
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => {
                    handlePricingClick();
                    handleCTAClick("hero_secondary");
                  }}
                >
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-muted/50 py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Everything you need to succeed
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Powerful features to track and optimize your user journey
              </p>
            </div>

            <div className="mx-auto mt-16 max-w-5xl">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    title: "Funnel Tracking",
                    description:
                      "Track user conversions at every step of your funnel",
                  },
                  {
                    title: "Event Analytics",
                    description:
                      "Capture and analyze user interactions in real-time",
                  },
                  {
                    title: "Conversion Optimization",
                    description:
                      "Identify bottlenecks and optimize conversion rates",
                  },
                  {
                    title: "Marketing Attribution",
                    description:
                      "Track which channels drive the most signups",
                  },
                  {
                    title: "User Segmentation",
                    description:
                      "Segment users based on behavior and properties",
                  },
                  {
                    title: "Real-time Insights",
                    description:
                      "Get instant insights into user behavior and trends",
                  },
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="rounded-lg border bg-card p-6 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Check className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold">{feature.title}</h3>
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Ready to get started?
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Join thousands of companies using analytics to grow their
                business
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link href="/signup">
                  <Button
                    size="lg"
                    onClick={() => handleCTAClick("footer_primary")}
                  >
                    Start Free Trial
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => {
                      handlePricingClick();
                      handleCTAClick("footer_secondary");
                    }}
                  >
                    View Pricing
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-muted-foreground">
            Demo SaaS Analytics Platform • Powered by PostHog
          </p>
        </div>
      </footer>
    </div>
  );
}
