import React from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { cn } from "@/lib/utils";
type AppLayoutProps = {
  children: React.ReactNode;
  container?: boolean;
  className?: string;
  contentClassName?: string;
};
export function AppLayout({ children, container = false, className, contentClassName }: AppLayoutProps): JSX.Element {
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <SidebarInset className={cn("bg-background min-h-screen relative", className)}>
        <div className="fixed left-4 top-4 z-50">
          <SidebarTrigger className="bg-background border border-border hover:border-primary transition-colors h-10 w-10" />
        </div>
        {container ? (
          <div className={cn("max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 lg:py-24", contentClassName)}>
            {children}
          </div>
        ) : (
          <div className="pt-20">{children}</div>
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}