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
      <div className="max-w-7xl mx-auto mb-16 px-4 md:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-700">
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
            {/* Original Card Color Preserved */}
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
      <div className="mt-12 flex justify-center space-x-6">
        <button
          onClick={goToEventsPage}
          className="px-10 py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-medium rounded-full shadow-md hover:from-gray-700 hover:to-gray-800 transition-transform"
        >
          See More Events
        </button>
      </div>
    </section>
  );
};

export default EventsSection;
