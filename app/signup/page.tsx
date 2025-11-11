"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Navigation } from "@/components/navigation";
import {
  trackSignupPageView,
  trackSignupFormStarted,
  trackSignupFormCompleted,
  identifyUser,
} from "@/lib/tracking";
import { createUser } from "@/lib/storage";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  useEffect(() => {
    trackSignupPageView();
  }, []);

  const onSubmit = async (values: SignupFormValues) => {
    setIsSubmitting(true);

    try {
      // Create user in localStorage
      const user = createUser(values.email, values.name);

      // Identify user in PostHog
      identifyUser(user.id, user.email, user.name, {
        signup_date: user.createdAt,
      });

      // Track signup completion
      trackSignupFormCompleted(user.email, user.name);

      // Redirect to pricing page
      router.push("/pricing");
    } catch (error) {
      console.error("Signup error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputFocus = () => {
    if (!hasStarted) {
      setHasStarted(true);
      trackSignupFormStarted();
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />

      <main className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Create your account</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Start tracking your SaaS funnel today
            </p>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
              onFocus={handleInputFocus}
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John Doe"
                        {...field}
                        onFocus={handleInputFocus}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="john@example.com"
                        {...field}
                        onFocus={handleInputFocus}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Creating account..." : "Sign Up"}
              </Button>
            </form>
          </Form>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/" className="font-medium text-primary hover:underline">
              Go to home
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

