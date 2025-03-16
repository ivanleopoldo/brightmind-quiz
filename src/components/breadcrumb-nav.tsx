'use client';

import { usePathname } from 'next/navigation';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { capitalize } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';
import { api } from '@/trpc/react';

const routeMap: Record<string, string> = {
  'dashboard': 'Dashboard',
  'quiz-creator': 'Quiz Creator',
  'settings': 'Settings',
  'profile': 'Profile'
};

export function BreadcrumbNav() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  // Get quiz title if we're in a quiz route
  const quizId = segments.find(segment => /^[a-f\d]{24}$/i.test(segment));
  const { data: quizData } = api.quiz.getOne.useQuery(quizId || '', {
    enabled: !!quizId,
  });

  // Handle root-level routes
  const isRootRoute = segments[0] === 'settings' || segments[0] === 'quiz-creator';

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* Always show Dashboard as first item for root routes */}
        {isRootRoute && (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink 
                href="/dashboard"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
          </>
        )}

        {segments.map((segment, index) => {
          // If it's a MongoDB ID and we have quiz data, show the quiz title
          if (/^[a-f\d]{24}$/i.test(segment)) {
            if (!quizData) return null;
            const isLast = index === segments.length - 1;
            return (
              <BreadcrumbItem key={segment}>
                <BreadcrumbLink 
                  href={`/quiz-creator/${segment}`}
                  className={isLast ? "font-semibold text-foreground" : "text-muted-foreground hover:text-foreground transition-colors"}
                >
                  {quizData.title || 'Untitled Quiz'}
                </BreadcrumbLink>
              </BreadcrumbItem>
            );
          }

          const href = `/${segments.slice(0, index + 1).join('/')}`;
          const label = routeMap[segment] || capitalize(segment.replace(/-/g, ' '));
          const isLast = index === segments.length - 1;

          return (
            <>
              <BreadcrumbItem key={segment}>
                <BreadcrumbLink 
                  href={href}
                  className={isLast ? "font-semibold text-foreground" : "text-muted-foreground hover:text-foreground transition-colors"}
                >
                  {label}
                </BreadcrumbLink>
              </BreadcrumbItem>
              {!isLast && (
                <BreadcrumbSeparator>
                  <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>
              )}
            </>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
} 