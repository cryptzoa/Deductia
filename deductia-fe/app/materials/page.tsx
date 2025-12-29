"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Download,
  FileText,
  Link as LinkIcon,
  PlayCircle,
  Search,
  Filter,
  Presentation, // Added Presentation icon
  Video, // Added Video icon
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { MaterialsResponse, Material } from "@/types/api";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/use-user";

export default function MaterialsPage() {
  const router = useRouter();
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<
    "all" | "pdf" | "video" | "link" | "ppt" // Added 'ppt' to selectedType
  >("all");

  const { data: materials, isLoading } = useQuery({
    queryKey: ["materials"],
    queryFn: async () => {
      const { data } = await api.get<MaterialsResponse>("/materials");
      return data.data;
    },
  });

  // Filter Data
  const filteredMaterials = materials?.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.session_title &&
        item.session_title.toLowerCase().includes(searchQuery.toLowerCase()));

    let matchesType = true;
    if (selectedType === "link") {
      matchesType = !!item.link;
    } else if (selectedType === "ppt") {
      // Added 'ppt' condition
      matchesType = item.file_type === "ppt";
    } else if (selectedType !== "all") {
      matchesType = item.file_type === selectedType;
    }

    return matchesSearch && matchesType;
  });

  const getIcon = (type: string | undefined) => {
    if (type === "pdf") return <FileText className="w-6 h-6 text-primary" />;
    if (type === "ppt")
      return <Presentation className="w-6 h-6 text-primary" />; // Added PPT icon condition
    if (type === "video") return <Video className="w-6 h-6 text-primary" />; // Changed to Video icon
    if (type === "link") return <LinkIcon className="w-6 h-6 text-primary" />;
    return <FileText className="w-6 h-6 text-primary" />; // Covers Other
  };

  return (
    <div className="min-h-screen bg-zinc-950 p-4 md:p-8 pb-20">
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-8">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>
        <div className="flex flex-col md:flex-row justify-between items-end gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Course Materials
            </h1>
            <p className="text-muted-foreground mt-2">
              Access all your learning resources in one place.
            </p>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="max-w-5xl mx-auto sticky top-4 z-20 mb-8">
        <div className="glass-card p-2 rounded-2xl flex flex-col md:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search materials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-card border border-border rounded-xl py-3 pl-12 pr-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            {["all", "pdf", "ppt", "link"].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type as any)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  selectedType === type
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "bg-card text-muted-foreground hover:bg-muted/20"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          // Skeletons
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-32 bg-zinc-900/50 rounded-2xl animate-pulse"
            />
          ))
        ) : filteredMaterials && filteredMaterials.length > 0 ? (
          filteredMaterials.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group relative bg-card border border-border rounded-3xl p-6 hover:border-primary/50 transition-all hover:bg-muted/5"
            >
              <div className="absolute top-6 right-6 p-2 rounded-lg bg-muted/20">
                {getIcon(item.file_type || "pdf")}
              </div>

              <div className="mb-6 mt-2">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  {getIcon(item.file_type || "pdf")}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {item.session_title?.replace(/Pertemuan/i, "Week") ||
                    "General Resources"}
                </p>
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground font-mono">
                <span>
                  {item.created_at
                    ? new Date(item.created_at).toLocaleDateString()
                    : "Unknown Date"}
                </span>
                <div className="flex gap-2">
                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-background border border-border text-muted-foreground hover:text-primary-foreground hover:bg-primary hover:border-primary transition-all"
                      title="Open Link"
                    >
                      <LinkIcon className="w-4 h-4" />
                    </a>
                  )}
                  {item.file_url && (
                    <a
                      href={item.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-background border border-border text-muted-foreground hover:text-primary-foreground hover:bg-primary hover:border-primary transition-all"
                      title="Download File"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
            <div className="w-20 h-20 bg-card rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              No materials found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
