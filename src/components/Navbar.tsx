"use client";

import { UserButton } from "@clerk/nextjs";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { ThemeToggle } from "./theme-toggle";
import MobileSidebar from "./mobile-sidebar";

const Navbar = () => {
  return (
    <div className="fixed w-full h-16 z-50 flex justify-between items-center py-2 px-4 border-b border-primary/10 bg-secondary">
      <div className="flex items-center">
        <MobileSidebar />

        <Link href="/app">
          <h1 className="hidden md:block text-xl md:text-2xl text-primary font-bold">companion.ai</h1>
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        <Button size="sm">
          Upgrade
          <Sparkles className="h-4 w-4 fill-white ml-2" />
        </Button>
        <ThemeToggle />
        <UserButton />
      </div>
    </div>
  );
};

export default Navbar;
