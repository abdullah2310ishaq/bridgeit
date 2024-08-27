"use client"
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProfileDropdown from "../components/ProfileDropdown";
import ProjectCard from "../components/CompletedProjects";
import OngoingProject from "./stdcomps/Ongoing";
import UpcomingEvents from "./stdcomps/UpComingEvents";

interface UserProfile {
  userId: string;
  firstName: string;
  lastName: string;
  role: string;
  email: string;
  universityName: string;
  address: string;
  rollNumber: string;
  imageData: string;
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
  title: string;
  progress: number;
}

interface Event {
  id: string;
  title: string;
  date: string;
}

const StudentPage: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [ongoingProject, setOngoingProject] = useState<OngoingProject | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchProfileAndProjects() {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        router.push("/auth/login-user");
        return;
      }

      try {
        const profileResponse = await fetch("https://localhost:7053/api/auth/authorized-user-info", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          const userId = profileData.userId;

          const studentResponse = await fetch(`https://localhost:7053/api/get-student/student-by-id/${userId}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

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
            });

            // Fetch projects associated with the student
            const projectsResponse = await fetch(`https://localhost:7053/api/projects/get-student-projects-by-id/${studentData.id}`, {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            if (projectsResponse.ok) {
              const projectsData = await projectsResponse.json();
              setProjects(projectsData.slice(0, 2)); // Display only the first 2 projects
            } else {
              setProjects([]); // Handle case where no projects are returned
            }

            // Fetch ongoing project (dummy data for now)
            setOngoingProject({
              title: "E-Commerce App",
              progress: 54,
            });

            // Fetch events from the API
            const eventsResponse = await fetch("https://localhost:7053/api/Events/get-events", {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            if (eventsResponse.ok) {
              const eventsData = await eventsResponse.json();
              setEvents(eventsData);
            } else {
              setEvents([]); // Handle case where no events are returned
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
  const goToEventsPage = () => {
    router.push("/student/events");
  };

  const gotoProfile = () => {
    router.push("/student/profile");
  };

  const goToProjectsPage = () => {
    router.push("/student/projects");
  };

  if (!userProfile) {
    return <div className="text-center text-gray-400">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 p-6">
      {/* Navbar */}
      <nav className="bg-white shadow-md rounded-lg mb-6 p-4 flex justify-between items-center">
        <h1 className="text-2xl font-extrabold text-blue-700">Student Dashboard</h1>
        <div className="flex items-center space-x-4">
          <button onClick={handleLogout} className="hover:text-blue-500 transition-colors duration-300">
            Logout
          </button>
          <ProfileDropdown userProfile={userProfile} onLogout={handleLogout} />
        </div>
      </nav>

      {/* Profile Section */}
      <div 
        className="relative bg-cover bg-center p-6 mb-6 rounded-lg shadow-lg max-w-6xl mx-auto flex items-center" 
        style={{ backgroundImage: `url('/studenttop.jpg')`, height: "300px" }}
      >
        <div className="absolute inset-0 rounded-lg"></div>
        <div className="relative flex items-center w-full">
          <div className="flex-shrink-0">
            <img
              src={`data:image/jpeg;base64,${userProfile.imageData}`}
              alt={`${userProfile.firstName} ${userProfile.lastName}`}
              className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow-lg mr-8"
            />
          </div>
          <div className="flex-grow text-black text-center">
            <h2 className="text-2xl font-bold">
              {userProfile.firstName} {userProfile.lastName}
            </h2>
            <p className="text-lg">Role: {userProfile.role}</p>
            <p className="text-lg">User ID: {userProfile.userId}</p>
            <p className="text-lg">Email: {userProfile.email}</p>
            <p className="text-lg">University: {userProfile.universityName}</p>
            <p className="text-lg">Roll Number: {userProfile.rollNumber}</p>
            <div className="mt-4 space-x-4">
              <button onClick={goToEditProfile} className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 transition duration-200">
                Edit Profile
              </button>
              <button onClick={gotoProfile} className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 transition duration-200">
                View Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Ongoing Project Section */}
      <div className="bg-white p-6 mb-6 rounded-lg shadow-lg max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex-1">
          <OngoingProject title={ongoingProject?.title ?? ''} technologies={[]} description={""}  />
        </div>
      </div>

      {/* Completed Projects Section */}
      <div className="flex flex-col items-center px-6 mb-6 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-blue-700 mb-4">Completed Projects</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full">
          {projects.length > 0 ? (
            projects.map((project) => (
              <ProjectCard key={project.id} title={project.title} description={project.description} />
            ))
          ) : (
            <p className="text-gray-500">No completed projects available.</p>
          )}
        </div>
        <div className="mt-8">
          <button onClick={goToProjectsPage} className="py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 transition duration-200">
            See More Projects
          </button>
        </div>
      </div>

      {/* Upcoming University Events Section */}
      <UpcomingEvents events={events} limit={3} />
      <div className="text-center mt-4">
        <button
          onClick={goToEventsPage}
          className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 transition duration-200"
        >
          See More Events
        </button>
      </div>
      <div className="bg-white p-6 mb-6 rounded-lg shadow-lg max-w-6xl mx-auto flex justify-between items-center"/>
        
      {/* Footer */}
      
      <footer className="bg-gray-900 p-4 text-center text-gray-500 rounded-lg max-w-6xl mx-auto">
        <p>&copy; 2024 BridgeIT. All rights reserved.</p>
        <p>&copy; Aesyem Institute Of Science & Technology</p>
      </footer>
    </div>
  );
};

export default StudentPage;
