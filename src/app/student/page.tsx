"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProfileDropdown from "../components/ProfileDropdown";
import { motion } from "framer-motion";
import Loading from "../loading/page"; // Assuming you have a loading component

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
  const [projects, setProjects] = useState<Project[]>([]);
  const [ongoingProjects, setOngoingProjects] = useState<OngoingProject[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
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
              description: studentData.description || "Add your description by going to edit profile section."   ,
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
              setProjects(projectsData.slice(0, 3)); // Limit to 3 projects
            } else {
              setProjects([]);
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

  const gotoProfile = () => {
    router.push("/student/profile");
  };

  const goToProjectsPage = () => {
    router.push("/student/projects");
  };

  const createProjects = () => {
    router.push("/student/projects/create");
  };

  const goToEventsPage = () => {
    router.push("/student/events");
  };

  const gradientStyles = [
    'bg-gradient-to-r from-green-400 to-blue-500',
    'bg-gradient-to-r from-purple-400 to-pink-500',
    'bg-gradient-to-r from-yellow-400 to-red-500',
    'bg-gradient-to-r from-indigo-400 to-purple-600',
    'bg-gradient-to-r from-orange-400 to-pink-500',
  ];

  if (loading || !userProfile) {
    return <div className="text-center text-gray-400"><Loading /></div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 text-gray-300 p-6">
{/* Profile Section */}
<div
  className="relative flex flex-col md:flex-row items-center p-12 mb-8 rounded-xl"
  style={{
    backgroundImage: `url('data:image/jpeg;base64,${userProfile.uniImage}')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  }}
>
  {/* Overlay to Dim Background for Better Readability */}
  <div className="absolute inset-0 bg-black opacity-70"></div>  {/* Increased opacity for dimming effect */}

  {/* Profile Image */}
  <motion.div 
    initial={{ x: -100, opacity: 0 }} 
    animate={{ x: 0, opacity: 1 }} 
    transition={{ duration: 1 }}
    className="relative z-10 md:w-1/3 flex justify-center md:justify-start mb-8 md:mb-0"
  >
    <img src={`data:image/jpeg;base64,${userProfile.imageData}`} 
         alt={`${userProfile.firstName} ${userProfile.lastName}`} 
         className="w-64 h-64 rounded-lg object-cover shadow-2xl border-4 border-green-400" />
  </motion.div>

  {/* Profile Info */}
  <motion.div
    initial={{ x: 100, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ duration: 1 }}
    className="relative z-10 text-white flex-grow text-center md:text-left md:pl-10"
  >
    <h2 className="text-5xl font-bold text-green-400 leading-tight drop-shadow-lg">
      Welcome, {userProfile.firstName} {userProfile.lastName}
    </h2>
    
    <p className="text-lg mt-2">
      Roll Number: <span className="font-bold">{userProfile.rollNumber}</span>
    </p>

    {/* Description */}
    <div className="mt-4">
      <h3 className="text-xl font-semibold text-white">About Me:</h3>
      <p className="text-gray-300 mt-2">{userProfile.description}</p>
    </div>

    {/* Divider Line */}
    <div className="w-full h-1 bg-gradient-to-r from-green-400 to-blue-500 my-6"></div>

    {/* Buttons */}
    <div className="flex justify-center md:justify-start space-x-4">
      <button
        onClick={goToEditProfile}
        className="px-8 py-3 bg-blue-600 text-white font-bold rounded-full shadow-lg hover:bg-blue-500 hover:shadow-blue-500/50 transition duration-300 transform hover:scale-105"
      >
        Edit Profile
      </button>
      <button
        onClick={gotoProfile}
        className="px-8 py-3 bg-purple-600 text-white font-bold rounded-full shadow-lg hover:bg-purple-500 hover:shadow-purple-500/50 transition duration-300 transform hover:scale-105"
      >
        View Profile
      </button>
    </div>
  </motion.div>
</div>


      {/* Ongoing Projects */}
      <section className="py-16 bg-gradient-to-br from-gray-100 to-gray-300">
        <div className="relative max-w-7xl mx-auto mb-16 px-4 md:px-0">
          <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-500 to-purple-500">
            Ongoing Projects
          </h2>
        </div>

        {/* Ongoing Projects Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 px-4 md:px-12">
          {ongoingProjects.length > 0 ? (
            ongoingProjects.map((project) => (
              <motion.div
                key={project.id}
                whileHover={{ scale: 1.05 }}
                className="bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:scale-105"
              >
                <h3 className="text-2xl font-bold text-green-300 mb-4">{project.title}</h3>
                <p className="text-gray-400 mb-4">{project.description}</p>
                <p className="text-sm text-gray-400"><span className="font-bold">Expert:</span> {project.expertName}</p>
                <p className="text-sm text-gray-400"><span className="font-bold">Status:</span> {project.status}</p>
                <p className="text-sm text-gray-400"><span className="font-bold">End Date:</span> {project.endDate}</p>
                {/* Additional Actions or Info */}
              </motion.div>
            ))
          ) : (
            <p className="text-gray-400 text-center col-span-3">No ongoing projects available.</p>
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
            onClick={createProjects}
            className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-full shadow-md hover:from-purple-600 hover:to-pink-600 transition transform hover:scale-105"
          >
            Create Projects
          </button>
        </div>
      </section>

      {/* Completed Projects Section */}
      <section className="relative py-16 bg-gradient-to-br from-gray-100 to-gray-300 ">
        {/* Heading Section */}
        <div className="relative max-w-7xl mx-auto mb-16 px-4 md:px-0">
          <div className="text-left">
            <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-500 to-purple-500">
              Completed Projects
            </h2>
          </div>
        </div>

        {/* Project Boxes Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 px-4 md:px-12">
          {projects.length > 0 ? (
            projects.map((project) => (
              <motion.div
                key={project.id}
                whileHover={{ scale: 1.05 }}
                className="bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:scale-105"
              >
                {/* Project Title */}
                <h3 className="text-2xl font-bold text-green-300 mb-4">{project.title}</h3>
                
                {/* Project Description */}
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
            onClick={createProjects}
            className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-full shadow-md hover:from-purple-600 hover:to-pink-600 transition transform hover:scale-105"
          >
            Create Projects
          </button>
        </div>
      </section>

      {/* Upcoming University Events Section */}
      <section className="py-16 bg-gradient-to-br from-gray-100 to-gray-300 color scheme">
        {/* Event Heading */}
        <div className="relative max-w-7xl mx-auto mb-16 px-4 md:px-0">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-500 to-purple-500">
            Upcoming University Events
          </h1>
        </div>

        {/* Event Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 px-4 md:px-12">
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
