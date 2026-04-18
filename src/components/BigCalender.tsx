"use client";

import { Calendar, momentLocalizer, View, Views } from "react-big-calendar";
import moment from "moment";
import { calendarEvents } from "@/lib/data";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState } from "react";

const localizer = momentLocalizer(moment);

const BigCalendar = () => {
  const [view, setView] = useState<View>(Views.WORK_WEEK);

  const handleOnChangeView = (selectedView: View) => {
    setView(selectedView);
  };


  const eventColors: Record<string, string> = {
  biology: "#f59e0b",
  english: "#10b981",
  chemistry: "#ef4444",
  physics: "#3b82f6",
  history: "#8b5cf6",
  math: "#ec4899",
};

const eventStyleGetter = (event: any) => ({
  style: {
    backgroundColor: eventColors[event.type] || "#3174ad",
    borderRadius: "8px",
    color: "white",
    border: "none",
    padding: "4px",
  },
});

  return (
 <Calendar
  localizer={localizer}
  events={calendarEvents}
  startAccessor="start"
  endAccessor="end"
  views={["work_week", "day"]}
  view={view}
  onView={handleOnChangeView}
  eventPropGetter={eventStyleGetter}  // ✅ ADD THIS LINE
  style={{ height: "98%" }}
/>
  );
};

export default BigCalendar;