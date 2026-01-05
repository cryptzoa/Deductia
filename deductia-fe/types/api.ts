export interface User {
  id: number;
  name: string;
  email?: string;
  nim: string;
  role: "mahasiswa" | "dosen" | "admin";
  status?: "active" | "inactive" | "pending";
  is_active?: boolean;
}

export interface Material {
  id: number;
  title: string;
  description?: string;
  file_url?: string;
  link?: string;
  
  file_type?: "pdf" | "video" | "link" | "ppt" | "other";
  session_title?: string;
  created_at?: string; 
}

export interface Session {
  id: number;
  week_name: string; 
  session_date: string; 
  material?: Material;
  attendance_open: boolean;
  attendance_open_at?: string | null;
  remaining_minutes?: number;
  created_at?: string;
  updated_at?: string;

  
  title?: string;
  start_time?: string;
  end_time?: string;
  room?: string;
  is_open_for_attendance?: boolean; 
  week_number?: number; 
  status?: "upcoming" | "ongoing" | "finished";
}

export interface Attendance {
  id: number;
  session: {
    id: number;
    week_name: string;
    date: string;
  };
  submitted_at: string;
  address: string;
}

export interface ApiResponse<T> {
  message?: string;
  data: T;
}

export interface LoginData {
  token: string;
  user: User;
}

export type LoginResponse = ApiResponse<LoginData>;
export type SessionsResponse = ApiResponse<Session[]>;
export type MaterialsResponse = ApiResponse<Material[]>;
export type AttendancesResponse = ApiResponse<Attendance[]>;
