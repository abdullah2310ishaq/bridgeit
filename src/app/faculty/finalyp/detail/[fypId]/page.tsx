"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { FaBook, FaCog, FaUsers } from "react-icons/fa";

interface FypDetails {
  id: string;
  fypId: string;
  title: string;
  members: number;
  batch: string;
  technology: string;
  description: string;
}

const FypDetailPage: React.FC = () => {
  const { fypId } = useParams(); // Get FYP ID from the route
  const [fypDetails, setFypDetails] = useState<FypDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFypDetails = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        if (!token) throw new Error("User not authenticated");

        const response = await fetch(`https://localhost:7053/api/fyp/get-fyp-by-id/${fypId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch FYP details.");

        const data = await response.json();
        setFypDetails(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchFypDetails();
  }, [fypId]);

  if (loading) return <div className="text-center text-gray-400">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-4 text-purple-400">{fypDetails?.title}</h1>
        <div className="space-y-4">
          <p>
            <FaBook className="inline-block text-purple-500 mr-2" />
            <strong>FYP ID:</strong> {fypDetails?.fypId}
          </p>
          <p>
            <FaCog className="inline-block text-blue-500 mr-2" />
            <strong>Technology:</strong> {fypDetails?.technology}
          </p>
          <p>
            <FaUsers className="inline-block text-green-500 mr-2" />
            <strong>Members:</strong> {fypDetails?.members}
          </p>
          <p>
            <strong>Batch:</strong> {fypDetails?.batch}
          </p>
          <p>
            <strong>Description:</strong> {fypDetails?.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FypDetailPage;
