"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface ProjectDetail {
  id: string;
  title: string;
  description: string;
  status: string;
}

export default function StudentProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        router.push("/auth/login-user");
        return;
      }
      try {
        const res = await fetch(
          `https://localhost:7053/api/projects/get-project-by-id/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) throw new Error("Project not found");
        const data = await res.json();
        setProject(Array.isArray(data) ? data[0] : data);
      } catch (e: any) {
        console.error("Fetch project detail failed:", e);
        setError(e.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, router]);

  if (loading) return <div className="p-8 text-center">Loading…</div>;
  if (error) return <div className="p-8 text-red-500 text-center">{error}</div>;
  if (!project) return <div className="p-8 text-center">No project found.</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow">
      <button
        onClick={() => router.back()}
        className="mb-4 text-sm text-indigo-600 hover:underline"
      >
        ← Back
      </button>
      <h1 className="text-2xl font-bold mb-2">{project.title}</h1>
      <p className="text-gray-700 mb-4">{project.description}</p>
      <span
        className={`inline-block px-3 py-1 rounded ${
          project.status === "Completed"
            ? "bg-green-100 text-green-800"
            : "bg-blue-100 text-blue-800"
        }`}
      >
        {project.status}
      </span>
    </div>
  );
}
