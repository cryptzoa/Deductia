"use client";

import { User as UserIcon } from "lucide-react";

interface StudentPortalTeaserProps {
  onLogin: () => void;
}

export default function StudentPortalTeaser({
  onLogin,
}: StudentPortalTeaserProps) {
  return (
    <div className="bg-card/50 border border-border p-6 rounded-3xl text-center">
      <UserIcon className="w-10 h-10 text-foreground mx-auto mb-3" />
      <h3 className="text-foreground font-bold mb-2">Student Portal</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Log in to access your real-time attendance, grades, and exclusive
        learning materials.
      </p>
      <button
        onClick={onLogin}
        className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors"
      >
        Log In Now
      </button>
    </div>
  );
}
