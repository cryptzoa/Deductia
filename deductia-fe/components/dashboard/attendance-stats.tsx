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
    <div className="bg-card border border-border p-6 rounded-3xl h-full flex flex-col justify-between">
      <div>
        <h3 className="text-muted-foreground text-xs font-mono uppercase tracking-widest mb-4">
          Attendance Rate
        </h3>

        <div className="flex items-center gap-4 mb-6">
          <div className="relative w-20 h-20 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="40"
                cy="40"
                r="36"
                className="stroke-muted/20"
                strokeWidth="8"
                fill="transparent"
              />
              <motion.circle
                cx="40"
                cy="40"
                r="36"
                className="stroke-primary"
                stroke={
                  attendanceRate >= 80
                    ? "hsl(142.1 76.2% 36.3%)" // green-500 equivalent
                    : attendanceRate >= 50
                    ? "hsl(47.9 95.8% 53.1%)" // yellow-500 equivalent
                    : "hsl(0 84.2% 60.2%)" // red-500 equivalent
                }
                strokeWidth="8" // Changed from 12 to 8 to match outer circle
                strokeDasharray="226.19" // (2 * PI * 36)
                strokeDashoffset={226.19 - (226.19 * attendanceRate) / 100}
                strokeLinecap="round"
                initial={{ strokeDashoffset: 226.19 }}
                animate={{
                  strokeDashoffset: 226.19 - (226.19 * attendanceRate) / 100,
                }}
                transition={{ duration: 1 }}
              />
            </svg>
            <span className="absolute text-xl font-bold text-foreground">
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

      <div className="mt-6 pt-6 border-t border-border space-y-3">
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
