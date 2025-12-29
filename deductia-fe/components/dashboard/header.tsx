"use client";

import { LogIn, LogOut, Code2 } from "lucide-react";
import { User } from "@/types/api";

interface DashboardHeaderProps {
  user: User | null | undefined;
  isLoggedIn: boolean;
  onLogout: () => void;
  onLogin: () => void;
}

export default function DashboardHeader({
  user,
  isLoggedIn,
  onLogout,
  onLogin,
}: DashboardHeaderProps) {
  const todayDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="relative flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4 border-b border-white/5 pb-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 bg-primary/20 rounded border border-primary/30">
            <Code2 className="w-4 h-4 text-primary" />
          </div>
          <span className="text-xs font-mono text-primary tracking-wider uppercase">
            Deductia v2.1.0
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-1">
          Pemrograman Dasar
        </h1>
        <p className="text-muted-foreground">
          {isLoggedIn ? (
            <>
              Welcome back,{" "}
              <span className="text-white font-medium">{user?.name}</span>.
              Ready to code today?
            </>
          ) : (
            <>
              Welcome, <span className="text-white font-medium">Guest</span>.
              View class schedules and materials.
            </>
          )}
        </p>
      </div>

      <div className="absolute top-0 right-0 md:static flex items-center gap-4">
        <div className="text-right hidden md:block">
          <p className="text-xs text-zinc-500 font-mono">TODAY</p>
          <p
            className="text-sm font-medium text-zinc-300"
            suppressHydrationWarning
          >
            {todayDate}
          </p>
        </div>

        {isLoggedIn ? (
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-card border border-border hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 transition-all group font-medium text-sm"
          >
            <LogOut className="w-4 h-4 text-muted-foreground group-hover:text-destructive" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        ) : (
          <button
            onClick={onLogin}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/10"
          >
            <LogIn className="w-4 h-4" />
            <span>
              Login <span className="hidden sm:inline">to Access</span>
            </span>
          </button>
        )}
      </div>
    </header>
  );
}
