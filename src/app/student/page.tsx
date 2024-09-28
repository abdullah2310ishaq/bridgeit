"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import ProfileDropdown from "../components/ProfileDropdown";

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

interface Project {
  id: string;
  title: string;
  description: string;
}

interface Event {
  id: string;
  title: string;
  speakerName: string;
  eventDate: string;
  venue: string;
}

const StudentPage: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
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

            const projectsResponse = await fetch(`https://localhost:7053/api/projects/get-student-projects-by-id/${studentData.id}`, {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            if (projectsResponse.ok) {
              const projectsData = await projectsResponse.json();
              setProjects(projectsData.slice(0, 3));
            }

            const eventsResponse = await fetch("https://localhost:7053/api/Events/get-events", {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            if (eventsResponse.ok) {
              const eventsData = await eventsResponse.json();
              setEvents(eventsData);
            }
          }
        }
      } catch (error) {
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

  const goToProjectsPage = () => {
    router.push("/student/projects");
  };

  const goToEventsPage = () => {
    router.push("/student/events");
  };

  if (!userProfile) {
    return <div className="text-center text-gray-400">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-bl from-green-100 via-white to-blue-100">
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 p-6 shadow-lg rounded-b-lg flex justify-between items-center">
        <motion.h1
          className="text-4xl font-extrabold text-white tracking-wider"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Student Dashboard
        </motion.h1>
        <div className="flex space-x-8">
          <motion.button
            onClick={handleLogout}
            className="text-white font-semibold hover:text-red-400 transition duration-300"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            Logout
          </motion.button>
          <ProfileDropdown userProfile={userProfile} onLogout={handleLogout} />
        </div>
      </nav>

      {/* Hero Section */}
      <motion.section
        className="bg-white shadow-lg rounded-xl p-10 mt-8 mx-6 lg:mx-auto max-w-7xl flex flex-col lg:flex-row items-center justify-between"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <div className="lg:w-1/2 space-y-6 text-center lg:text-left">
          <h2 className="text-5xl font-bold tracking-wider leading-tight text-purple-600">
            Welcome, {userProfile.firstName} {userProfile.lastName}
          </h2>
          <p className="text-xl text-gray-700">
            {userProfile.universityName} <br /> Roll Number: {userProfile.rollNumber}
          </p>
          <div className="space-x-4 mt-6">
            <motion.button
              onClick={goToEditProfile}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full text-lg font-bold text-white hover:shadow-lg transition-transform transform hover:scale-105"
              whileHover={{ scale: 1.05 }}
            >
              Edit Profile
            </motion.button>
            <motion.button
              onClick={() => router.push("/student/profile")}
              className="px-8 py-4 bg-gradient-to-r from-green-400 to-blue-400 rounded-full text-lg font-bold text-white hover:shadow-lg transition-transform transform hover:scale-105"
              whileHover={{ scale: 1.05 }}
            >
              View Profile
            </motion.button>
          </div>
        </div>
        <div className="lg:w-1/2 mt-8 lg:mt-0 flex justify-center">
          <motion.img
            src={`data:image/jpeg;base64,${userProfile.imageData}`}
            alt={`${userProfile.firstName} ${userProfile.lastName}`}
            className="w-64 h-64 rounded-full object-cover shadow-2xl"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, duration: 0.7 }}
          />
        </div>
      </motion.section>

      {/* Projects Section */}
      <section className="py-16 px-6">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          <h2 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-500">
            Your Projects
          </h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
        >
          {projects.length > 0 ? (
            projects.map((project) => (
              <motion.div
                key={project.id}
                className="bg-gradient-to-r from-pink-300 via-purple-400 to-blue-500 rounded-2xl p-8 shadow-xl hover:shadow-2xl transform hover:scale-105 transition duration-300"
                whileHover={{ scale: 1.05 }}
              >
                <h3 className="text-3xl font-bold text-white mb-4">{project.title}</h3>
                <p className="text-gray-100">{project.description}</p>
                <div className="mt-4 text-right">
                  <button
                    onClick={goToProjectsPage}
                    className="text-white hover:underline font-semibold"
                  >
                    View Details
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-gray-400">No projects found.</p>
          )}
        </motion.div>
      </section>

      {/* Events Section */}
      <section className="py-16 px-6 bg-gradient-to-br from-yellow-300 to-orange-400 text-white">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
        >
          <h2 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-red-500">
            Upcoming Events
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <motion.div
              key={event.id}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:scale-105"
              whileHover={{ scale: 1.05 }}
            >
              <h3 className="text-xl font-semibold text-yellow-500 mb-4">{event.title}</h3>
              <p className="text-gray-800 mb-2">Speaker: {event.speakerName}</p>
              <p className="text-gray-600">
                Date: {new Date(event.eventDate).toLocaleDateString()}
              </p>
              <p className="text-gray-600">Venue: {event.venue}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gradient-to-r from-indigo-600 to-blue-500 text-white text-center">
        <p>&copy; 2024 BridgeIT. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default StudentPage;
