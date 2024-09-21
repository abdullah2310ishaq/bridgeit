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

  const createEvents=()=>{
router.push("/student/projects/create")
  }

  if (!userProfile) {
    return <div className="text-center text-gray-400">Loading...</div>;
  }
  
  return (
    <div className="min-h-screen bg-gray-900 text-gray-300 flex justify-center items-start p-4">
      <div className="w-full max-w-7xl mx-auto"> {/* Central Container with Increased Width */}
        {/* Navbar */}
        <nav className="bg-gray-800 shadow-lg rounded-lg mb-8 p-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-green-500">Student Profile</h1>
          <div className="flex items-center space-x-6">
            <button onClick={handleLogout} className="hover:text-green-400 transition-colors duration-300">
              Logout
            </button>
            <button onClick={() => router.push("/student/projects/explore-projects")} className="hover:text-green-400 transition-colors duration-300">
              Explore Projects
            </button>
            <ProfileDropdown userProfile={userProfile} onLogout={handleLogout} />
          </div>
        </nav>
  
{/* Profile Section */}
<div className="relative flex flex-col md:flex-row justify-between items-center bg-gray-800 bg-opacity-80 p-12 rounded-2xl shadow-2xl mb-8 overflow-hidden"
     style={{ backgroundImage: `url('/studenttop.jpg')`, height: "450px", backgroundSize: 'cover', backgroundPosition: 'center' }}>
  <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm"></div> 
  
  <div className="relative flex items-center w-full z-10">
    {/*Profile Info */}
    <div className="text-white flex-grow pr-10">
      <h2 className="text-5xl font-bold text-green-400 leading-tight drop-shadow-lg">
        {userProfile.firstName} {userProfile.lastName}
      </h2>
      <p className="text-lg text-gray-300 mt-2 tracking-wide italic">
        Computer Science - {userProfile.universityName}
      </p>
      <p className="text-lg mt-2">Roll Number: <span className="font-bold">{userProfile.rollNumber}</span></p>
      <p className="text-lg">User ID: <span className="font-bold">{userProfile.userId}</span></p>
      
      {/* Buttons */}
      <div className="mt-6 space-x-4">
        <button onClick={goToEditProfile} 
                className="py-2 px-6 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold rounded-lg shadow-md hover:from-green-600 hover:to-blue-600 transition transform hover:scale-105">
          Edit Profile
        </button>
        <button onClick={gotoProfile} 
                className="py-2 px-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg shadow-md hover:from-purple-600 hover:to-pink-600 transition transform hover:scale-105">
          View Profile
        </button>
      </div>
    </div>

    {/* Profile Image */}
    <div className="elative z-10 mt-6 md:mt-0 md:w-1/2 flex justify-center">
      <img src={`data:image/jpeg;base64,${userProfile.imageData}`} 
           alt={`${userProfile.firstName} ${userProfile.lastName}`} 
           className="w-60 h-60 rounded-full object-cover border-4 border-green-400 shadow-xl transition-transform duration-300 transform hover:scale-110" />
    </div>
  </div>
</div>


  
        {/* Completed Projects Section */}
        <h2 className="text-2xl font-bold text-green-500 mt-12 mb-4 text-center">Completed Projects</h2>
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-20"> {/* Increased gap and centered layout */}
          {projects.length > 0 ? (
            projects.map((project) => (
              <ProjectCard key={project.id} title={project.title} description={project.description} />
            ))
          ) : (
            <p className="text-gray-400 text-center col-span-2">No completed projects available.</p>
          )}
        </div>
        <div className="mt-8 text-center">
          <button onClick={goToProjectsPage} className="py-3 px-6 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-500 transition duration-200">
            See More Projects
          </button>

          <button onClick={createEvents} className="py-3 px-6 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-500 transition duration-200">
            Create Projects
          </button>
        </div>
  
        {/* Upcoming University Events Section */}
        <h2 className="text-2xl font-bold text-green-500 mt-12 mb-4 text-center">Upcoming University Events</h2>
        <UpcomingEvents events={events} limit={3} />
        <div className="mt-8 text-center">
          <button onClick={goToEventsPage} className="py-3 px-6 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-500 transition duration-200">
            See More Events
          </button>
        </div>
  
        {/* Footer */}
        <footer className="bg-gray-800 text-gray-400 py-4 text-center rounded-lg shadow-lg mt-12">
          <p>&copy; 2024 BridgeIT. All rights reserved.</p>
          <p>&copy; Aesyem Institute Of Science & Technology</p>
        </footer>
      </div>
    </div>
  );
  
  
  
  

};

export default StudentPage;
