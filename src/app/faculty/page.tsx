"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import FacultyProfile from './facultycomponents/FacultyProfile';
import UpcomingEvents from '../student/stdcomps/UpComingEvents';
import ResearchWork from './facultycomponents/ResearchWork';

interface FacultyProfile {
  userId: string;
  firstName: string;
  lastName: string;
  role: string;
  imageData: string;
}

interface Event {
  id: string;
  title: string;
  speakerName: string;
  eventDate: string;
  venue: string;
}

interface ResearchPaper {
  id: string;
  paperName: string;
  category: string;
  publishChannel: string;
  link: string;
  otherResearchers: string;
  yearOfPublish: number;
}

const FacultyPage: React.FC = () => {
  const [facultyProfile, setFacultyProfile] = useState<FacultyProfile | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [researchPapers, setResearchPapers] = useState<ResearchPaper[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchProfileAndData() {
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

        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          const userId = profileData.userId;

          const facultyResponse = await fetch(`https://localhost:7053/api/get-faculty/faculty-by-id/${userId}`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (facultyResponse.ok) {
            const facultyData = await facultyResponse.json();
            setFacultyProfile({
              userId: facultyData.userId,
              firstName: facultyData.firstName,
              lastName: facultyData.lastName,
              role: profileData.role,
              imageData: facultyData.imageData,
            });

            // Store facultyId locally
            const facultyId = facultyData.id;
            localStorage.setItem('facultyId', facultyId);

            // Fetch research papers using the faculty ID
            const researchResponse = await fetch(`https://localhost:7053/api/ResearchWork/get-researchwork-by-id/${facultyId}`, {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            if (researchResponse.ok) {
              const researchData = await researchResponse.json();
              setResearchPapers(researchData.slice(0, 2)); // Limit to 2 papers
            } else {
              console.error('Failed to fetch research papers');
            }

            // Fetch all events
            const eventsResponse = await fetch('https://localhost:7053/api/Events/get-events', {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            if (eventsResponse.ok) {
              const eventsData = await eventsResponse.json();
              setEvents(eventsData);
            } else {
              console.error('Failed to fetch events');
            }

          } else {
            console.error('Failed to fetch faculty profile:', facultyResponse.statusText);
            router.push('/unauthorized');
          }
        } else {
          router.push('/unauthorized');
        }
      } catch (error) {
        console.error('Failed to fetch profile or data:', error);
        router.push('/unauthorized');
      }
    }

    fetchProfileAndData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    router.push("/auth/login-user");
  };

  const goToEventsPage = () => {
    router.push("/faculty/events");
  };

  const goToResearchWorkPage = () => {
    router.push("/faculty/researchpaper"); // Assuming the page URL is /faculty/researchwork
  };

  const handleCreateResearchPaper = () => {
    router.push("/faculty/researchpaper/create");
  };

  const handleCreateEvent = () => {
    router.push("/faculty/events/create");
  };

  if (!facultyProfile) {
    return <div className="text-center text-gray-400">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 text-gray-900 p-6">
      {/* Navbar */}
      <nav className="bg-white shadow-md rounded-lg mb-6 p-4 flex justify-between items-center">
        <h1 className="text-2xl font-extrabold text-blue-700">Faculty Dashboard</h1>
        <div className="flex items-center space-x-4">
          <button onClick={handleLogout} className="hover:text-blue-500 transition-colors duration-300">
            Logout
          </button>
        </div>
      </nav>

      {/* Profile Section */}
      {facultyProfile && (
        <FacultyProfile
          facultyProfile={facultyProfile}
          onEditProfile={() => router.push('/faculty/profile/editfaculty')}
          onViewProfile={() => router.push('/faculty/profile')}
        />
      )}

      {/* Research Work Section */}
      <div className="mt-8">
        <ResearchWork papers={researchPapers} />
        <div className="flex justify-center space-x-4 mt-4">
          <button
            onClick={goToResearchWorkPage}
            className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 transition duration-200"
          >
            See More Research Work
          </button>
          <button
            onClick={handleCreateResearchPaper}
            className="py-2 px-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-500 transition duration-200"
          >
            Create Research Paper
          </button>
        </div>
      </div>

      {/* Upcoming Events Section */}
      <div className="mt-8">
        <UpcomingEvents events={events} limit={3} />
        <div className="flex justify-center space-x-4 mt-4">
          <button
            onClick={goToEventsPage}
            className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 transition duration-200"
          >
            See More Events
          </button>
          <button
            onClick={handleCreateEvent}
            className="py-2 px-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-500 transition duration-200"
          >
            Create Event
          </button>
        </div>
      </div>
    </div>
  );
};

export default FacultyPage;
