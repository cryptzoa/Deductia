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
      className="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-6 rounded-3xl relative overflow-hidden group min-h-[300px] flex flex-col justify-between"
    >
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 p-20 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all duration-700" />
      <Cpu className="absolute bottom-8 right-8 w-24 h-24 text-white/5 rotate-12" />

      <div className="relative z-10 h-full flex flex-col justify-between">
        <ul className="flex items-center gap-2 text-primary font-mono text-xs uppercase tracking-widest mb-4">
          <li className="list-none flex items-center gap-2">
            {" "}
            {/* Wrapper to avoid li inside div if needed, structure looks cleaner */}
            <span className="w-2 h-2 bg-primary rounded-sm" /> NEXT ON SCHEDULE
          </li>
        </ul>

        {upcomingSession ? (
          <>
            <h2 className="text-4xl font-bold text-foreground mb-4">
              {upcomingSession?.title || "Week Off"}
            </h2>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted text-muted-foreground text-sm font-medium">
              <Calendar className="w-4 h-4" />
              <span>
                {new Date(
                  upcomingSession.start_time || Date.now()
                ).toLocaleDateString("id-ID", {
                  weekday: "long",
                  day: "numeric",
                  month: "short",
                })}
              </span>
            </div>
          </>
        ) : (
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              No Upcoming Classes
            </h2>
            <p className="text-muted-foreground mt-2">
              You have completed all scheduled sessions.
            </p>
          </div>
        )}
      </div>

      {/* Progress Bar (Decorative) */}
      <div className="mt-8">
        <div className="flex justify-between text-xs font-mono text-muted-foreground mb-2">
          <span>SEMESTER PROGRESS</span>
          <span>
            WEEK {currentWeek} / {totalWeeks}
          </span>
        </div>
        <div className="h-2 w-full bg-muted/30 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </motion.div>
  );
}
