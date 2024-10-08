import React from 'react';

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

      {/* Event Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map((event, index) => (
          <div
            key={event.id}
            className={`relative p-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all overflow-hidden ${
              gradientStyles[index % gradientStyles.length]
            }`}
          >
            <div className="absolute inset-0 opacity-20 bg-cover bg-center"></div>
            <div className="relative z-10">
              <h2 className="text-xl font-semibold text-white mb-4">{event.title}</h2>
              <p className="text-gray-200 mb-2">Speaker: {event.speakerName}</p>
              <p className="text-gray-300 mb-4">
                Date: {new Date(event.eventDate).toLocaleDateString()} | Venue: {event.venue}
              </p>
              <a href="#" className="text-white font-semibold hover:underline">
                Learn More
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex justify-center space-x-6 mt-8">
        <button
          onClick={onSeeMoreEvents}
          className="px-10 py-4 bg-green-400 text-white font-bold rounded-full shadow-lg hover:shadow-green-400/50 transition duration-300 ease-in-out transform hover:scale-105"
        >
          See More Events
        </button>
        <button
          onClick={onCreateEvent}
          className="px-10 py-4 bg-green-400 text-white font-bold rounded-full shadow-lg hover:shadow-green-400/50 transition duration-300 ease-in-out transform hover:scale-105"
        >
          Create Event
        </button>
      </div>
    </div>
  );
};

export default UpcomingEventsSection;
