"use client";

import { cn } from "@/lib/utils";
import { Home, PlusIcon, Settings } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const Sidebar = () => {
  const pathName = usePathname();
  const router = useRouter();

  const routes = [
    {
      icon: Home,
      href: "/app",
      label: "Home",
      pro: false,
    },
    {
      icon: PlusIcon,
      href: "/app/new",
      label: "Create",
      pro: true,
    },
    {
      icon: Settings,
      href: "/app/settings",
      label: "Settings",
      pro: false,
    },
  ];

  const handleNavigate = (href: string, pro: boolean) => {
    router.push(href);
  };

  return (
    <div className="flex flex-col h-full space-y-4 bg-secondary">
      <div className="p-3 flex flex-1 justify-center">
        <div className="space-y-2">
          {routes.map((route) => (
            <div
              onClick={() => handleNavigate(route.href, route.pro)}
              key={route.href}
              className={cn(
                "text-muted-foreground text-xs group flex p-3 w-full justify-start",
                "font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition",
                pathName === route.href && "bg-primary/10 text-primary"
              )}
            >
              <div className="flex flex-col space-y-2 items-center flex-1">
                <route.icon className="h-4 w-5" />
                {route.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
