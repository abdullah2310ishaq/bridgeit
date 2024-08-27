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
    <div className="bg-white p-6 mb-6 rounded-lg shadow-lg max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">Upcoming University Events</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayedEvents.length > 0 ? (
          displayedEvents.map((event) => {
            const formattedDate = new Date(event.eventDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            });

            return (
              <div key={event.id} className="flex flex-col bg-blue-50 p-4 rounded-lg shadow">
                <p className="text-md font-bold text-gray-700">Event Title: {event.title}</p>
                <p className="text-sm text-gray-600">Speaker: {event.speakerName}</p>
                <p className="text-sm text-gray-600">Date: {formattedDate}</p>
                <p className="text-sm text-gray-600">Venue: {event.venue}</p>
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
