"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchProjects() {
      const token = localStorage.getItem('jwtToken');
      const response = await fetch('https://localhost:7053/api/get-student/projects', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      } else {
        router.push('/unauthorized');
      }
    }

    fetchProjects();
  }, [router]);

  if (projects.length === 0) {
    return <div>No projects available</div>;
  }

  return (
    <div className="projects-container">
      <h1>Your Projects</h1>
      <ul>
        {projects.map((project) => (
          <li key={project.id}>{project.name}</li>
        ))}
      </ul>
      {/* Add functionality to create, edit, delete projects */}
    </div>
  );
};

export default ProjectsPage;
