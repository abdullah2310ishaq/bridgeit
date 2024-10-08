"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import IndustryProfile from '../industryexpert/industrycomponents/IndustryProfile';
import ProjectCard from '../industryexpert/industrycomponents/ProjectsCardd';
import CompanyProfile from '../industryexpert/industrycomponents/CompanyProfile';

interface IndustryExpertProfile {
  userId: string;
  indExptId: string;
  companyId: string;
  firstName: string;
  lastName: string;
  email: string;
  companyName: string;
  address: string;
  contact: string;
  imageData: string; // Base64 string
}

interface Project {
  id: string;
  title: string;
  description: string;
  endDate: string;
  name: string;
}

const IndustryExpertPage: React.FC = () => {
  const [expertProfile, setExpertProfile] = useState<IndustryExpertProfile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Helper function to convert byte array to Base64 string
  const arrayBufferToBase64 = (buffer: number[]): string => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  useEffect(() => {
    const fetchProfileAndProjects = async () => {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        router.push('/auth/login-user');
        return;
      }

      try {
        const profileResponse = await fetch('https://localhost:7053/api/auth/authorized-user-info', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!profileResponse.ok) throw new Error('Failed to fetch profile');

        const profileData = await profileResponse.json();
        const userId = profileData.userId;

        // Fetch industry expert profile
        const expertResponse = await fetch(`https://localhost:7053/api/get-industry-expert/industry-expert-by-id/${userId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!expertResponse.ok) throw new Error('Failed to fetch industry expert profile');
        
        const expertData = await expertResponse.json();

        // Convert image data from byte array to Base64 string
        const imageDataBase64 = expertData.imageData && expertData.imageData.length > 0
          ? arrayBufferToBase64(expertData.imageData)
          : '';

        setExpertProfile({
          userId: expertData.userId,
          indExptId: expertData.indExptId,
          companyId: expertData.companyId,
          firstName: expertData.firstName,
          lastName: expertData.lastName,
          email: expertData.email,
          companyName: expertData.companyName,
          address: expertData.address,
          contact: expertData.contact,
          imageData: imageDataBase64,
        });

        // Fetch projects for the industry expert
        const projectsResponse = await fetch(`https://localhost:7053/api/projects/get-expert-projects-by-id/${expertData.indExptId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (projectsResponse.ok) {
          const projectsData = await projectsResponse.json();
          setProjects(projectsData); // Save the projects
        } else {
          console.error('Failed to fetch projects:', projectsResponse.statusText);
        }
      } catch (error) {
        setError('Failed to fetch data');
        console.error('Failed to fetch data:', error);
        router.push('/unauthorized');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndProjects();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    router.push('/auth/login-user');
  };

  // Handler functions
  const onViewProjects = () => {
    router.push('/industryexpert/projects');
  };

  const onEditProfile = () => {
    router.push('/industryexpert/profile/edit');
  };

  const onAddProjects = () => {
    router.push('/industryexpert/projects/create');
  };

  if (loading) {
    return <div className="text-center text-gray-400">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!expertProfile) {
    return <div className="text-center text-gray-400">No profile found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* Navbar */}
      <nav className="bg-white p-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-700">Industry Expert Dashboard</h1>
          <ul className="flex space-x-6">
            <li>
              <button 
                onClick={() => router.push("/industryexpert/notifications")} 
                className="text-gray-500 hover:text-blue-600 transition"
              >
                Notifications
              </button>
            </li>
            <li>
              <button onClick={handleLogout} className="text-gray-500 hover:text-red-600 transition">
                Logout
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto p-6 space-y-8">
        {/* Industry Expert Profile Section */}
        <IndustryProfile
  companyLogo={expertProfile.imageData}
  companyName={expertProfile.companyName}
  userId={expertProfile.userId}
  indExptId={expertProfile.indExptId}
  companyId={expertProfile.companyId}
  firstName={expertProfile.firstName}
  lastName={expertProfile.lastName}
  email={expertProfile.email}
  address={expertProfile.address}
  contact={expertProfile.contact}
  onViewProjects={onViewProjects}
  onEditProfile={onEditProfile}
  onAddProjects={onAddProjects}
/>



        {/* Company Profile Section */}
        <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-pink-500 mb-6">
          Industry Information
        </h2>
        <CompanyProfile
          companyName={expertProfile.companyName}
          address={expertProfile.address}
          contact={expertProfile.contact}
          onEditCompany={() => {}}
        />

        {/* Projects Section */}
        <div>
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-6">Projects</h2>
          {projects.length === 0 ? (
            <p className="text-gray-500">No projects found</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  title={project.title}
                  description={project.description}
                  endDate={project.endDate}
                  name={project.name}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IndustryExpertPage;
