"use client";

import { useState, Suspense, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Eye, EyeOff, User, Mail, KeyRound } from "lucide-react";
import { clsx } from "clsx";
import api from "@/lib/axios";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  const rawEmail =
    searchParams.get("email") || searchParams.get("amp;email") || "";
  
  const email = decodeURIComponent(rawEmail);

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (password !== passwordConfirmation) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      await api.post("/reset-password", {
        token,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });

      setSuccess("Password has been reset successfully!");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      if (err.response) {
        setError(err.response.data.message || "Failed to reset password.");
      } else {
        setError("Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  
  if (!token) {
    return (
      <div className="text-center text-muted-foreground">
        Invalid or missing token. Please use the link from your email.
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center p-6 sm:p-12 lg:bg-zinc-900/20 lg:backdrop-blur-sm border-l border-border w-full h-full">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md space-y-8"
      >
        <div className="text-center lg:text-left">
          <h2 className="text-3xl font-bold text-foreground">Set New Password</h2>
          <p className="text-muted-foreground mt-2">Enter your new secure password.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground ml-1">
              Email Address
            </label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 transition-colors group-focus-within:text-primary" />
              <input
                type="text"
                value={email}
                readOnly
                className="w-full pl-12 pr-4 py-4 bg-muted/50 border border-muted-foreground/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 text-foreground placeholder:text-muted-foreground transition-all font-medium opacity-70 cursor-not-allowed"
                placeholder="Email"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground ml-1">
              New Password
            </label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 transition-colors group-focus-within:text-primary" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-4 bg-muted/50 border border-muted-foreground/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 text-foreground placeholder:text-muted-foreground transition-all font-medium"
                placeholder="New Password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground ml-1">
              Confirm Password
            </label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 transition-colors group-focus-within:text-primary" />
              <input
                type={showPassword ? "text" : "password"}
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-muted/50 border border-muted-foreground/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 text-foreground placeholder:text-muted-foreground transition-all font-medium"
                placeholder="Confirm New Password"
                required
              />
            </div>
          </div>

          {error && (
            <div className="text-destructive text-sm text-center bg-destructive/10 py-3 rounded-xl border border-destructive/20">
              {error}
            </div>
          )}

          {success && (
            <div className="text-green-400 text-sm text-center bg-green-500/10 py-3 rounded-xl border border-green-500/20">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={clsx(
              "w-full py-4 rounded-xl font-bold shadow-xl shadow-primary/20 transition-all relative overflow-hidden group",
              loading
                ? "bg-muted cursor-not-allowed opacity-70"
                : "bg-gradient-to-r from-primary to-secondary hover:scale-[1.02] active:scale-[0.98] text-primary-foreground"
            )}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {loading ? "Resetting..." : "Reset Password"}
            </span>
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen bg-background text-foreground overflow-hidden relative">
      {}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full h-screen grid grid-cols-1 lg:grid-cols-2 relative z-10">
        {}
        <div className="hidden lg:flex flex-col justify-center items-center p-12 relative">
          <div className="absolute inset-0 bg-background/30 backdrop-blur-3xl" />
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 max-w-lg text-center"
          >
            <div className="mb-8 inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-primary to-secondary shadow-2xl shadow-primary/20">
              <KeyRound className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold mb-4 text-foreground">Reset Password</h1>
            <p className="text-muted-foreground text-lg mb-8">
              Create a new password that you will remember to secure your
              account.
            </p>
          </motion.div>
        </div>

        <Suspense
          fallback={
            <div className="text-foreground text-center p-10">Loading...</div>
          }
        >
          <ResetPasswordContent />
        </Suspense>
      </div>
    </div>
  );
}
