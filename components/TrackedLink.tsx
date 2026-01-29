
'use client';

import { trackClick } from '@/lib/analytics';
import { MouseEvent } from 'react';

interface TrackedLinkProps {
  href: string;
  className?: string;
  children: React.ReactNode;
  eventName: string;
  toolId?: string;
  target?: string;
  rel?: string;
}

export default function TrackedLink({ href, className, children, eventName, toolId, target, rel }: TrackedLinkProps) {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    trackClick(eventName, toolId);
  };

  return (
    <a
      href={href}
      className={className}
      onClick={handleClick}
      target={target}
      rel={rel}
    >
      {children}
    </a>
  );
}
