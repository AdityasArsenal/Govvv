"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { UserProfile } from "@/components/user-profile";

export function PageHeader() {
  return (
    <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <h1 className="text-2xl font-bold font-headline text-primary">Data Canvas</h1>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <UserProfile />
          </div>
        </div>
      </div>
    </header>
  );
}
