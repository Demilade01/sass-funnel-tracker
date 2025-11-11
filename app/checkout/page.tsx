"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Navigation } from "@/components/navigation";
import {
  trackCheckoutPageView,
  trackPaymentMethodSelected,
  trackPaymentCompleted,
  trackPaymentFailed,
} from "@/lib/tracking";
import { getUser, updateUserPlan } from "@/lib/storage";
import { plans } from "@/lib/plans";
import type { Plan } from "@/lib/types";
import { Check, CreditCard, Loader2 } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get("plan");

  const [user, setUser] = useState(getUser());
  const [plan, setPlan] = useState<Plan | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    trackCheckoutPageView();

    const currentUser = getUser();
    if (!currentUser) {
      router.push("/signup");
      return;
    }

    setUser(currentUser);

    // Find the selected plan
    const selectedPlan = plans.find((p) => p.id === planId);
    if (!selectedPlan) {
      router.push("/pricing");
      return;
    }

    setPlan(selectedPlan);
  }, [planId, router]);

  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethod(method);
    trackPaymentMethodSelected(method);
  };

  const handlePayment = async () => {
    if (!plan || !user) return;

    setIsProcessing(true);
    setError(null);

    // Simulate payment processing
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate 10% failure rate for demo purposes
      const shouldFail = Math.random() < 0.1;

      if (shouldFail) {
        trackPaymentFailed(plan, "Payment processing failed");
        setError("Payment failed. Please try again.");
        setIsProcessing(false);
        return;
      }

      // Update user plan
      updateUserPlan(user, plan);

      // Track successful payment
      trackPaymentCompleted(plan);

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (err) {
      trackPaymentFailed(plan, "Unexpected error");
      setError("An error occurred. Please try again.");
      setIsProcessing(false);
    }
  };

  if (!user || !plan) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-3xl font-bold">Complete your purchase</h1>
            <p className="mt-2 text-muted-foreground">
              Review your plan and complete payment
            </p>

            <div className="mt-8 grid gap-8 lg:grid-cols-2">
              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{plan.name} Plan</p>
                      <p className="text-sm text-muted-foreground">
                        Billed {plan.interval}ly
                      </p>
                    </div>
                    <p className="text-lg font-semibold">
                      ${plan.price}/{plan.interval}
                    </p>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>${plan.price}/{plan.interval}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                  <CardDescription>
                    Select your preferred payment method
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => handlePaymentMethodChange("card")}
                      className={`w-full rounded-lg border p-4 text-left transition-colors ${
                        paymentMethod === "card"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:bg-accent"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-5 w-5" />
                        <div>
                          <p className="font-medium">Credit Card</p>
                          <p className="text-sm text-muted-foreground">
                            Visa, Mastercard, Amex
                          </p>
                        </div>
                        {paymentMethod === "card" && (
                          <Check className="ml-auto h-5 w-5 text-primary" />
                        )}
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handlePaymentMethodChange("paypal")}
                      className={`w-full rounded-lg border p-4 text-left transition-colors ${
                        paymentMethod === "paypal"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:bg-accent"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-5 w-5" />
                        <div>
                          <p className="font-medium">PayPal</p>
                          <p className="text-sm text-muted-foreground">
                            Pay with PayPal
                          </p>
                        </div>
                        {paymentMethod === "paypal" && (
                          <Check className="ml-auto h-5 w-5 text-primary" />
                        )}
                      </div>
                    </button>
                  </div>

                  {error && (
                    <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                      {error}
                    </div>
                  )}

                  <div className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">
                    <p>
                      This is a demo. No actual payment will be processed. Click
                      "Complete Payment" to simulate the payment flow.
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    onClick={handlePayment}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Complete Payment"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

