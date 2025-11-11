"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getUser } from "@/lib/storage";
import { useEffect, useState } from "react";

export function Navigation() {
  const pathname = usePathname();
  const [user, setUser] = useState(getUser());

  useEffect(() => {
    // Update user state when navigating
    setUser(getUser());
  }, [pathname]);

  const isAuthenticated = !!user;
  const isDashboard = pathname?.startsWith("/dashboard");

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              SaaS Demo
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard">
                  <Button variant={isDashboard ? "default" : "ghost"}>
                    Dashboard
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button variant={pathname === "/pricing" ? "default" : "ghost"}>
                    Pricing
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/pricing">
                  <Button variant={pathname === "/pricing" ? "default" : "ghost"}>
                    Pricing
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

