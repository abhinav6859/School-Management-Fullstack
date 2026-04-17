

"use client";

import Image from "next/image";
import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

type EventType = {
  id: number;
  title: string;
  time: string;
  description: string;
  date: string; // YYYY-MM-DD
};

// ✅ TEMP DATA (now with dates)
const events: EventType[] = [
  {
    id: 1,
    title: "Math Exam",
    time: "12:00 PM - 2:00 PM",
    description: "Chapter 5 & 6",
    date: "2026-04-17",
  },
  {
    id: 2,
    title: "Science Test",
    time: "10:00 AM - 11:00 AM",
    description: "Physics Unit",
    date: "2026-04-18",
  },
  {
    id: 3,
    title: "Parent Meeting",
    time: "1:00 PM - 3:00 PM",
    description: "Discuss performance",
    date: "2026-04-17",
  },
];

const EventCalendar = () => {
  const [value, setValue] = useState<Value>(new Date());

  // ✅ Normalize selected date
  const selectedDate =
    value instanceof Date
      ? value.toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0];

  // ✅ Filter events based on selected date
  const filteredEvents = events.filter(
    (event) => event.date === selectedDate
  );

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm">
      {/* CALENDAR */}
      <Calendar
        onChange={setValue}
        value={value}
        className="border-none w-full"
        tileContent={({ date }) => {
          const hasEvent = events.some(
            (e) => e.date === date.toISOString().split("T")[0]
          );

          return hasEvent ? (
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mx-auto mt-1" />
          ) : null;
        }}
      />

      {/* HEADER */}
      <div className="flex items-center justify-between mt-4">
        <div>
          <h1 className="text-lg font-semibold">Events</h1>
          <p className="text-xs text-gray-400">
            {new Date(selectedDate).toDateString()}
          </p>
        </div>

        <button
          aria-label="More options"
          className="p-2 rounded-full hover:bg-gray-100 transition"
        >
          <Image src="/moreDark.png" alt="More options" width={18} height={18} />
        </button>
      </div>

      {/* EVENTS LIST */}
      <div className="flex flex-col gap-3 mt-4">
        {filteredEvents.length === 0 ? (
          <p className="text-gray-400 text-sm">
            No events scheduled for this day.
          </p>
        ) : (
          filteredEvents.map((event, index) => (
            <div
              key={event.id}
              className={`p-4 rounded-lg border border-gray-100 border-t-4 shadow-sm hover:shadow-md transition ${
                index % 2 === 0
                  ? "border-t-lamaSky"
                  : "border-t-lamaPurple"
              }`}
            >
              <div className="flex items-center justify-between">
                <h2 className="font-medium text-gray-700">
                  {event.title}
                </h2>
                <span className="text-xs text-gray-400">
                  {event.time}
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                {event.description}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EventCalendar;