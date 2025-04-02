"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, User, Eye } from "lucide-react";

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
}

const EventsSection: React.FC<Props> = ({ events, gradientStyles }) => {
  const [showAllEvents, setShowAllEvents] = useState(false);

  const toggleAllEvents = () => setShowAllEvents(!showAllEvents);

  return (
    <section className="py-16 bg-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-blue-500">
          Upcoming University Events
        </h2>
      </div>

      {/* Event Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 sm:px-6 lg:px-8">
        {(showAllEvents ? events : events.slice(0, 3)).map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`relative p-6 rounded-xl shadow-md hover:shadow-xl transition-transform transform hover:scale-[1.02] overflow-hidden ${
              gradientStyles[index % gradientStyles.length]
            }`}
          >
            <div className="absolute inset-0 bg-white opacity-10 z-0" />
            <div className="relative z-10 flex flex-col h-full text-white">
              <h3 className="text-xl font-bold mb-3">{event.title}</h3>
              <div className="flex items-center text-sm mb-2">
                <User className="w-4 h-4 mr-2" />
                <span>Speaker: {event.speakerName}</span>
              </div>
              <div className="flex items-center text-sm mb-2">
                <Calendar className="w-4 h-4 mr-2" />
                <span>
                  Date: {new Date(event.eventDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center text-sm">
                <MapPin className="w-4 h-4 mr-2" />
                <span>Venue: {event.venue}</span>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-20 h-20 bg-white bg-opacity-10 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-white bg-opacity-10 rounded-full blur-2xl" />
          </motion.div>
        ))}
      </div>

      {/* Fallback */}
      {events.length === 0 && (
        <div className="mt-8 text-center text-gray-500">No upcoming events</div>
      )}

      {/* Button */}
      {events.length > 3 && (
        <div className="mt-12 flex justify-center">
          <button
            onClick={toggleAllEvents}
            className="group px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-full shadow-md hover:shadow-lg transition transform hover:-translate-y-1"
          >
            <span className="flex items-center justify-center">
              <Eye className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              {showAllEvents ? "Show Less" : "See More Events"}
            </span>
          </button>
        </div>
      )}
    </section>
  );
};

export default EventsSection;
