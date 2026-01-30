
'use client';

import { trackClick } from '@/lib/analytics';
import { MouseEvent } from 'react';

import { Link } from '@/i18n/routing';

interface TrackedLinkProps {
  href: string;
  className?: string;
  children: React.ReactNode;
  eventName: string;
  toolId?: string;
  target?: string;
  rel?: string;
}

import { trackProductConnect } from '@/lib/tracking';

export default function TrackedLink({ href, className, children, eventName, toolId, target, rel }: TrackedLinkProps) {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    trackClick(eventName, toolId);
    if (toolId) {
        // optimistically fire, non-blocking
        trackProductConnect(toolId);
    }
  };

  const isExternal = href.startsWith('http') || href.startsWith('//');

  if (isExternal) {
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

  return (
    <Link
      href={href}
      className={className}
      onClick={handleClick}
      target={target}
      rel={rel}
    >
      {children}
    </Link>
  );
}
