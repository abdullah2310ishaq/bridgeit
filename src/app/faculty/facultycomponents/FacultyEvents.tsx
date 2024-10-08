import React from 'react';
import { motion } from "framer-motion";
import { Calendar, MapPin, User, Eye, Edit } from "lucide-react";

interface Event {
  id: string;
  title: string;
  speakerName: string;
  eventDate: string;
  venue: string;
}

interface UpcomingEventsSectionProps {
  events: Event[];
  onSeeMoreEvents: () => void;
  onCreateEvent: () => void;
}

const UpcomingEventsSection: React.FC<UpcomingEventsSectionProps> = ({
  events,
  onSeeMoreEvents,
  onCreateEvent,
}) => {
  const gradientStyles = [
    'bg-gradient-to-r from-green-400 to-blue-500',
    'bg-gradient-to-r from-purple-400 to-pink-500',
    'bg-gradient-to-r from-yellow-400 to-red-500',
    'bg-gradient-to-r from-indigo-400 to-purple-600',
    'bg-gradient-to-r from-orange-400 to-pink-500',
  ];

  return (
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
            Stay up to date with the latest events happening at the university. Don’t miss out on seminars,
            workshops, and more!
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {events.map((event, index) => (
    <motion.div
      key={event.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`relative p-6 rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden ${
        gradientStyles[index % gradientStyles.length]
      }`}
    >
      <div className="absolute inset-0 bg-black opacity-10 z-0"></div>
      <div className="relative z-10 flex flex-col h-full">
        <h2 className="text-2xl font-bold text-white mb-4 tracking-tight">
          {event.title}
        </h2>

        <div className="flex items-center text-white mb-2">
          <User className="w-4 h-4 mr-2" />
          <p className="text-sm">Speaker: {event.speakerName}</p>
        </div>

        <div className="flex items-center text-white mb-2">
          <Calendar className="w-4 h-4 mr-2" />
          <p className="text-sm">
            Date: {new Date(event.eventDate).toLocaleDateString()}
          </p>
        </div>

        <div className="flex items-center text-white">
          <MapPin className="w-4 h-4 mr-2" />
          <p className="text-sm">Venue: {event.venue}</p>
        </div>
      </div>

      {/* Blurred Decorative Circles */}
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white bg-opacity-10 rounded-full blur-xl"></div>
      <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-white bg-opacity-10 rounded-full blur-xl"></div>
    </motion.div>
  ))}
</div>


      {/* Buttons */}
      <div className="flex justify-center space-x-6 mt-8">
        <button
          onClick={onSeeMoreEvents}
          className="group px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-800 text-white font-medium rounded-full shadow-lg hover:shadow-gray-600/50 transition duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
      >
        <span className="flex items-center justify-center">
          <Edit className="w-5 h-5 mr-2 transform group-hover:scale-110 transition-transform duration-300" />
          Create Events
        </span>
        </button>
        <button
          onClick={onCreateEvent}
          className="group px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-800 text-white font-medium rounded-full shadow-lg hover:shadow-gray-600/50 transition duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
      >
        <span className="flex items-center justify-center">
          <Eye className="w-5 h-5 mr-2 transform group-hover:scale-110 transition-transform duration-300" />
          See More Events
        </span>
        </button>
      </div>
    </div>
  );
};

export default UpcomingEventsSection;
