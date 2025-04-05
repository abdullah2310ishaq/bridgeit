"use client"
import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Calendar, MapPin, User, Eye } from "lucide-react"

interface Event {
  id: string
  title: string
  speakerName: string
  eventDate: string
  venue: string
}

interface Props {
  events: Event[]
  gradientStyles: string[]
}

const EventsSection: React.FC<Props> = ({ events, gradientStyles }) => {
  const [showAllEvents, setShowAllEvents] = useState(false)

  // Toggle the display of all events
  const toggleAllEvents = () => setShowAllEvents(!showAllEvents)

  return (
    <section className="py-16 bg-gray-100">
      {/* Event Heading */}
      <div className="max-w-7xl mx-auto mb-16 px-4 md:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-blue-600 mb-4">Upcoming University Events</h1>
      </div>

      {/* Event Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 px-4 md:px-12">
        {/* Show the first 3 events by default */}
        {events.slice(0, 3).map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`relative p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden bg-white border border-gray-200`}
          >
            <div className="relative z-10 flex flex-col h-full">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{event.title}</h2>
              <div className="flex items-center text-gray-700 mb-2">
                <User className="w-4 h-4 mr-2" />
                <p className="text-sm">Speaker: {event.speakerName}</p>
              </div>
              <div className="flex items-center text-gray-700 mb-2">
                <Calendar className="w-4 h-4 mr-2" />
                <p className="text-sm">Date: {new Date(event.eventDate).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center text-gray-700">
                <MapPin className="w-4 h-4 mr-2" />
                <p className="text-sm">Venue: {event.venue}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Buttons */}
      <div className="mt-12 flex justify-center space-x-6">
        <button
          onClick={toggleAllEvents}
          className="group px-6 py-3 bg-gray-700 text-white font-medium rounded-full shadow-lg hover:shadow-gray-600/50 transition duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          <span className="flex items-center justify-center">
            <Eye className="w-5 h-5 mr-2 transform group-hover:scale-110 transition-transform duration-300" />
            {showAllEvents ? "Show Less Events" : "See More Events"}
          </span>
        </button>
      </div>
    </section>
  )
}

export default EventsSection

