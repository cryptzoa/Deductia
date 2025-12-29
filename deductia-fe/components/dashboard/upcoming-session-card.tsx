"use client";

import { Calendar, Cpu } from "lucide-react";
import { motion } from "framer-motion";

interface UpcomingSessionCardProps {
  upcomingSession: any;
  currentWeek: number;
  totalWeeks: number;
  progressPercent: number;
}

export default function UpcomingSessionCard({
  upcomingSession,
  currentWeek,
  totalWeeks,
  progressPercent,
}: UpcomingSessionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl bg-zinc-900/50 border border-white/5 p-8 relative overflow-hidden min-h-[300px] flex flex-col justify-between group"
    >
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 p-20 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-all duration-700" />
      <Cpu className="absolute bottom-8 right-8 w-24 h-24 text-white/5 rotate-12" />

      <div>
        <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs uppercase tracking-widest mb-4">
          <span className="w-2 h-2 bg-indigo-500 rounded-sm" /> Next on Schedule
        </div>

        {upcomingSession ? (
          <>
            <h2 className="text-3xl font-bold text-white mb-2 max-w-md leading-tight">
              {upcomingSession.title}
            </h2>
            <div className="flex items-center gap-4 text-zinc-400 mt-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/40 border border-white/5">
                <Calendar className="w-4 h-4 text-zinc-500" />
                <span className="text-sm">
                  {new Date(
                    upcomingSession.start_time || Date.now()
                  ).toLocaleDateString("id-ID", {
                    weekday: "long",
                    day: "numeric",
                    month: "short",
                  })}
                </span>
              </div>
            </div>
          </>
        ) : (
          <div>
            <h2 className="text-2xl font-bold text-white">
              No Upcoming Classes
            </h2>
            <p className="text-zinc-500 mt-2">
              You have completed all scheduled sessions.
            </p>
          </div>
        )}
      </div>

      {/* Progress Bar (Decorative) */}
      <div className="mt-8">
        <div className="flex justify-between text-xs font-mono text-zinc-500 mb-2">
          <span>SEMESTER PROGRESS</span>
          <span>
            WEEK {currentWeek} / {totalWeeks}
          </span>
        </div>
        <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-600 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </motion.div>
  );
}
