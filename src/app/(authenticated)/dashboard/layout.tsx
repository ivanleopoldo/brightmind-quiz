"use client";

import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import React, { PropsWithChildren } from "react";

export default function Page({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter((segment) => segment);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="border shadow-none">
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 bg-background">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                {pathSegments.map((segment, index) => (
                  <React.Fragment key={index}>
                    <BreadcrumbItem>
                      <BreadcrumbLink
                        href={`/${pathSegments.slice(0, index + 1).join("/")}`}
                      >
                        {segment}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    {index < pathSegments.length - 1 && <BreadcrumbSeparator />}
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <Separator />
        <div className="max-h-[calc(100vh-6rem)] overflow-y-auto px-4">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
