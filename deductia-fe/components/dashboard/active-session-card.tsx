"use client";

import { CheckCircle2, Terminal } from "lucide-react";
import { motion } from "framer-motion";

interface ActiveSessionCardProps {
  session: any; // Using any for the extended session type for simplicity, or I can define it properly
  isLoadingAttendances: boolean;
  isLoggedIn: boolean;
  hasAttended: boolean;
  onMarkAttendance: () => void;
  onViewDetails: () => void;
}

export default function ActiveSessionCard({
  session,
  isLoadingAttendances,
  isLoggedIn,
  hasAttended,
  onMarkAttendance,
  onViewDetails,
}: ActiveSessionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl bg-gradient-to-br from-primary/20 to-background border border-primary/30 p-1 overflow-hidden relative min-h-[300px] flex flex-col"
    >
      <div className="bg-slate-950/80 backdrop-blur-xl rounded-[22px] p-6 flex-1 flex flex-col justify-between relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold uppercase tracking-wider animate-pulse">
            <span className="w-2 h-2 rounded-full bg-green-500" /> Live Session
          </span>
          <span className="text-muted-foreground text-sm">|</span>
          <span className="text-muted-foreground text-sm font-mono">
            {session.week_number > 0
              ? `Week ${session.week_number}`
              : new Date(session.start_time).toLocaleDateString("id-ID", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                })}
          </span>
        </div>

        <h2 className="text-3xl font-bold text-foreground mb-2">
          {session.title}
        </h2>
        <p className="text-muted-foreground mb-8 max-w-lg">
          Session is currently active. Ensure you check in before the time runs
          out.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {isLoadingAttendances && isLoggedIn ? (
            <div className="py-4 text-center rounded-xl bg-muted/50 text-muted-foreground font-mono text-sm">
              Loading attendance...
            </div>
          ) : hasAttended ? (
            <div className="py-4 px-6 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center gap-3 text-green-400 font-bold">
              <CheckCircle2 className="w-5 h-5" />
              <span>Checked In</span>
            </div>
          ) : (
            <button
              onClick={onMarkAttendance}
              className="py-4 px-6 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
            >
              {isLoggedIn ? "Mark Attendance" : "Login to Attend"}{" "}
              <Terminal className="w-4 h-4 ml-1" />
            </button>
          )}

          <button
            onClick={onViewDetails}
            className="py-4 px-6 rounded-xl bg-zinc-800 text-white font-medium hover:bg-zinc-700 transition-colors border border-white/5"
          >
            Session Details
          </button>
        </div>
      </div>
    </motion.div>
  );
}
