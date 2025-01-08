"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
        // Step 1: Fetch user info to get userId
        const authResponse = await fetch(
          "https://localhost:7053/api/auth/authorized-user-info",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!authResponse.ok) throw new Error("Failed to fetch user info.");

        const authData = await authResponse.json();
        const userId = authData.userId;

        // Step 2: Fetch faculty ID using userId
        const facultyResponse = await fetch(
          `https://localhost:7053/api/get-faculty/faculty-by-id/${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!facultyResponse.ok) throw new Error("Failed to fetch faculty info.");

        const facultyData = await facultyResponse.json();
        const facultyId = facultyData.id;

        // Step 3: Fetch FYPs using facultyId
        const fypResponse = await fetch(
          `https://localhost:7053/api/fyp/get-fyp-by-faculty-id/${facultyId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!fypResponse.ok) throw new Error("Failed to fetch FYPs.");

        const fypData = await fypResponse.json();
        setFyps(fypData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred.");
        toast.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchFacultyFypData();
  }, [router]);

  if (loading) return <div className="text-center text-gray-400">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  const handleFypClick = (fypId: string) => {
    router.push(`/faculty/finalyp/detail/${fypId}`); // Dynamic navigation
  };
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-purple-400">
          Industry FYPs
        </h1>
        {fyps.length > 0 ? (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {fyps.map((fyp) => (
           <div
             key={fyp.id}
             onClick={() => handleFypClick(fyp.id)}
             className="cursor-pointer bg-gray-800 rounded-lg shadow-lg p-6 hover:bg-gray-700 transition duration-200"
           >
             <h2 className="text-xl font-semibold">{fyp.title}</h2>
             <p>FYP ID: {fyp.fypId}</p>
           </div>
         ))}
       </div>
        ) : (
          <div className="text-center text-gray-400 mt-10">
            No FYPs found for this faculty.
          </div>
        )}
      </div>
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default IndustryFypPage;
