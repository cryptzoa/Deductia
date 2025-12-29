"use client";

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
  return (
    <div className="bg-zinc-900/50 border border-white/5 p-6 rounded-3xl">
      <h3 className="text-sm font-medium text-zinc-400 mb-6 uppercase tracking-wider font-mono">
        {isLoggedIn ? "Attendance Rate" : "Target Attendance"}
      </h3>

      <div className="flex items-center justify-between">
        <div>
          <span className="text-4xl font-bold text-white block mb-1">
            {isNaN(attendanceRate) ? 0 : attendanceRate}%
          </span>
          <span
            className={`text-xs px-2 py-1 rounded border ${
              attendanceRate >= 80
                ? "bg-green-500/10 text-green-400 border-green-500/20"
                : attendanceRate >= 50
                ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                : "bg-red-500/10 text-red-400 border-red-500/20"
            }`}
          >
            {attendanceRate >= 80
              ? "EXCELLENT"
              : attendanceRate >= 50
              ? "AVERAGE"
              : "LOW"}
          </span>
        </div>

        {/* Mini Circular Chart */}
        <div className="relative w-16 h-16">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#27272a"
              strokeWidth="12"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke={attendanceRate >= 80 ? "#22c55e" : "#eab308"}
              strokeWidth="12"
              strokeDasharray="251.2"
              strokeDashoffset={251.2 - (251.2 * attendanceRate) / 100}
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-white/5 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-zinc-500">Total Sessions</span>
          <span className="text-white font-mono">{displayPastSessions}</span>
        </div>
        {!isLoggedIn && (
          <div className="text-xs text-center pt-2 text-zinc-500 italic">
            *Sample data for demo
          </div>
        )}
        {isLoggedIn && (
          <>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">Present</span>
              <span className="text-white font-mono">{displayAttended}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">Missed</span>
              <span className="text-red-400 font-mono">
                {displayPastSessions - displayAttended}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
