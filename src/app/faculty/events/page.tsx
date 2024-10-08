"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, User, MapPin } from "lucide-react"
import FacultyEvents from '../facultycomponents/FacultyEvents';


const UniversityEventsPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const router = useRouter();


  interface Event {
    id: string;
    title: string;
    speakerName: string;
    eventDate: string;
    venue: string;
  }
  
  useEffect(() => {
    async function fetchEvents() {
      const token = localStorage.getItem('jwtToken'); // Get the JWT token from localStorage
      if (!token) {
        router.push('/auth/login-user'); // Redirect to login if token is not available
        return;
      }

      try {
        const response = await fetch('https://localhost:7053/api/Events/get-events', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
          },
        });

        if (response.ok) {
          const data = await response.json();
          setEvents(data);
        } else {
          console.error('Failed to fetch events');
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    }

    fetchEvents();
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 p-6">
    <h1 className="text-4xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
      All University Events
    </h1>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {events.map((event, index) => (
        <div
          key={event.id}
          className={"relative p-6 rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden bg-gradient-to-br"}
        >
          <div className="absolute inset-0 bg-gray-900 opacity-50"></div>
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-white mb-4">{event.title}</h2>
            <div className="space-y-3">
              <p className="text-gray-200 flex items-center">
                <User className="w-5 h-5 mr-2 text-gray-300" />
                <span className="font-semibold mr-2">Speaker:</span> {event.speakerName}
              </p>
              <p className="text-gray-200 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-gray-300" />
                <span className="font-semibold mr-2">Date:</span>{" "}
                {new Date(event.eventDate).toLocaleDateString()}
              </p>
              <p className="text-gray-200 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-gray-300" />
                <span className="font-semibold mr-2">Venue:</span> {event.venue}
              </p>
            </div>
          </div>
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white bg-opacity-20 rounded-full blur-xl"></div>
          <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-white bg-opacity-20 rounded-full blur-xl"></div>
        </div>
      ))}
    </div>
  </div>
  );
};

export default UniversityEventsPage;
