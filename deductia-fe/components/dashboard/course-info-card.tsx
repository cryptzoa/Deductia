"use client";

import { Terminal } from "lucide-react";

export default function CourseInfoCard() {
  return (
    <div className="bg-gradient-to-b from-primary/10 to-card/50 border border-primary/20 p-6 rounded-3xl relative overflow-hidden">
      <Terminal className="w-20 h-20 text-primary/5 absolute -bottom-4 -right-4 rotate-12" />
      <h3 className="text-sm font-medium text-primary mb-2 font-mono">
        COURSE INFO
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed relative z-10">
        Stay consistent with your practice. Remember to check materials before
        every class.
      </p>
    </div>
  );
}
