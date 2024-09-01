import React from 'react';

interface Event {
  id: string;
  title: string;
  speakerName: string;
  eventDate: string;
  venue: string;
}

interface FacultyEventsProps {
  events: Event[];
  limit?: number;
}

const FacultyEvents: React.FC<FacultyEventsProps> = ({ events, limit }) => {
  const displayedEvents = limit ? events.slice(0, limit) : events;

  return (
    <div className="p-6 mb-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-green-500 mb-6 text-center">Upcoming University Events</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedEvents.length > 0 ? (
          displayedEvents.map((event) => {
            const formattedDate = new Date(event.eventDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            });

            return (
              <div key={event.id} className="flex flex-col bg-gray-800 p-4 rounded-lg shadow-md">
                <p className="text-md font-bold text-gray-100">Event Title: {event.title}</p>
                <p className="text-sm text-gray-400">Date: {formattedDate}</p>
              </div>
            );
          })
        ) : (
          <p className="text-gray-500">No upcoming events.</p>
        )}
      </div>
    </div>
  );
};

export default FacultyEvents;
