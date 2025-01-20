"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface Milestone {
  id: string;
  title: string;
  description: string;
  achievementDate: string;
}

interface StudentDetails {
  studentId: string;
  firstName: string;
  lastName: string;
}

const MilestonePage: React.FC = () => {
  const { projectId } = useParams();
  const router = useRouter();
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [studentDetails, setStudentDetails] = useState<StudentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjectAndMilestones = async () => {
      try {
        // Fetch project details including student info
        const projectResponse = await fetch(
          `https://localhost:7053/api/projects/get-project-by-id/${projectId}`
        );

        if (!projectResponse.ok) throw new Error("Failed to fetch project details.");

        const projectData = await projectResponse.json();

        // Extract student details
        setStudentDetails({
          studentId: projectData.studentId,
          firstName: projectData.studentName.split(" ")[0],
          lastName: projectData.studentName.split(" ")[1] || "",
        });

        // Fetch milestones
        const milestonesResponse = await fetch(
          `https://localhost:7053/api/milestone/get-project-milestones/${projectId}`
        );

        if (!milestonesResponse.ok) throw new Error("Failed to fetch milestones.");

        const milestonesData = await milestonesResponse.json();
        setMilestones(milestonesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjectAndMilestones();
  }, [projectId]);

  const handleViewStudentProfile = () => {
    if (studentDetails?.studentId) {
      router.push(`/industryexpert/student-profile/${studentDetails.studentId}`);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Project Milestones</h1>

      {/* Student Details Section */}
      {studentDetails && (
        <div className="p-6 mb-6 bg-gray-800 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Assigned Student</h2>
          <p className="text-xl font-semibold">
            {studentDetails.firstName} {studentDetails.lastName}
          </p>
          <button
            onClick={handleViewStudentProfile}
            className="mt-4 py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-500 transition"
          >
            View Profile
          </button>
        </div>
      )}

      {/* Milestones Section */}
      <h2 className="text-2xl font-bold mb-4">Milestones</h2>
      {milestones.length > 0 ? (
        milestones.map((milestone) => (
          <div key={milestone.id} className="mb-4 p-4 bg-gray-800 rounded shadow">
            <h3 className="text-xl font-semibold">{milestone.title}</h3>
            <p>{milestone.description}</p>
            <p>
              <strong>Achievement Date:</strong> {milestone.achievementDate}
            </p>
          </div>
        ))
      ) : (
        <p>No milestones available for this project.</p>
      )}
    </div>
  );
};

export default MilestonePage;
