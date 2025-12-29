"use client";

import { motion } from "framer-motion";

interface AttendanceStatsProps {
  attendanceRate: number;
  displayPastSessions: number;
  displayAttended: number;
  isLoggedIn: boolean;
}

export default function AttendanceStats({
  attendanceRate,
  displayPastSessions,
  displayAttended,
  isLoggedIn,
}: AttendanceStatsProps) {
  const missed = displayPastSessions - displayAttended; // Added this line to define 'missed'

  return (
    <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-6 rounded-3xl flex flex-col justify-between">
      <div>
        <h3 className="text-muted-foreground text-xs font-mono uppercase tracking-widest mb-4">
          Attendance Rate
        </h3>

        <div className="flex items-center gap-3 mb-2">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="28"
                className="stroke-muted/20"
                strokeWidth="6"
                fill="transparent"
              />
              <motion.circle
                cx="32"
                cy="32"
                r="28"
                className="stroke-primary"
                stroke={
                  attendanceRate >= 80
                    ? "hsl(142.1 76.2% 36.3%)" // green-500 equivalent
                    : attendanceRate >= 50
                    ? "hsl(47.9 95.8% 53.1%)" // yellow-500 equivalent
                    : "hsl(0 84.2% 60.2%)" // red-500 equivalent
                }
                strokeWidth="6"
                strokeDasharray="175.93" // (2 * PI * 28)
                strokeDashoffset={175.93 - (175.93 * attendanceRate) / 100}
                strokeLinecap="round"
                initial={{ strokeDashoffset: 175.93 }}
                animate={{
                  strokeDashoffset: 175.93 - (175.93 * attendanceRate) / 100,
                }}
                transition={{ duration: 1 }}
              />
            </svg>
            <span className="absolute text-lg font-bold text-foreground">
              {isNaN(attendanceRate) ? 0 : attendanceRate}%
            </span>
          </div>

          <div>
            {attendanceRate >= 80 ? (
              <div className="px-2 py-1 rounded bg-success/10 text-success text-[10px] font-bold uppercase tracking-wider">
                Excellent
              </div>
            ) : attendanceRate >= 50 ? (
              <div className="px-2 py-1 rounded bg-warning/10 text-warning text-[10px] font-bold uppercase tracking-wider">
                Average
              </div>
            ) : (
              <div className="px-2 py-1 rounded bg-destructive/10 text-destructive text-[10px] font-bold uppercase tracking-wider">
                Low
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border space-y-2">
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <span>Total Sessions</span>
          <span className="font-bold text-foreground">
            {displayPastSessions}
          </span>
        </div>
        {!isLoggedIn && (
          <div className="text-xs text-center pt-2 text-muted-foreground italic">
            *Sample data for demo
          </div>
        )}
        {isLoggedIn && (
          <>
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span>Present</span>
              <span className="font-bold text-foreground">
                {displayAttended}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm text-destructive">
              <span>Missed</span>
              <span className="font-bold">{missed}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
