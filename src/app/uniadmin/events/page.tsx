"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";

interface Event {
  id: string;
  title: string;
  speakerName: string;
  eventDate: string;
  venue: string;
}

const UniversityEventsPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [activeTab, setActiveTab] = useState<"past" | "upcoming">(
    "upcoming"
  );
  const router = useRouter();

  useEffect(() => {
    async function fetchEvents() {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        router.push("/auth/login-user");
        return;
      }

      try {
        const response = await fetch(
          "https://localhost:7053/api/Events/get-events",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setEvents(data);
        } else {
          console.error("Failed to fetch events");
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    }

    fetchEvents();
  }, [router]);

  const currentDate = new Date();

  // Categorize events
  const pastEvents = events.filter(
    (event) => new Date(event.eventDate) < currentDate
  );
  const upcomingEvents = events.filter(
    (event) => new Date(event.eventDate) > currentDate
  );
  const currentEvents = events.filter(
    (event) =>
      new Date(event.eventDate).toDateString() === currentDate.toDateString()
  );

  const getFilteredEvents = () => {
    switch (activeTab) {
      case "past":
        return pastEvents;
      
      case "upcoming":
        return upcomingEvents;
      default:
        return [];
    }
  };

  const filteredEvents = getFilteredEvents();

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      {/* Title Section */}
      <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-center mb-10">
        University Events
      </h1>

      {/* Tab Switcher */}
      <div className="flex justify-center space-x-4 mb-8">
        <button
          onClick={() => setActiveTab("upcoming")}
          className={`px-6 py-2 text-lg rounded-full ${
            activeTab === "upcoming"
              ? "bg-blue-500 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          Upcoming Events
        </button>
      
        <button
          onClick={() => setActiveTab("past")}
          className={`px-6 py-2 text-lg rounded-full ${
            activeTab === "past"
              ? "bg-red-500 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          Past Events
        </button>
      </div>

      {/* Event Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <div
              key={event.id}
              className="bg-gray-800/80 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
            >
              {/* Event Title */}
              <h2 className="text-2xl font-semibold text-white mb-2">
                {event.title}
              </h2>

              {/* Speaker Name */}
              <p className="text-lg text-gray-400 mb-4">
                <span className="font-bold">Speaker:</span> {event.speakerName}
              </p>

              {/* Event Date and Venue */}
              <div className="flex flex-col gap-2 mb-4">
                {/* Event Date */}
                <div className="flex items-center text-gray-300">
                  <FaCalendarAlt className="mr-2 text-blue-500" />
                  <p className="text-sm">
                    <span className="font-bold">Date:</span>{" "}
                    {new Date(event.eventDate).toLocaleDateString()}
                  </p>
                </div>

                {/* Event Venue */}
                <div className="flex items-center text-gray-300">
                  <FaMapMarkerAlt className="mr-2 text-red-500" />
                  <p className="text-sm">
                    <span className="font-bold">Venue:</span> {event.venue}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-xl font-semibold text-gray-400">
            No {activeTab} events available at the moment.
          </p>
        )}
      </div>
    </div>
  );
};

export default UniversityEventsPage;
