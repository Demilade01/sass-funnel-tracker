"use client";

import { useEffect } from "react";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";

export function PostHogProviderWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

    if (posthogKey) {
      posthog.init(posthogKey, {
        api_host: posthogHost,
        person_profiles: "identified_only",
        // Use automatic pageview tracking (recommended in PostHog docs)
        defaults: "2025-05-24",
        loaded: (posthog) => {
          if (process.env.NODE_ENV === "development") {
            posthog.debug();
          }
        },
      });
    }
  }, []);

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}

export { posthog };

