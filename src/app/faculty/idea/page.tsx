"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import Image from "next/image";
import { FaLightbulb, FaRocket, FaCode, FaUsers } from "react-icons/fa";

const CreateIdea: React.FC = () => {
  /* ── state ─────────────────────────────────────── */
  const [title, setTitle]             = useState("");
  const [technology, setTechnology]   = useState("");
  const [description, setDescription] = useState("");
  const [facultyId, setFacultyId]     = useState<string | null>(null);
  const router                        = useRouter();

  /* ── fetch faculty id on mount ─────────────────── */
  useEffect(() => {
    const fetchFacultyId = async () => {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        toast.error("Please log in to access this page.", { autoClose: 3000 });
        router.push("/auth/login-user");
        return;
      }

      try {
        /* 1️⃣ authorized user info ⇒ userId */
        const authRes = await fetch(
          "http://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/http://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/auth/authorized-user-info",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!authRes.ok) throw new Error("Authorization failed.");
        const { userId } = await authRes.json();

        /* 2️⃣ faculty details ⇒ facultyId */
        const facRes = await fetch(
          `http://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/http://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/get-faculty/faculty-by-id/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!facRes.ok) throw new Error("Faculty lookup failed.");
        const { id } = await facRes.json();
        setFacultyId(id);
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Unexpected error.",
          { autoClose: 3000 }
        );
        router.push("/unauthorized");
      }
    };

    fetchFacultyId();
  }, [router]);

  /* ── submit ────────────────────────────────────── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("jwtToken");
    if (!token || !facultyId) {
      toast.error("Authorization failed. Please try again.", { autoClose: 3000 });
      router.push("/auth/login-user");
      return;
    }

    try {
      const res = await fetch(
        `http://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/http://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/ideas/add-idea/${facultyId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title, technology, description }),
        }
      );

      if (res.ok) {
        toast.success("Idea created successfully!", { autoClose: 3000 });
        router.push("/faculty/idea/viewidea");
      } else {
        const msg = await res.text();
        throw new Error(msg || "Creation failed.");
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Error creating idea.",
        { autoClose: 3000 }
      );
    }
  };

  /* ── loading state ─────────────────────────────── */
  if (!facultyId)
    return <div className="text-center text-gray-400">Loading...</div>;

  /* ── render ─────────────────────────────────────── */
  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: "url('/unknown.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* overlay */}
      <div className="absolute inset-0 bg-gray-100 opacity-90" />

      {/* content */}
      <div className="relative z-10 flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-3xl p-8 bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border-2 border-blue-800/20"
        >
          {/* logo */}
          <div className="absolute top-4 left-8">
            <Image src="/logo.jpg" alt="BridgeIT Logo" width={80} height={80} />
          </div>

          {/* heading */}
          <h1 className="flex items-center justify-center gap-3 text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-blue-500 mb-8">
            <FaLightbulb className="text-blue-600" />
            Create&nbsp;New&nbsp;Idea
          </h1>

          {/* form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 bg-gray-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>

              {/* technology */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Technology
                </label>
                <input
                  type="text"
                  value={technology}
                  onChange={(e) => setTechnology(e.target.value)}
                  className="w-full p-3 bg-gray-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>
            </div>

            {/* description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                className="w-full p-3 bg-gray-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>

            {/* submit */}
            <div className="flex justify-center">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(30,64,175,0.4)" }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full py-4 px-6 bg-gradient-to-r from-blue-800 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:from-blue-900 hover:to-blue-700 focus:ring-2 focus:ring-blue-600"
              >
                Submit&nbsp;Idea
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* decorative icons */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 0.15, x: 0 }}
          transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
          className="absolute top-24 right-10 text-blue-600"
        >
          <FaRocket size={90} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 0.15, x: 0 }}
          transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
          className="absolute bottom-24 left-10 text-blue-600"
        >
          <FaCode size={90} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 0.15, y: 0 }}
          transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
          className="absolute top-1/2 left-6 text-blue-600"
        >
          <FaUsers size={70} />
        </motion.div>

        <ToastContainer />
      </div>
    </div>
  );
};

export default CreateIdea;
