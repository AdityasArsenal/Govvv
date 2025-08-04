"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { UserProfile } from "@/components/user-profile";
import { SafeLink } from "@/components/SafeLink";

interface PageHeaderProps {
  hasUnsavedChanges: boolean;
}

export function PageHeader({ hasUnsavedChanges }: PageHeaderProps) {
  return (
    <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <SafeLink hasUnsavedChanges={hasUnsavedChanges} href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">
              Data Canvas
            </span>
          </SafeLink>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* You can add a search bar here if needed */}
          </div>
          <nav className="flex items-center">
            <ThemeToggle />
            <UserProfile />
          </nav>
        </div>
      </div>
    </header>
  );
}
