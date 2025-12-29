"use client";

import { useState, useEffect } from "react";
import AttendanceDrawer from "@/components/attendance-drawer";
import SessionDetailModal from "@/components/session-detail-modal";
import Footer from "@/components/footer";
import { useUser } from "@/hooks/use-user";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import {
  Session,
  SessionsResponse,
  MaterialsResponse,
  AttendancesResponse,
} from "@/types/api";
import { useRouter } from "next/navigation";

// Imported Dashboard Components
import DashboardHeader from "@/components/dashboard/header";
import ActiveSessionCard from "@/components/dashboard/active-session-card";
import UpcomingSessionCard from "@/components/dashboard/upcoming-session-card";
import MaterialsList from "@/components/dashboard/materials-list";
import AttendanceStats from "@/components/dashboard/attendance-stats";
import CourseInfoCard from "@/components/dashboard/course-info-card";
import StudentPortalTeaser from "@/components/dashboard/student-portal-teaser";

// --- MOCK DATA FOR DEMO MODE ---
const MOCK_SESSIONS: Session[] = [
  {
    id: 1,
    week_name: "Week 1",
    session_date: new Date().toISOString(), // Today
    attendance_open: true,
    attendance_open_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    week_name: "Week 2",
    session_date: new Date(Date.now() + 86400000 * 7).toISOString(), // Next week
    attendance_open: false,
    attendance_open_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const MOCK_MATERIALS = [
  {
    id: 1,
    title: "Introduction to Algorithms.pdf",
    file_url: "#",
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Data Structures 101.pptx",
    file_url: "#",
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 3,
    title: "Lab Guide - Week 1.docx",
    file_url: "#",
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

const MOCK_ATTENDANCES = [
  {
    id: 1,
    session: {
      id: 1,
      week_name: "Week 1",
      date: new Date().toISOString(),
    },
    submitted_at: new Date().toISOString(),
    address: "Demo Location",
  },
];

export default function Dashboard() {
  const [isAttendanceOpen, setIsAttendanceOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Disable redirect for demo mode
  const {
    user,
    isLoading: isUserLoading,
    isError,
  } = useUser({ redirect: false });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const router = useRouter();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    try {
      await api.post("/logout");
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      queryClient.clear();
      window.location.href = "/login";
    }
  };

  const handleLogin = () => {
    router.push("/login");
  };

  const isLoggedIn = !!user;

  // --- DATA FETCHING ---
  const { data: realSessions } = useQuery({
    queryKey: ["sessions"],
    queryFn: async () => {
      const { data } = await api.get<SessionsResponse>("/sessions");
      return data.data;
    },
    enabled: isLoggedIn, // Only fetch if logged in
  });

  const { data: realRecentMaterials } = useQuery({
    queryKey: ["recentMaterials"],
    queryFn: async () => {
      const { data } = await api.get<MaterialsResponse>("/materials");
      return data.data.slice(0, 4);
    },
    enabled: isLoggedIn,
  });

  const { data: realMyAttendances, isLoading: isLoadingAttendances } = useQuery(
    {
      queryKey: ["myAttendances"],
      queryFn: async () => {
        const { data } = await api.get<AttendancesResponse>("/my-attendances");
        return data.data;
      },
      enabled: isLoggedIn,
    }
  );

  // --- MERGE DATA LOGIC ---
  // Use MOCK data if not logged in, otherwise use REAL data
  const rawSessions = isLoggedIn ? realSessions : MOCK_SESSIONS;
  const rawMaterials = isLoggedIn ? realRecentMaterials : MOCK_MATERIALS;
  const rawAttendances = isLoggedIn ? realMyAttendances : isLoggedIn ? [] : []; // Guests don't show "checked in" initially to encourage them to try interaction or shows "demo checked in"

  // Process Sessions
  const sessions = (rawSessions || []).map((session) => {
    const weekNum = parseInt(session.week_name.replace(/\D/g, "") || "0");
    return {
      ...session,
      title: `Week ${weekNum}`, // Force English title
      start_time: session.session_date,
      end_time: "23:59",
      room: "Online/Hybrid",
      is_open_for_attendance: session.attendance_open === true,
      week_number: weekNum,
      status: session.attendance_open ? "ongoing" : "upcoming",
    } as Session & {
      title: string;
      start_time: string;
      end_time: string;
      room: string;
      is_open_for_attendance: boolean;
      week_number: number;
      status: string;
    };
  });

  const attendancesList = Array.isArray(rawAttendances) ? rawAttendances : [];

  // --- LOGIC ---
  const activeSession = sessions.find((s) => s.is_open_for_attendance === true);

  // For demo: if guest, simulate not attended yet to show the button
  const hasAttended = isLoggedIn
    ? attendancesList.some(
        (a) => activeSession && a.session.id === activeSession.id
      )
    : false;

  // Find next upcoming session
  const upcomingSession = sessions.find(
    (s) =>
      !s.is_open_for_attendance &&
      new Date(s.session_date) >= new Date(new Date().setHours(0, 0, 0, 0))
  );

  // Stats
  const pastSessionsCount =
    sessions.filter((s) => new Date(s.session_date) <= new Date()).length || 1;
  const attendedCount = attendancesList.length || 0;

  // Fake stats for demo if guest
  const displayPastSessions = isLoggedIn ? pastSessionsCount : 5;
  const displayAttended = isLoggedIn ? attendedCount : 4;

  const rawRate = (displayAttended / (displayPastSessions || 1)) * 100;
  const attendanceRate = Math.min(Math.round(rawRate), 100);

  // Semester Progress
  const currentWeek =
    activeSession?.week_number || upcomingSession?.week_number || 1;
  const totalWeeks = 14;
  const progressPercent = Math.min((currentWeek / totalWeeks) * 100, 100);

  // Action Handlers for Demo
  const handleMarkAttendanceCheck = () => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    setIsAttendanceOpen(true);
  };

  const handleViewDetails = () => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    setIsDetailOpen(true);
  };

  // Check if we have a token (implying we should be logged in) but data isn't ready
  const hasToken = isMounted && localStorage.getItem("token");
  const showLoading = isUserLoading || (hasToken && !user && !isError);

  // Prevent flash of demo content while checking auth
  if (showLoading) {
    return (
      <main className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-zinc-500 font-mono text-sm animate-pulse">
            Loading Dashboard...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-indigo-500/30">
      {/* Decorative Background: Coding Pattern */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      ></div>

      {/* DEMO BANNER */}
      {!isLoggedIn && !isUserLoading && (
        <div className="bg-indigo-600/20 border-b border-indigo-500/30 text-indigo-300 px-4 py-2 text-center text-sm font-medium">
          Note: You are viewing a{" "}
          <span className="text-white font-bold">Demo Dashboard</span>. Log in
          to access your real account.
        </div>
      )}

      <div className="max-w-7xl mx-auto p-6 md:p-8 relative z-10">
        <DashboardHeader
          user={user}
          isLoggedIn={isLoggedIn}
          onLogout={handleLogout}
          onLogin={handleLogin}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN: Main Status (Hero) */}
          <div className="lg:col-span-2 space-y-6">
            {/* ACTIVE SESSION CARD */}
            {activeSession ? (
              <ActiveSessionCard
                session={activeSession}
                isLoadingAttendances={isLoadingAttendances}
                isLoggedIn={isLoggedIn}
                hasAttended={hasAttended}
                onMarkAttendance={handleMarkAttendanceCheck}
                onViewDetails={handleViewDetails}
              />
            ) : (
              <UpcomingSessionCard
                upcomingSession={upcomingSession}
                currentWeek={currentWeek}
                totalWeeks={totalWeeks}
                progressPercent={progressPercent}
              />
            )}

            {/* MATERIALS SECTION (Compact List) */}
            <MaterialsList
              materials={rawMaterials || []}
              isLoggedIn={isLoggedIn}
            />
          </div>

          {/* RIGHT COLUMN: Stats & Info */}
          <div className="space-y-6">
            <AttendanceStats
              attendanceRate={attendanceRate}
              displayPastSessions={displayPastSessions}
              displayAttended={displayAttended}
              isLoggedIn={isLoggedIn}
            />

            <CourseInfoCard />

            {/* LOGIN TEASER (Only for guests) */}
            {!isLoggedIn && <StudentPortalTeaser onLogin={handleLogin} />}
          </div>
        </div>
      </div>

      <Footer />

      {isLoggedIn && (
        <AttendanceDrawer
          isOpen={isAttendanceOpen}
          onClose={() => setIsAttendanceOpen(false)}
          session={activeSession}
        />
      )}
      <SessionDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        session={activeSession}
      />
    </main>
  );
}
