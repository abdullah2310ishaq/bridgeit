"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import UpcomingEvents from '../stdcomps/UpComingEvents';

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
    <div className="min-h-screen bg-gray-600 text-white p-6">
      <h1 className="text-3xl font-bold text-center mb-6">All University Events</h1>
      <UpcomingEvents events={events} />
    </div>
  );
};

export default UniversityEventsPage;
