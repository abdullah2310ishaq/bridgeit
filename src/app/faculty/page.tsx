"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import FacultyProfile from './facultycomponents/FacultyProfile';
import ResearchWork from './facultycomponents/ResearchWork';
import FacultyEvents from './facultycomponents/FacultyEvents';

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

            const facultyId = facultyData.id;

            // Fetch research papers using the faculty ID
            const researchResponse = await fetch(`https://localhost:7053/api/ResearchWork/get-researchwork-by-id/${facultyId}`, {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            if (researchResponse.ok) {
              const researchData = await researchResponse.json();
              setResearchPapers(researchData.slice(0, 3)); 
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
            }
          } else {
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

  const handleCreateEvent = () => {
    router.push("/faculty/events/create");
  };

  const gradientStyles = [
    'bg-gradient-to-r from-green-400 to-blue-500',
    'bg-gradient-to-r from-purple-400 to-pink-500',
    'bg-gradient-to-r from-yellow-400 to-red-500',
    'bg-gradient-to-r from-indigo-400 to-purple-600',
    'bg-gradient-to-r from-orange-400 to-pink-500',
  ];

  if (!facultyProfile) {
    return <div className="text-center text-gray-400">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
    

      {/* Profile Section */}
      {facultyProfile && (
        <div className="relative flex flex-col md:flex-row justify-between items-center bg-gray-800 bg-opacity-80 p-12 rounded-2xl shadow-2xl mb-8 overflow-hidden"
          style={{ backgroundImage: "url('/Air_University_BCKG.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '600px' }}>
          <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm"></div>

          <div className="relative z-10 md:w-1/2 flex flex-col space-y-8 text-left text-white">
            <h1 className="text-6xl font-bold text-green-400 leading-tight drop-shadow-2xl">Welcome, {facultyProfile.firstName} {facultyProfile.lastName}</h1>
            <p className="text-lg text-gray-300 tracking-wide italic">{facultyProfile.role}</p>
            <div className="flex space-x-8 mt-4">
              <div className="text-center">
                <h3 className="text-gray-300 uppercase tracking-wider text-sm">Projects</h3>
                <p className="text-5xl font-extrabold text-white drop-shadow-lg">12</p>
              </div>
              <div className="text-center">
                <h3 className="text-gray-300 uppercase tracking-wider text-sm">Experience</h3>
                <p className="text-5xl font-extrabold text-white drop-shadow-lg">8 yrs</p>
              </div>
              <div className="text-center">
                <h3 className="text-gray-300 uppercase tracking-wider text-sm">Nationality</h3>
                <p className="text-5xl font-extrabold text-white drop-shadow-lg">IDN 🇮🇩</p>
              </div>
            </div>
            <div className="flex space-x-6 mt-10">
              <button onClick={() => router.push('/faculty/profile')} className="px-10 py-4 bg-blue-500 text-white font-bold rounded-full shadow-lg hover:shadow-blue-500/50 transition duration-300 transform hover:scale-105">View Profile</button>
              <button onClick={() => router.push('/faculty/profile/editfaculty')} className="px-10 py-4 bg-purple-500 text-white font-bold rounded-full shadow-lg hover:shadow-purple-500/50 transition duration-300 transform hover:scale-105">Edit Profile</button>
            </div>
          </div>

          {/* Profile Image */}
          <div className="relative z-10 mt-6 md:mt-0 md:w-1/2 flex justify-center">
            <img src={`data:image/jpeg;base64,${facultyProfile.imageData}`} alt={`${facultyProfile.firstName} ${facultyProfile.lastName}`} className="w-80 h-80 rounded-full border-4 border-green-300 object-cover shadow-2xl transform hover:scale-110 transition duration-300" />
          </div>
        </div>
      )}

      {/* Research Work Section */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-gray-900 p-12 rounded-lg shadow-2xl mb-12 overflow-hidden mt-16 relative">
        <div className="md:w-1/2 space-y-6 text-left text-white relative z-10">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">Explore Cutting-Edge Research</h1>
          <p className="text-xl text-gray-300">Our dedicated faculty members contribute groundbreaking research across various fields. Dive into the innovation that's shaping the future.</p>
          <div className="flex space-x-6 mt-8">
            <button onClick={goToEventsPage} className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold rounded-full shadow-lg hover:from-green-600 hover:to-blue-600 transition transform hover:scale-105">See More Research</button>
            <button onClick={handleCreateEvent} className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-full shadow-lg hover:from-purple-600 hover:to-pink-600 transition transform hover:scale-105">Create Research Paper</button>
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center mt-8 md:mt-0 relative z-10">
          <img src="/Research-Work.png" alt="Research Work" className="w-full max-w-lg object-cover rounded-lg shadow-2xl transform hover:scale-105 transition" />
        </div>
      </div>

      {/* Research Work Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 px-4 md:px-12">
        {researchPapers.map(paper => (
          <div key={paper.id} className="bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:scale-105">
            <h3 className="text-2xl font-semibold text-green-400">{paper.paperName}</h3>
            <p className="text-gray-400 mt-4">Published in: {paper.publishChannel}</p>
            <p className="text-gray-500 mt-2">Year: {paper.yearOfPublish}</p>
            <a href={paper.link} target="_blank" className="text-blue-400 mt-6 inline-block font-semibold hover:text-blue-500">Read Full Paper</a>
          </div>
        ))}
      </div>

      {/* Upcoming Events Section */}
      <div className="mt-16 bg-gray-900 p-12 rounded-lg shadow-2xl">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12">
          {/* Calendar Image */}
          <div className="relative w-full md:w-1/2 flex justify-center mb-8 md:mb-0">
            <img src="/calender.png" alt="Calendar" className="w-64 h-auto transform rotate-6 opacity-90" />
          </div>

          {/* Left-Aligned Text */}
          <div className="w-full md:w-1/2 text-left">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
              Upcoming University Events
            </h1>
            <p className="text-lg text-gray-300 mb-8">
              Stay up to date with the latest events happening at the university. Don’t miss out on seminars, workshops, and more!
            </p>
          </div>
        </div>

        {/* Event Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <div key={event.id} className={`relative p-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all overflow-hidden ${gradientStyles[index % gradientStyles.length]}`}>
              <div className="absolute inset-0 opacity-20 bg-cover bg-center"></div>
              <div className="relative z-10">
                <h2 className="text-xl font-semibold text-white mb-4">{event.title}</h2>
                <p className="text-gray-200 mb-2">Speaker: {event.speakerName}</p>
                <p className="text-gray-300 mb-4">Date: {new Date(event.eventDate).toLocaleDateString()} | Venue: {event.venue}</p>
                <a href="#" className="text-white font-semibold hover:underline">Learn More</a>
              </div>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex justify-center space-x-6 mt-8">
          <button onClick={goToEventsPage} className="px-10 py-4 bg-green-400 text-white font-bold rounded-full shadow-lg hover:shadow-green-400/50 transition duration-300 ease-in-out transform hover:scale-105">See More Events</button>
          <button onClick={handleCreateEvent} className="px-10 py-4 bg-green-400 text-white font-bold rounded-full shadow-lg hover:shadow-green-400/50 transition duration-300 ease-in-out transform hover:scale-105">Create Event</button>
        </div>
      </div>
    </div>
  );
};

export default FacultyPage;
