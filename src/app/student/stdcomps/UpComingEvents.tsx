import React from 'react';

interface Event {
  id: string;
  title: string;
  speakerName: string;
  eventDate: string;
  venue: string;
}

interface UpcomingEventsProps {
  events: Event[];
  limit?: number;
}

const UpcomingEvents: React.FC<UpcomingEventsProps> = ({ events, limit }) => {
  const displayedEvents = limit ? events.slice(0, limit) : events;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {displayedEvents.length > 0 ? (
        displayedEvents.map((event) => {
          const formattedDate = new Date(event.eventDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });

          return (
            <div key={event.id} className="flex flex-col bg-gray-800 p-4 rounded-lg shadow">
              <p className="text-md font-bold text-green-500">Event Title: {event.title}</p>
              <p className="text-sm text-gray-300">Date: {formattedDate}</p>
              <p className="text-sm text-gray-400">Speaker: {event.speakerName}</p>
              <p className="text-sm text-gray-400">Venue: {event.venue}</p>
            </div>
          );
        })
      ) : (
        <p className="text-gray-400">No upcoming events.</p>
      )}
    </div>
  );
};

export default UpcomingEvents;
