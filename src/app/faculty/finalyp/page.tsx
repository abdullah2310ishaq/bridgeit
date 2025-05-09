"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaProjectDiagram } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Fyp {
  id: string;
  title: string;
  fypId: string;
  description: string;
  members: number;
}

const IndustryFypPage: React.FC = () => {
  /* ──────────────────────────────
     state, router, side‑effects
  ────────────────────────────── */
  const [fyps, setFyps] = useState<Fyp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchFacultyFypData = async () => {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        router.push("/auth/login-user");
        return;
      }

      try {
        /* 1️⃣  authorized‑user info (gets userId) */
        const authRes = await fetch(
          "https://localhost:7053/api/auth/authorized-user-info",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!authRes.ok) throw new Error("Failed to fetch user info.");
        const { userId } = await authRes.json();

        /* 2️⃣  faculty details (gets facultyId) */
        const facRes = await fetch(
          `https://localhost:7053/api/get-faculty/faculty-by-id/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!facRes.ok) throw new Error("Failed to fetch faculty info.");
        const { id: facultyId } = await facRes.json();

        /* 3️⃣  FYPs for that faculty */
        const fypRes = await fetch(
          `https://localhost:7053/api/fyp/get-fyp-by-faculty-id/${facultyId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!fypRes.ok) throw new Error("Failed to fetch FYPs.");
        const data = await fypRes.json();
        setFyps(data);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "An unknown error occurred.";
        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchFacultyFypData();
  }, [router]);

  /* ──────────────────────────────
     helpers
  ────────────────────────────── */
  const handleFypClick = (fypId: string) => {
    router.push(`/faculty/finalyp/detail/${fypId}`);
  };

  /* ──────────────────────────────
     render
  ────────────────────────────── */
  if (loading) return <div className="text-center text-gray-400">Loading...</div>;
  if (error)   return <div className="text-center text-red-500">{error}</div>;

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      /* same blurry‑overlay background treatment */
      style={{
        backgroundImage: "url('/unknown.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* dim the backdrop */}
      <div className="absolute inset-0 bg-gray-100 opacity-90"></div>

      {/* content */}
      <div className="relative z-10 flex flex-col items-center justify-start p-6 py-16">
        {/* logo (optional) */}
        <div className="absolute top-4 left-8">
          <Image src="/logo.jpg" alt="BridgeIT Logo" width={80} height={80} />
        </div>

        {/* heading */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-blue-500 mb-10 text-center"
        >
          Industry&nbsp;FYPs
        </motion.h1>

        {/* FYP cards */}
        {fyps.length ? (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.07, delayChildren: 0.25 },
              },
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl"
          >
            {fyps.map((fyp) => (
              <motion.div
                key={fyp.id}
                onClick={() => handleFypClick(fyp.id)}
                whileHover={{ y: -6, boxShadow: "0 12px 24px rgba(0,0,0,0.25)" }}
                className="cursor-pointer bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-xl border-2 border-blue-800/20 transition duration-200"
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              >
                <h2 className="text-xl font-semibold text-gray-900">{fyp.title}</h2>
                <p className="text-gray-700 mt-1">FYP&nbsp;ID:&nbsp;{fyp.fypId}</p>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center text-gray-300 mt-10">
            No FYPs found for this faculty.
          </div>
        )}

        {/* decorative icon */}
        <motion.div
          initial={{ opacity: 0, rotate: -15 }}
          animate={{ opacity: 0.15, rotate: 0 }}
          transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
          className="absolute bottom-16 right-16 text-blue-600"
        >
          <FaProjectDiagram size={120} />
        </motion.div>

        {/* toasts */}
        <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
      </div>
    </div>
  );
};

export default IndustryFypPage;
