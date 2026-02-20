import React from "react";
import { Database, Archive, ShieldCheck, FileSearch, History } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
export function AppSidebar(): JSX.Element {
  const location = useLocation();
  const menuItems = [
    { title: "The Scanner", icon: FileSearch, path: "/" },
    { title: "Scan History", icon: History, path: "/history" },
  ];
  return (
    <Sidebar className="border-r border-white/10 bg-background">
      <SidebarHeader className="p-8">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 border-2 border-lime-accent bg-lime-accent/10 flex items-center justify-center shadow-[0_0_15px_rgba(200,241,53,0.15)]">
            <ShieldCheck className="h-7 w-7 text-lime-accent" />
          </div>
          <span className="text-3xl font-display font-black uppercase italic tracking-tighter text-white">
            AD<span className="text-lime-accent">XRAY</span>
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-600 font-mono uppercase text-[10px] tracking-[0.3em] mb-6">
            Core_Operations
          </SidebarGroupLabel>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.path} className="mb-2">
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === item.path}
                  className={cn(
                    "h-14 transition-all font-display font-bold uppercase text-lg tracking-tight rounded-none border border-transparent px-4",
                    location.pathname === item.path
                      ? "border-lime-accent/30 bg-lime-accent/5 text-lime-accent shadow-[4px_4px_0px_0px_rgba(200,241,53,0.1)]"
                      : "hover:bg-white/5 text-gray-500 hover:text-white"
                  )}
                >
                  <Link to={item.path}>
                    <item.icon className={cn("h-5 w-5", location.pathname === item.path ? "text-lime-accent" : "text-gray-500")} />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-6 border-t border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-lime-accent rounded-full animate-pulse shadow-[0_0_8px_rgba(200,241,53,0.8)]" />
          <p className="text-[10px] font-mono font-black uppercase text-lime-accent/80">System: Operational</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}