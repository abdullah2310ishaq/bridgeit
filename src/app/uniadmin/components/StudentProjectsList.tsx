"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
}

export default function StudentProjectsList() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchList() {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        router.push("/auth/login-user");
        return;
      }
      try {
        const res = await fetch(
          "https://localhost:7053/api/projects/get-student-projects",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }
        const data: Project[] = await res.json();
        setProjects(data.filter((p) => p.status !== "Completed"));
      } catch (e: any) {
        console.error("Fetch student projects failed:", e);
        setError(e.message || "Failed to load projects");
      } finally {
        setLoading(false);
      }
    }
    fetchList();
  }, [router]);

  if (loading) return <div className="py-8 text-center">Loading…</div>;
  if (error) return <div className="py-8 text-center text-red-500">{error}</div>;

  return (
    <div className="space-y-4">
      {projects.length === 0 && (
        <p className="italic text-gray-500">No ongoing student projects.</p>
      )}
      {projects.map((p) => (
        <div
          key={p.id}
          className="p-4 bg-white rounded-lg shadow flex justify-between"
        >
          <div>
            <h3 className="text-lg font-medium">{p.title}</h3>
            <p className="text-sm text-gray-600 line-clamp-2">
              {p.description}
            </p>
          </div>
          <button
            onClick={() => router.push(`/uniadmin/projects/${p.id}`)}
            className="text-indigo-600 hover:underline text-sm self-start"
          >
            Details →
          </button>
        </div>
      ))}
    </div>
  );
}
