"use client";

import { useEffect, useState } from "react";

interface Announcement {
  id: number;
  title: string;
  description: string;
  date: string;

  class?: {
    name: string;
  };
}

export default function AnnouncementList({
  refresh,
}: {
  refresh: number;
}) {
  const [announcements,
    setAnnouncements] =
    useState<Announcement[]>([]);

  const fetchAnnouncements =
    async () => {
      const res = await fetch(
        "/api/announcements"
      );

      const data =
        await res.json();

      setAnnouncements(data);
    };

  useEffect(() => {
    fetchAnnouncements();
  }, [refresh]);

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-4">
        Announcement List
      </h2>

      <div className="grid gap-4">
        {announcements.map(
          (announcement) => (
            <div
              key={
                announcement.id
              }
              className="border p-4 rounded-lg shadow"
            >
              <p>
                <strong>
                  Title:
                </strong>{" "}
                {
                  announcement.title
                }
              </p>

              <p>
                <strong>
                  Description:
                </strong>{" "}
                {
                  announcement.description
                }
              </p>

              <p>
                <strong>
                  Date:
                </strong>{" "}
                {
                  announcement.date
                }
              </p>

              <p>
                <strong>
                  Class:
                </strong>{" "}
                {announcement.class
                  ?.name ||
                  "General"}
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}