"use client";

import { Terminal } from "lucide-react";

export default function CourseInfoCard() {
  return (
    <div className="bg-linear-to-b from-indigo-900/20 to-zinc-900/50 border border-indigo-500/20 p-6 rounded-3xl relative overflow-hidden">
      <Terminal className="w-20 h-20 text-indigo-500/10 absolute -bottom-4 -right-4 rotate-12" />
      <h3 className="text-sm font-medium text-indigo-300 mb-2 font-mono">
        COURSE INFO
      </h3>
      <p className="text-zinc-400 text-sm leading-relaxed relative z-10">
        Stay consistent with your practice. Remember to check materials before
        every class.
      </p>
    </div>
  );
}
