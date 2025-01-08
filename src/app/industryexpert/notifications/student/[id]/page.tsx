"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

interface StudentDetails {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  skills: string[];
  description: string;
  department: string;
  universityName: string;
  address: string;
  rollNumber: string;
}

const StudentDetailPage: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();
  const [student, setStudent] = useState<StudentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudentDetails = async () => {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        router.push("/auth/login-user");
        return;
      }

      try {
        const response = await fetch(
          `https://localhost:7053/api/get-student/student-by-student-id/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch student details");

        const data = await response.json();
        setStudent(data);
      } catch (error) {
        setError("Failed to load student details");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentDetails();
  }, [id, router]);

  if (loading) {
    return <div className="text-center text-gray-400">Loading...</div>;
  }

  if (error || !student) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-300 p-4">
      <div className="max-w-3xl mx-auto bg-gray-800 p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-green-500 mb-4">
          {student.firstName} {student.lastName}
        </h1>
        <p><strong>Email:</strong> {student.email}</p>
        <p><strong>Roll Number:</strong> {student.rollNumber}</p>
        <p><strong>Department:</strong> {student.department}</p>
        <p><strong>University:</strong> {student.universityName}</p>
        <p><strong>Address:</strong> {student.address}</p>
        <p><strong>Description:</strong> {student.description}</p>
        <p><strong>Skills:</strong> {student.skills.join(", ")}</p>
      </div>
    </div>
  );
};

export default StudentDetailPage;
