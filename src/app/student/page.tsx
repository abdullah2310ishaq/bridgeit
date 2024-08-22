"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProfileDropdown from "../components/ProfileDropdown";
import LogoutButton from "../components/Logout";
import ProjectCard from "../components/CompletedProjects";

interface UserProfile {
  userId: string;
  firstName: string;
  lastName: string;
  role: string;
  email: string;
  universityName: string;
  address: string;
  rollNumber: string;
  imageData: string; // Base64 image data
}

interface Project {
  id: string;
  title: string;
  description: string;
}

const StudentPage: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-200 p-6">
      {/* Navbar */}
      <nav className="bg-gray-800 p-4 shadow-lg rounded-lg mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-extrabold text-green-400">Student Dashboard</h1>

        <div className="flex items-center space-x-4">
          <button onClick={handleLogout} className="hover:text-red-400 transition-colors duration-300">
            Logout
          </button>
          <ProfileDropdown userProfile={userProfile} onLogout={handleLogout} />
        </div>
      </nav>

      {/* Profile Section */}
      <div className="relative bg-cover bg-center rounded-lg p-6" style={{ backgroundImage: `url('/studenttop.jpg')`, height: "300px" }}>
        <div className="absolute inset-0 bg-black opacity-50 rounded-lg"></div>
        <div className="relative flex items-center h-full">
          <div className="mr-6">
            <img
              src={`data:image/jpeg;base64,${userProfile.imageData}`}
              alt={`${userProfile.firstName} ${userProfile.lastName}`}
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
            />
          </div>
          <div className="text-center text-white flex-grow">
            <h2 className="text-3xl font-bold mb-2">
              {userProfile.firstName} {userProfile.lastName}
            </h2>
            <p className="text-lg">Role: {userProfile.role}</p>
            <p className="text-lg">User ID: {userProfile.userId}</p>
            <p className="text-lg">Email: {userProfile.email}</p>
            <p className="text-lg">University: {userProfile.universityName}</p>
            <p className="text-lg">Address: {userProfile.address}</p>
            <p className="text-lg">Roll Number: {userProfile.rollNumber}</p>
            <div className="mt-4 space-x-4">
              <button onClick={goToEditProfile} className="py-2 px-4 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-500 transition duration-200">
                Edit Profile
              </button>
              <button onClick={gotoProfile} className="py-2 px-4 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-500 transition duration-200">
                View Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Completed Projects Section */}
      <div className="mt-10 flex flex-col items-center px-6">
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full">
    {projects.map((project) => (
      <ProjectCard
        key={project.id}
        title={project.title}
        description={project.description}
      />
    ))}
  </div>
  <div className="mt-8">
    <button onClick={goToProjectsPage} className="py-3 px-6 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-500 transition duration-200">
      See More Projects
    </button>
  </div>
</div>


      {/* Footer */}
      <footer className="bg-gray-900 p-4 text-center text-gray-500 mt-6 rounded-lg">
        <p>&copy; 2024 BridgeIT. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default StudentPage;
