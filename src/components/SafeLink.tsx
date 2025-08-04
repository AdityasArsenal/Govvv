"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { LinkProps } from 'next/link';

interface SafeLinkProps extends LinkProps {
  children: React.ReactNode;
  hasUnsavedChanges: boolean;
  className?: string;
}

export function SafeLink({ children, hasUnsavedChanges, href, ...props }: SafeLinkProps) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (hasUnsavedChanges) {
      if (!window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
        e.preventDefault();
      }
    }
  };

  return (
    <Link href={href} {...props} onClick={handleClick}>
      {children}
    </Link>
  );
}
