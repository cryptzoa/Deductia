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
    <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4 border-b border-white/5 pb-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 bg-indigo-500/20 rounded border border-indigo-500/30">
            <Code2 className="w-4 h-4 text-indigo-400" />
          </div>
          <span className="text-xs font-mono text-indigo-400 tracking-wider uppercase">
            Class Companion v2.1.0
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">
          Basic Programming
        </h1>
        <p className="text-zinc-400">
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

      <div className="flex items-center gap-4">
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
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all group font-medium text-sm"
          >
            <LogOut className="w-4 h-4 text-zinc-400 group-hover:text-red-400" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        ) : (
          <button
            onClick={onLogin}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-bold hover:bg-zinc-200 transition-all shadow-lg shadow-indigo-500/10"
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
