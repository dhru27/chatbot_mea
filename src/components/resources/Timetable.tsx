import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const timetableData = {
  "firstYear": [
  // Monday
  { course: "MA105", room: "LA201", day: "Monday", start: "08:30", end: "09:25" },
  { course: "MS101 Lecture", room: "LA201", day: "Monday", start: "10:35", end: "11:30" },
  { course: "ME103", room: "LA201", day: "Monday", start: "11:35", end: "12:30" },
  { course: "CH117 (P3)", room: "", day: "Monday", start: "14:00", end: "16:55" },

  // Tuesday
  { course: "ME103", room: "LA201", day: "Tuesday", start: "08:30", end: "09:25" },
  { course: "MA105", room: "LA201", day: "Tuesday", start: "09:30", end: "10:25" },
  { course: "MS101 Lab (P3)", room: "", day: "Tuesday", start: "14:00", end: "16:55" },

  // Wednesday
  { course: "BB101", room: "LH302", day: "Wednesday", start: "11:05", end: "12:30" },

  // Thursday
  { course: "BB101 (Tutorial)", room: "", day: "Thursday", start: "08:30", end: "09:25" },
  { course: "ME103", room: "LA201", day: "Thursday", start: "09:30", end: "10:25" },
  { course: "MA105", room: "LA201", day: "Thursday", start: "10:35", end: "11:30" },

  // Friday
  { course: "BB101", room: "LH302", day: "Friday", start: "11:05", end: "12:30" },
  { course: "MS101 Lab (P3)", room: "", day: "Friday", start: "14:00", end: "16:55" }
  ],
  "secondYear": [
    // Monday
    { course: "ME221", room: "S1:VMCC21, S2:LC302", day: "Monday", start: "08:30", end: "09:25" },
    { course: "ME223", room: "S1:ESE113, S2:ESE106, S3:LC001", day: "Monday", start: "10:30", end: "11:25" },
    { course: "ME225", room: "S1:ESE102, S2:ESE109, S3:ESE112", day: "Monday", start: "11:30", end: "12:25" },
    { course: "EC101", room: "LA002", day: "Monday", start: "15:30", end: "16:55" },

    // Tuesday
    { course: "ME225", room: "S1:ESE102, S2:ESE109, S3:ESE112", day: "Tuesday", start: "08:30", end: "09:25" },
    { course: "ME221", room: "S1:VMCC21, S2:LC302", day: "Tuesday", start: "09:30", end: "10:25" },
    { course: "ME223", room: "S1:ESE113, S2:ESE106, S3:LC001", day: "Tuesday", start: "11:30", end: "12:25" },

    // Wednesday
    { course: "ME209", room: "S1:F24, S2:J04, S3:ESE113", day: "Wednesday", start: "11:05", end: "12:30" },

    // Thursday
    { course: "ME223", room: "S1:ESE113, S2:ESE106, S3:LC001", day: "Thursday", start: "08:30", end: "09:25" },
    { course: "ME225", room: "S1:ESE102, S2:ESE109, S3:ESE112", day: "Thursday", start: "09:30", end: "10:25" },
    { course: "ME221", room: "S1:VMCC21, S2:LC302", day: "Thursday", start: "10:30", end: "11:25" },
    { course: "EC101", room: "LA002", day: "Thursday", start: "15:30", end: "16:55" },

    // Friday
    { course: "ME209", room: "S1:F24, S2:J04, S3:ESE113", day: "Friday", start: "11:05", end: "12:30" }
  ],
  "thirdYear": [
    // Monday
    { course: "ME323", room: "F24", day: "Monday", start: "08:30", end: "09:25" },
    { course: "ME319", room: "ESE113", day: "Monday", start: "09:30", end: "10:25" },
    { course: "ME346", room: "ESE110", day: "Monday", start: "10:35", end: "11:30" },
    { course: "ME306", room: "IC2 SOM", day: "Monday", start: "11:35", end: "12:30" },
    { course: "ME224 S1", room: "", day: "Monday", start: "14:00", end: "15:25" },

    // Tuesday
    { course: "ME306", room: "IC2 SOM", day: "Tuesday", start: "08:30", end: "09:25" },
    { course: "ME323", room: "F24", day: "Tuesday", start: "09:30", end: "10:25" },
    { course: "ME319", room: "ESE113", day: "Tuesday", start: "10:35", end: "11:30" },
    { course: "ME346", room: "ESE110", day: "Tuesday", start: "11:35", end: "12:30" },
    { course: "ME374 S1", room: "", day: "Tuesday", start: "14:00", end: "15:25" },

    // Wednesday
    // (Lab sessions removed as requested)

    // Thursday
    { course: "ME346", room: "ESE105", day: "Thursday", start: "08:30", end: "09:25" },
    { course: "ME306", room: "IC3 SOM", day: "Thursday", start: "09:30", end: "10:25" },
    { course: "ME323", room: "LC101", day: "Thursday", start: "10:35", end: "11:30" },
    { course: "ME319", room: "ESE102", day: "Thursday", start: "11:35", end: "12:30" },
    { course: "ME224 S2", room: "", day: "Thursday", start: "14:00", end: "15:25" },

    // Friday
    { course: "ME374 S2", room: "", day: "Friday", start: "14:00", end: "15:25" }
  ],
};

// Helper functions for time calculations
const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

const minutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
};

const WeeklyTimetable = () => {
  const [year, setYear] = useState("firstYear");
  const [isMobile, setIsMobile] = useState(false);
  const [currentMobileDay, setCurrentMobileDay] = useState(0); // 0 = today, -1 = yesterday, +1 = tomorrow, etc.

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Get current week Monday date for desktop
  const getCurrentWeekMonday = () => {
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - today.getDay() + 1);
    return monday;
  };

  // Get date for mobile view based on currentMobileDay offset
  const getMobileDate = () => {
    const today = new Date();
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + currentMobileDay);
    return targetDate;
  };

  // Get day name for mobile view
  const getMobileDayName = () => {
    const date = getMobileDate();
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return dayNames[date.getDay()];
  };

  // Generate time slots from 8 AM to 6 PM (30-minute intervals)
  const generateTimeSlots = () => {
    const slots = [];
    for (let minutes = 8 * 60; minutes < 18 * 60; minutes += 30) {
      slots.push(minutesToTime(minutes));
    }
    return slots;
  };

  // Get events for a specific day
  const getEventsForDay = (dayName: string) => {
    return (timetableData as any)[year]?.filter((cls: any) => cls.day === dayName) || [];
  };

  // Transform events for FullCalendar
  const transformToEvents = () => {
    const mondayDate = getCurrentWeekMonday();
    const dayMap = {
      'Monday': 0, 'Tuesday': 1, 'Wednesday': 2, 'Thursday': 3, 'Friday': 4
    };

    return (timetableData as any)[year]?.map((cls: any, index: number) => {
      const eventDate = new Date(mondayDate);
      eventDate.setDate(mondayDate.getDate() + dayMap[cls.day as keyof typeof dayMap]);

      const startDateTime = new Date(eventDate);
      const [startHour, startMin] = cls.start.split(':').map(Number);
      startDateTime.setHours(startHour, startMin, 0, 0);

      const endDateTime = new Date(eventDate);
      const [endHour, endMin] = cls.end.split(':').map(Number);
      endDateTime.setHours(endHour, endMin, 0, 0);

      return {
        id: index.toString(),
        title: cls.course,
        start: startDateTime,
        end: endDateTime,
        extendedProps: {
          room: cls.room
        }
      };
    }) || [];
  };

  // Desktop Week View Component - FullCalendar
  const DesktopWeekView = () => {
    return (
      <div className="weekly-timetable desktop-calendar">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          initialDate={getCurrentWeekMonday()}
          headerToolbar={false} // Hide all header toolbar
          dayHeaderFormat={{ weekday: 'long' }} // Show only weekday names (Monday, Tuesday, etc.)
          events={transformToEvents()}
          weekends={false}
          slotMinTime="08:00:00"
          slotMaxTime="18:00:00"
          height="auto"
          expandRows={true}
          allDaySlot={false}
          eventContent={(eventInfo) => (
            <div className="p-1 text-xs">
              <div className="font-semibold">{eventInfo.event.title}</div>
              <div className="text-xs opacity-80">{eventInfo.event.extendedProps.room}</div>
            </div>
          )}
        />
      </div>
    );
  };

  // Mobile Day View Component
  const MobileDayView = () => {
    const dayName = getMobileDayName();
    const dayEvents = getEventsForDay(dayName);
    const date = getMobileDate();

    // Sort events by start time
    const sortedEvents = dayEvents.sort((a, b) => timeToMinutes(a.start) - timeToMinutes(b.start));

    const isToday = date.toDateString() === new Date().toDateString();

    return (
      <div className="weekly-timetable mobile-calendar">
        {/* Mobile navigation header */}
        <div className="flex items-center justify-between mb-4 p-4 bg-muted rounded-lg">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentMobileDay(prev => prev - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="text-center">
            <div className={`font-semibold text-lg ${isToday ? 'text-blue-600' : ''}`}>
              {dayName}
            </div>
            <div className={`text-sm ${isToday ? 'text-blue-500' : 'text-muted-foreground'}`}>
              {date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentMobileDay(prev => prev + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Events list */}
        <div className="space-y-3">
          {sortedEvents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No classes scheduled for {dayName}
            </div>
          ) : (
            sortedEvents.map((event, index) => (
              <div
                key={index}
                className="bg-yellow-500 text-black p-4 rounded-lg shadow-sm"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="font-semibold text-lg">{event.course}</div>
                  <div className="text-sm opacity-90">
                    {formatTime(event.start)} - {formatTime(event.end)}
                  </div>
                </div>
                {event.room && (
                  <div className="text-sm opacity-90">
                    📍 {event.room}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Class Timetable</span>
          <Select value={year} onValueChange={setYear}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="firstYear">First Year</SelectItem>
              <SelectItem value="secondYear">Second Year</SelectItem>
              <SelectItem value="thirdYear">Third Year</SelectItem>
              <SelectItem value="fourthYear">Fourth Year</SelectItem>
            </SelectContent>
          </Select>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isMobile ? <MobileDayView /> : <DesktopWeekView />}
      </CardContent>
    </Card>
  );
};

export default WeeklyTimetable;
