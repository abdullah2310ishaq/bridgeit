"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // Correct hook for Next.js App Router

interface StudentProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  skills: string[];
  description: string;
  universityName: string;
  address: string;
  rollNumber: string;
  imageData: string;
}

interface StudentProject {
  id: string;
  title: string;
  description: string;
  stack: string;
  status: string;
}

const StudentProfilePage: React.FC = () => {
  const { userId } = useParams(); // Correctly capture userId from the URL
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [projects, setProjects] = useState<StudentProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        // Fetch student profile using userId
        const profileResponse = await fetch(
          `https://localhost:7053/api/get-student/student-by-id/${userId}`
        );

        if (!profileResponse.ok) {
          throw new Error("Failed to fetch student profile");
        }

        const profileData = await profileResponse.json();
        setStudentProfile(profileData);

        // Fetch projects using the studentId from the profile data
        if (profileData.id) {
          await fetchStudentProjects(profileData.id);
        }
      } catch (error) {
        setError("Error fetching student profile");
      } finally {
        setLoading(false);
      }
    };

    const fetchStudentProjects = async (studentId: string) => {
      try {
        const projectsResponse = await fetch(
          `https://localhost:7053/api/projects/get-student-projects-by-id/${studentId}`
        );

        if (!projectsResponse.ok) {
          throw new Error("Failed to fetch student projects");
        }

        const projectData = await projectsResponse.json();
        setProjects(projectData);
      } catch (error) {
        setError("Error fetching student projects");
      }
    };

    if (userId) {
      fetchStudentProfile(); // Fetch student profile using userId
    }
  }, [userId]);

  if (loading) {
    return <div className="text-center text-gray-400">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!studentProfile) {
    return <div className="text-center text-gray-400">No profile found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-300 p-6">
      <div className="max-w-4xl mx-auto bg-gray-800 p-6 rounded-lg shadow-md">
        {/* Student Profile Section */}
        <div className="flex items-center space-x-6">
          <img
            src={`data:image/jpeg;base64,${studentProfile.imageData}`}
            alt="Profile Picture"
            className="w-28 h-28 rounded-full object-cover"
          />
          <div>
            <h1 className="text-3xl font-bold text-green-500">{`${studentProfile.firstName} ${studentProfile.lastName}`}</h1>
            <p className="text-gray-400">{studentProfile.email}</p>
            <p className="text-gray-400">{`Roll Number: ${studentProfile.rollNumber}`}</p>
            <p className="text-gray-400">{`University: ${studentProfile.universityName}`}</p>
          </div>
        </div>

        {/* Skills Section */}
        <div className="mt-6">
          <h2 className="text-2xl font-bold text-white mb-4">Skills</h2>
          <ul className="list-disc list-inside">
            {studentProfile.skills.map((skill, index) => (
              <li key={index} className="text-gray-300">
                {skill}
              </li>
            ))}
          </ul>
        </div>

        {/* Description Section */}
        <div className="mt-6">
          <h2 className="text-2xl font-bold text-white mb-4">Description</h2>
          <p className="text-gray-400">{studentProfile.description}</p>
        </div>

        {/* Projects Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-white mb-4">Previous Projects</h2>
          {projects.length > 0 ? (
            <ul className="space-y-4">
              {projects.map((project) => (
                <li key={project.id} className="bg-gray-700 p-4 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold text-green-500">{project.title}</h3>
                  <p className="text-gray-300">{project.description}</p>
                  <p className="text-gray-400">{`Stack: ${project.stack}`}</p>
                  <p className="text-gray-400">{`Status: ${project.status}`}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No projects found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentProfilePage;
