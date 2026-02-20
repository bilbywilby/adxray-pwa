import React from "react";
import { Database, Archive, Info, Settings, ShieldCheck, FileSearch } from "lucide-react";
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
    { title: "Scanner", icon: FileSearch, path: "/" },
    { title: "Vault", icon: Archive, path: "/history" },
  ];
  return (
    <Sidebar className="border-r border-border bg-background">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 border border-primary/20 bg-primary/10 flex items-center justify-center shadow-[0_0_15px_rgba(200,241,53,0.1)]">
            <Database className="h-6 w-6 text-primary" />
          </div>
          <span className="text-2xl font-display font-black uppercase italic tracking-tighter text-white">
            DOC<span className="text-primary">XRAY</span>
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-3">
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground font-mono uppercase text-[10px] tracking-widest mb-4">
            Navigation_Protocol
          </SidebarGroupLabel>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === item.path}
                  className={cn(
                    "h-12 transition-all font-display font-bold uppercase tracking-tight rounded-none border border-transparent",
                    location.pathname === item.path 
                      ? "border-primary/30 bg-primary/5 text-primary shadow-[0_0_10px_rgba(200,241,53,0.05)]" 
                      : "hover:bg-white/5 text-gray-400 hover:text-white"
                  )}
                >
                  <Link to={item.path}>
                    <item.icon className={cn("h-5 w-5", location.pathname === item.path ? "text-primary" : "text-gray-500")} />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-border">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
            <p className="text-[10px] font-mono font-black uppercase text-primary/70">DOCXRAY INTELLIGENCE v5.0</p>
          </div>
          <p className="text-[9px] font-mono text-muted-foreground uppercase tracking-tighter">Neural_Engine_Active</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}