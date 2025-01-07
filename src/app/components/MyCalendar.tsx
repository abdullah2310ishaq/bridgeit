"use client";

import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function MyCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const handleDateChange = (value: Date | Date[] | null) => {
    if (Array.isArray(value)) {
      setSelectedDate(value[0] || null);
    } else {
      setSelectedDate(value);
    }
  };

  return (
    <div className="p-4 rounded-md">
      <Calendar
        onChange={handleDateChange}
        value={selectedDate}
        // If single-date only:
        selectRange={false}
        className="dark-calendar"
      />

      <p className="text-white mt-4">
        Selected Date: {selectedDate?.toDateString()}
      </p>

      {/* 
        Add style overrides below so text is visible on dark backgrounds.
        Notice we used "dark-calendar" as a className to target the container.
      */}
      <style jsx>{`
        .dark-calendar {
          background-color: #1f2937; /* e.g. Tailwind gray-800 */
          color: #d1d5db;           /* Tailwind gray-300 text */
          border-radius: 0.5rem;
          border: none;
          padding: 1rem;
        }

        /* Month + year navigation (arrows, label) */
        .dark-calendar .react-calendar__navigation button {
          background: transparent;
          color: #d1d5db;
        }

        /* Weekday labels (Mo, Tu, etc.) */
        .dark-calendar .react-calendar__month-view__weekdays {
          text-transform: uppercase; /* optional */
          color: #ccc;
        }

        /* Individual day tiles */
        .dark-calendar .react-calendar__tile {
          background: transparent;
          color: #e5e7eb;  /* a bit lighter gray for text */
          transition: background-color 0.2s ease;
          border-radius: 0.25rem;
        }
        .dark-calendar .react-calendar__tile--now {
          background: #374151; /* highlight "today" with a subtle gray */
          color: #fff;
        }
        .dark-calendar .react-calendar__tile:hover {
          background-color: #374151; /* a bit darker on hover */
        }
        .dark-calendar .react-calendar__tile--active {
          background-color: #2563eb; /* e.g. Tailwind blue-600 */
          color: #fff;
        }
        .dark-calendar .react-calendar__tile--active:hover {
          background-color: #1e40af; /* deeper blue on hover */
        }
      `}</style>
    </div>
  );
}
