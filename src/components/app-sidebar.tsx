import React from "react";
import { Scan, Archive, Info, Settings, ShieldCheck } from "lucide-react";
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
    { title: "Scanner", icon: Scan, path: "/" },
    { title: "X-Ray Vault", icon: Archive, path: "/history" },
  ];
  return (
    <Sidebar className="border-r-3 border-black">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 border-2 border-black bg-[#FFD23F] flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <span className="text-2xl font-black uppercase italic tracking-tighter">AdXRay</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-3">
        <SidebarGroup>
          <SidebarGroupLabel className="text-black font-black uppercase text-xs mb-2">Navigation</SidebarGroupLabel>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton 
                  asChild 
                  isActive={location.pathname === item.path}
                  className={cn(
                    "h-12 border-2 border-transparent transition-all font-bold uppercase",
                    location.pathname === item.path && "border-black bg-[#FFD23F] shadow-hard-sm translate-x-1"
                  )}
                >
                  <Link to={item.path}>
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t-2 border-black">
        <div className="flex flex-col gap-1">
          <p className="text-[10px] font-black uppercase text-muted-foreground">AdXRay Protocol v1.0</p>
          <p className="text-[10px] font-medium leading-tight">Privacy-First Ad Analysis Platform</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}