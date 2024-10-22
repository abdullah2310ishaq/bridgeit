"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import EventsSection from "./stdcomps/Events";
import studentStore from "../stores/studentStore";
import Loading from "../loading/page";
import ProfileSection from "./stdcomps/ProfileSection";
import OngoingProjectsSection from "./stdcomps/OngoingProjects";
import CompletedProjectsSection from "./stdcomps/CompletedProjects";


const StudentPage: React.FC = () => {
  const { userProfile, setUserProfile, ongoingProjects, setOngoingProjects, completedProjects, setCompletedProjects } = studentStore();
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchProfileAndProjects() {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        router.push("/auth/login-user");
        return;
      }

      try {
        const profileResponse = await fetch(
          "https://localhost:7053/api/auth/authorized-user-info",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          const userId = profileData.userId;

          const studentResponse = await fetch(
            `https://localhost:7053/api/get-student/student-by-id/${userId}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (studentResponse.ok) {
            const studentData = await studentResponse.json();

            setUserProfile({
              userId: studentData.userId,
              firstName: studentData.firstName,
              lastName: studentData.lastName,
              role: profileData.role,
              email: studentData.email,
              universityName: studentData.universityName,
              address: studentData.address,
              rollNumber: studentData.rollNumber,
              imageData: studentData.imageData,
              description: studentData.description || "Add your description by going to edit profile section.",
              uniImage: studentData.uniImage,
            });

            const projectsResponse = await fetch(
              `https://localhost:7053/api/projects/get-student-projects-by-id/${studentData.id}`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (projectsResponse.ok) {
              const projectsData = await projectsResponse.json();
              setCompletedProjects(projectsData.slice(0, 3)); 
            } else {
              setCompletedProjects([]);
            }

            const ongoingProjectsResponse = await fetch(
              `https://localhost:7053/api/projects/get-student-with-expert-project-by-id/${studentData.id}`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (ongoingProjectsResponse.ok) {
              const ongoingData = await ongoingProjectsResponse.json();
              setOngoingProjects(ongoingData);
            } else {
              setOngoingProjects([]);
            }

          } else {
            console.error("Failed to fetch student profile.");
            router.push("/unauthorized");
          }
        } else {
          console.error("Failed to fetch user profile.");
          router.push("/unauthorized");
        }
      } catch (error) {
        console.error("An error occurred:", error);
        router.push("/unauthorized");
      } finally {
        setLoading(false);
      }
    }

    fetchProfileAndProjects();
  }, [router, setUserProfile, setOngoingProjects, setCompletedProjects]);

  if (loading || !userProfile) {
    return (
      <div className="text-center text-gray-400">
        <Loading />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-900 text-gray-300 p-6">
      {/* Profile Section */}
      <ProfileSection
        userProfile={userProfile} goToEditProfile={function (): void {
          throw new Error("Function not implemented.");
        } } gotoProfile={function (): void {
          throw new Error("Function not implemented.");
        } }      />

      {/* Ongoing Projects */}
      <OngoingProjectsSection
        ongoingProjects={ongoingProjects} goToProjectsPage={function (): void {
          throw new Error("Function not implemented.");
        } } createProjects={function (): void {
          throw new Error("Function not implemented.");
        } }      />

      {/* Completed Projects */}
      <CompletedProjectsSection
        projects={completedProjects} />
      {/* Events Section */}
      <EventsSection events={[]} gradientStyles={[]} />
    </div>
  );
};

export default StudentPage;
