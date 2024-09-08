"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import IndustryProfile from './industrycomponents/IndustryProfile';
import ProjectCard from './industrycomponents/OpenCard';

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
  imageData: string;
  post: string;
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

  useEffect(() => {
    const fetchProfile = async () => {
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

        const expertResponse = await fetch(`https://localhost:7053/api/get-industry-expert/industry-expert-by-id/${userId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!expertResponse.ok) throw new Error('Failed to fetch industry expert profile');
        
        const expertData = await expertResponse.json();
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
          imageData: expertData.imageData,
          post: expertData.post,
        });

        // Fetch projects for the industry expert
        const projectsResponse = await fetch(`/api/projects/get-expert-projects-by-id/${expertData.indExptId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (projectsResponse.ok) {
          const projectsData = await projectsResponse.json();
          setProjects(projectsData);
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

    fetchProfile();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    router.push('/auth/login-user');
  };

  const goToProfile = () => {
    router.push('/industry-expert/profile');
  };

  const goToEditProfile = () => {
    router.push('/industry-expert/profile/editexpert');
  };

  const goToAddProjects = () => {
    router.push('/industry-expert/projects/add');
  };

  const goToProjects = () => {
    router.push('/industry-expert/projects');
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
    <div className="min-h-screen flex flex-col bg-gray-800 text-gray-200">
      {/* Navbar */}
      <nav className="bg-gray-700 text-gray-100 w-full p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Industry Expert Dashboard</h1>
          <ul className="flex space-x-6">
            <li>
              <button onClick={goToProfile} className="hover:text-gray-400">
                Profile
              </button>
            </li>
            <li>
              <button onClick={handleLogout} className="hover:text-gray-400">
                Logout
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Main Content */}
      <div className="p-6">
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
          onViewProjects={goToProjects}
          onEditProfile={goToEditProfile}
          onAddProjects={goToAddProjects}
        />

        {/* Projects Section */}
        <div className="p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Projects</h2>
          {projects.length === 0 ? (
            <p className="text-gray-400">No projects found</p>
          ) : (
            projects.map((project) => (
              <ProjectCard
                key={project.id}
                title={project.title}
                description={project.description}
                endDate={project.endDate}
                name={project.name}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default IndustryExpertPage;
