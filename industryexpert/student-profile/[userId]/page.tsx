"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface StudentDetails {
  studentId: string;
  firstName: string;
  lastName: string;
}

const StudentDetailsPage: React.FC = () => {
  const { projectId } = useParams();
  const router = useRouter();
  const [studentDetails, setStudentDetails] = useState<StudentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        // Fetch project details including student info
        const response = await fetch(
          `https://localhost:7053/api/projects/get-project-by-id/${projectId}`
        );

        if (!response.ok) throw new Error("Failed to fetch student details.");

        const data = await response.json();

        // Extract student details
        setStudentDetails({
          studentId: data.studentId,
          firstName: data.studentName.split(" ")[0],
          lastName: data.studentName.split(" ")[1] || "",
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentDetails();
  }, [projectId]);

  const handleViewProfile = () => {
    if (studentDetails?.studentId) {
      router.push(`/industryexpert/student-profile/${studentDetails.studentId}`);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Assigned Student</h1>
      {studentDetails ? (
        <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
          <p className="text-xl font-semibold">
            {studentDetails.firstName} {studentDetails.lastName}
          </p>
          <button
            onClick={handleViewProfile}
            className="mt-4 py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-500 transition"
          >
            View Profile
          </button>
        </div>
      ) : (
        <p>No student assigned to this project.</p>
      )}
    </div>
  );
};

export default StudentDetailsPage;
