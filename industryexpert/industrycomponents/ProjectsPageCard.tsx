"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ProjectCardProps {
  projectId: string; // Project ID for navigation
  title: string;
  description: string;
  endDate: string;
}

interface StudentDetails {
  studentId: string;
  firstName: string;
  lastName: string;
}

const ProjecttCard: React.FC<ProjectCardProps> = ({
  projectId,
  title,
  description,
  endDate,
}) => {
  const router = useRouter();
  const [studentDetails, setStudentDetails] = useState<StudentDetails | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const response = await fetch(
          `https://localhost:7053/api/projects/get-project-by-id/${projectId}`
        );

        if (!response.ok) throw new Error("Failed to fetch student details.");

        const projectData = await response.json();
        if (projectData.studentId) {
          setStudentDetails({
            studentId: projectData.studentId,
            firstName: projectData.studentName.split(" ")[0],
            lastName: projectData.studentName.split(" ")[1] || "",
          });
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStudentDetails();
  }, [projectId]);

  const handleViewStudentProfile = () => {
    if (studentDetails?.studentId) {
      router.push(`/industryexpert/student-profile/${studentDetails.studentId}`);
    }
  };

  return (
    <div className="p-4 border border-gray-300 rounded-lg shadow-sm bg-white hover:shadow-md transition-all duration-300">
      {/* Project Title */}
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>

      {/* Project Description */}
      <p className="text-sm text-gray-600 mb-4">{description}</p>

      {/* Project End Date */}
      <p className="text-sm text-gray-500 mb-4">
        <strong>End Date:</strong> {endDate}
      </p>

      {/* Student Details */}
      {loading ? (
        <p className="text-sm text-gray-500">Loading student details...</p>
      ) : error ? (
        <p className="text-sm text-red-500">{error}</p>
      ) : studentDetails ? (
        <div className="text-sm text-gray-600">
          <p>
            <strong>Student:</strong> {studentDetails.firstName}{" "}
            {studentDetails.lastName}
          </p>
          <button
            onClick={handleViewStudentProfile}
            className="mt-4 py-1 px-4 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition"
          >
            View Profile
          </button>
        </div>
      ) : (
        <p className="text-sm text-gray-500">No student assigned</p>
      )}
    </div>
  );
};

export default ProjecttCard;
