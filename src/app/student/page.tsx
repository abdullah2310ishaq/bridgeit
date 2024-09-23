"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProfileDropdown from "../components/ProfileDropdown";
import OngoingProject from "./stdcomps/Ongoing"
import { motion } from "framer-motion";

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
              setProjects(projectsData.slice(0, 3)); 
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

  const createEvents = () => {
    router.push("/student/projects/create");
  };

  const gradientStyles = [
    'bg-gradient-to-r from-green-400 to-blue-500',
    'bg-gradient-to-r from-purple-400 to-pink-500',
    'bg-gradient-to-r from-yellow-400 to-red-500',
    'bg-gradient-to-r from-indigo-400 to-purple-600',
    'bg-gradient-to-r from-orange-400 to-pink-500',
  ];

  if (!userProfile) {
    return <div className="text-center text-gray-400">Loading...</div>;
  }
  
  return (
    <div className="min-h-screen bg-gray-900 text-gray-300 p-6"> {/* Central flex layout */}
      {/* Navbar */}
      <nav className="bg-gray-800 shadow-lg rounded-lg mb-6 p-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-green-500">Student Profile</h1>
        <div className="hidden md:flex space-x-8">
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
           style={{ backgroundImage: "url('/studentbg.jpg')", height: "600px", backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm"></div>
        <div className="relative flex items-center w-full z-10">
          {/*Profile Info */}
          <div className="text-white flex-grow pr-10">
            <h2 className="text-6xl font-bold text-green-400 leading-tight drop-shadow-2xl">
             Welcome, {userProfile.firstName} {userProfile.lastName}
            </h2>
            <p className="text-lg text-gray-300 mt-2 tracking-wide italic">
              Computer Science - {userProfile.universityName}
            </p>
            <p className="text-lg mt-2">Roll Number: <span className="font-bold">{userProfile.rollNumber}</span></p>
            <p className="text-lg">User ID: <span className="font-bold">{userProfile.userId}</span></p>
            
            {/* Buttons */}
            <div className="mt-6 space-x-4">
              <button onClick={goToEditProfile} 
                      className="px-10 py-4 bg-blue-500 text-white font-bold rounded-full shadow-lg hover:shadow-blue-500/50 transition duration-300 transform hover:scale-105">
                Edit Profile
              </button>
              <button onClick={gotoProfile} 
                      className="px-10 py-4 bg-purple-500 text-white font-bold rounded-full shadow-lg hover:shadow-purple-500/50 transition duration-300 transform hover:scale-105">
                View Profile
              </button>
            </div>
          </div>

          {/* Profile Image */}
          <div className="relative z-10 mt-6 md:mt-0 md:w-1/2 flex justify-center">
            <img src={`data:image/jpeg;base64,${userProfile.imageData}`} 
                alt={`${userProfile.firstName} ${userProfile.lastName}`} 
                className="w-80 h-80 rounded-full border-4 border-green-400 object-cover shadow-2xl transform hover:scale-110 transition duration-300" />
          </div>
        </div>
      </div>

{/* Completed Projects Section */}
<section className="relative py-16 bg-gray-900">
  <div
    className="absolute inset-y-0 right-0 w-1/2 bg-cover bg-center opacity-20"
    style={{ backgroundImage: `url('/projectBG.png')`, backgroundSize: "contain", backgroundRepeat: "no-repeat" }}
  ></div>

  <div className="relative max-w-7xl mx-auto flex justify-between items-center mb-16">
    {/* Heading on the Left */}
    <div className="text-left">
      <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-500 to-purple-500">
        Completed Projects
      </h2>
    </div>
  </div>

  {/* Project Boxes */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 px-4 md:px-12">
    {projects.length > 0 ? (
      projects.map((project) => (
        <motion.div
          key={project.id}
          whileHover={{ scale: 1.05 }}
          className="bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:scale-105"  // Changed the box to solid background
        >
          {/* Title */}
          <h3 className="text-2xl font-bold text-green-300 mb-4">{project.title}</h3>
          
          {/* Description */}
          <p className="text-gray-400 mb-4">{project.description}</p>
        

          {/* Additional Project Info */}
          <div className="text-left mt-4">
            <p className="text-sm text-gray-400">
              <span className="font-bold text-gray-300">Status:</span> Completed
            </p>
            <p className="text-sm text-gray-400">
              <span className="font-bold text-gray-300">Duration:</span> 6 months
            </p>

          </div>

          {/* Click for More Button */}
          <div className="mt-6 text-right">
            <button
              onClick={goToProjectsPage}
              className="text-blue-400 hover:text-blue-600 underline text-sm font-semibold transition-colors"
            >
              Click for More
            </button>
          </div>
        </motion.div>
      ))
    ) : (
      <p className="text-gray-400 text-center col-span-3">No completed projects available.</p>
    )}
  </div>

  {/* Buttons Below the Section */}
  <div className="mt-12 text-center space-x-6">
    <button
      onClick={goToProjectsPage}
      className="px-8 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold rounded-full shadow-md hover:from-green-600 hover:to-teal-600 transition transform hover:scale-105"
    >
      See More Projects
    </button>
    <button
      onClick={createEvents}
      className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-full shadow-md hover:from-purple-600 hover:to-pink-600 transition transform hover:scale-105"
    >
      Create Projects
    </button>
  </div>
</section>

{/* Upcoming University Events Section */}
<section className="py-16 bg-gray-900">
  {/* Event Heading */}
  <div className="w-full md:w-1/2 text-left mb-12">
    <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-500 to-purple-500">
      Upcoming University Events
    </h1>
  </div>

  {/* Event Cards */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
    {events.map((event, index) => (
      <div
        key={event.id}
        className={`relative p-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all overflow-hidden ${gradientStyles[index % gradientStyles.length]}`}
      >
        <div className="absolute inset-0 opacity-20 bg-cover bg-center"></div>
        <div className="relative z-10">
          <h2 className="text-xl font-semibold text-white mb-4">{event.title}</h2>
          <p className="text-gray-200 mb-2">Speaker: {event.speakerName}</p>
          <p className="text-gray-300 mb-4">
            Date: {new Date(event.eventDate).toLocaleDateString()} | Venue: {event.venue}
          </p>
        </div>
      </div>
    ))}
  </div>

  {/* Buttons */}
  <div className="flex justify-center space-x-6 mt-12">
    <button
      onClick={goToEventsPage}
      className="px-10 py-4 bg-green-400 text-white font-bold rounded-full shadow-lg hover:shadow-green-400/50 transition duration-300 ease-in-out transform hover:scale-105"
    >
      See More Events
    </button>
  </div>
</section>


      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 py-4 text-center rounded-lg shadow-lg mt-12">
        <p>&copy; 2024 BridgeIT. All rights reserved.</p>
        <p>&copy; Aesyem Institute Of Science & Technology</p>
      </footer>
    </div>
  );
};

export default StudentPage;
