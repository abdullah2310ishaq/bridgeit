"use client"
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from 'next/dynamic';
import IdeasSection from "./stdcomps/IdeasSection";
import ProfileSection from "./stdcomps/ProfileSection";
import Loading from "../loading/page";
import OngoingProjectsSection from "./stdcomps/OngoingProjects";
import CompletedProjectsSection from "./stdcomps/CompletedProjects";
import EventsSection from "./stdcomps/Events";
import ChatWidget from "../chat/ChatWidget";

// Import the ChatWidget component

interface UserProfile {
  userId: string;
  firstName: string;
  lastName: string;
  description: string;
  role: string;
  email: string;
  universityName: string;
  address: string;
  rollNumber: string;
  imageData: string;
  uniImage: string;
}

interface Idea {
  id: string;
  title: string;
  technology: string;
  description: string;
  facultyName: string;
  email: string;
  uniName: string;
}

interface Event {
  id: string;
  title: string;
  speakerName: string;
  eventDate: string;
  venue: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
}

interface OngoingProject {
  id: string;
  title: string;
  description: string;
  expertName: string;
  status: string;
  endDate: string;
}

const StudentPage: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [completedProjects, setCompletedProjects] = useState<Project[]>([]);
  const [ongoingProjects, setOngoingProjects] = useState<OngoingProject[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState(false);
  const [personalProjects, setPersonalProjects] = useState<Project[]>([]);
  const[myIdeas,setMyIdeas]=useState<Idea[]>([]);

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
              description:
                studentData.description ||
                "Add your description by going to edit profile section.",
              uniImage: studentData.uniImage,
            });

            // Fetch completed projects
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
              setCompletedProjects(projectsData.slice(0, 3)); // Limit to 3 projects
            } 

            // Fetch ongoing projects
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

            // Fetch events
            const eventsResponse = await fetch(
              "https://localhost:7053/api/Events/get-events",
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (eventsResponse.ok) {
              const eventsData = await eventsResponse.json();
              setEvents(eventsData);
            } else {
              setEvents([]);
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
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    router.push("/auth/login-user");
  };

  const goToEditProfile = () => {
    router.push("/student/profile/edit");
  };

  const handleIdeaClick = (id: string) => {
    // e.g., navigate to a details page
    router.push(`/student/seeideas/${id}`);
  };

  const gotoProfile = () => {
    router.push("/student/profile");
  };

  const goToProjectsPage = () => {
    router.push("/student/projects");
  };

  const createProjects = () => {
    router.push("/student/projects/create");
  };

 

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const gradientStyles = [
    "bg-gradient-to-r from-green-400 to-blue-500",
    "bg-gradient-to-r from-purple-400 to-pink-500",
    "bg-gradient-to-r from-yellow-400 to-red-500",
    "bg-gradient-to-r from-indigo-400 to-purple-600",
    "bg-gradient-to-r from-orange-400 to-pink-500",
  ];

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
        userProfile={userProfile}
        goToEditProfile={goToEditProfile}
        gotoProfile={gotoProfile}
      />

      {/* Ongoing Projects */}
      <OngoingProjectsSection ongoingProjects={ongoingProjects} />


      {/* Completed Projects */}
      <CompletedProjectsSection
        projects={completedProjects} />

      {/* Events Section */}
      <EventsSection
        events={events}
        gradientStyles={gradientStyles}
      />

    

      {/* Chat Widget Component */}
      /<ChatWidget/> 
          </div>
  );
};

export default StudentPage;
