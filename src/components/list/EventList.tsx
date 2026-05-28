"use client";

import { useEffect, useState } from "react";

interface EventItem {
  id: number;
  title: string;
  description: string;
  startTime: string;
  endTime: string;

  class?: {
    name: string;
  };
}

export default function EventList({
  refresh,
}: {
  refresh: number;
}) {
  const [events, setEvents] =
    useState<EventItem[]>([]);

  const fetchEvents = async () => {
    const res = await fetch("/api/events");

    const data = await res.json();

    setEvents(data);
  };

  useEffect(() => {
    fetchEvents();
  }, [refresh]);

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-4">
        Event List
      </h2>

      <div className="grid gap-4">
        {events.map((event) => (
          <div
            key={event.id}
            className="border p-4 rounded-lg shadow"
          >
            <p>
              <strong>Title:</strong>{" "}
              {event.title}
            </p>

            <p>
              <strong>Description:</strong>{" "}
              {event.description}
            </p>

            <p>
              <strong>Class:</strong>{" "}
              {event.class?.name ||
                "General Event"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}