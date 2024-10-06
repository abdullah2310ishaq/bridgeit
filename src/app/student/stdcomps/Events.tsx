"use client";
import React from "react";

interface Event {
  id: string;
  title: string;
  speakerName: string;
  eventDate: string;
  venue: string;
}

interface Props {
  events: Event[];
  gradientStyles: string[];
  goToEventsPage: () => void;
}

const EventsSection: React.FC<Props> = ({ events, gradientStyles, goToEventsPage }) => {
  return (
    <section className="py-16 bg-gradient-to-br from-gray-100 to-gray-300">
      {/* Event Heading */}
      <div className="relative max-w-7xl mx-auto mb-16 px-4 md:px-0">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-500 to-purple-500">
          Upcoming University Events
        </h1>
      </div>

      {/* Event Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 px-4 md:px-12">
        {events.map((event, index) => (
          <div
            key={event.id}
            className={`relative p-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all overflow-hidden ${gradientStyles[index % gradientStyles.length]}`}
          >
            <div className="absolute inset-0 opacity-20 bg-cover bg-center"></div>
            <div className="relative z-10">
              <h2 className="text-xl font-semibold text-white mb-4">{event.title}</h2>
              <p className="text-gray-200 mb-2">Speaker: {event.speakerName}</p>
              <p className="text-gray-300 mb-4">
                Date: {new Date(event.eventDate).toLocaleDateString()} | Venue: {event.venue}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex justify-center space-x-6 mt-12">
        <button
          onClick={goToEventsPage}
          className="px-10 py-4 bg-green-400 text-white font-bold rounded-full shadow-lg hover:shadow-green-400/50 transition duration-300 ease-in-out transform hover:scale-105"
        >
          See More Events
        </button>
      </div>
    </section>
  );
};

export default EventsSection;
