"use client";

import { Book, FileText, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";

interface MaterialsListProps {
  materials: any[];
  isLoggedIn: boolean;
}

export default function MaterialsList({
  materials,
  isLoggedIn,
}: MaterialsListProps) {
  const router = useRouter();

  return (
    <div className="bg-card border border-border p-6 rounded-3xl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="flex items-center gap-2 font-bold text-foreground">
          <Book className="w-5 h-5 text-muted-foreground" />
          Recent Resources
        </h3>
        <button
          onClick={() => router.push(isLoggedIn ? "/materials" : "/login")}
          className="text-xs font-mono text-primary hover:text-primary/80"
          type="button"
        >
          VIEW_ALL_FILES()
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {materials && materials.length > 0 ? (
          materials.map((item) => (
            <a
              key={item.id}
              href={isLoggedIn ? item.file_url : "/login"}
              target={isLoggedIn ? "_blank" : "_self"}
              className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border hover:border-primary/30 hover:bg-muted/10 transition-all group"
            >
              <div className="p-2 bg-black rounded-lg text-muted-foreground group-hover:text-primary transition-colors">
                <FileText className="w-5 h-5" />
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                  {item.title}
                </p>
                <p className="text-xs text-muted-foreground truncate font-mono">
                  {item.created_at
                    ? new Date(item.created_at).toLocaleDateString("id-ID")
                    : "Unknown Date"}
                </p>
              </div>
              {!isLoggedIn && (
                <div className="ml-auto">
                  <LogIn className="w-4 h-4 text-zinc-600 group-hover:text-indigo-400" />
                </div>
              )}
            </a>
          ))
        ) : (
          <div className="col-span-2 text-center py-8 text-zinc-500 text-sm">
            No resources uploaded yet.
          </div>
        )}
      </div>
    </div>
  );
}
