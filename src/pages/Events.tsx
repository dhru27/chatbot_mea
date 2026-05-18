import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, MapPin, Clock, CalendarIcon, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { eventsData } from "@/data/events";

const getCategoryColor = (category: string) => {
  const colors: { [key: string]: string } = {
    Workshop: "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200",
    Social: "bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200",
    Visit: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    Lecture: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    Competition: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    Networking: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200"
  };
  return colors[category] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
};

const EventCard = ({ event, isUpcoming = false, onImageClick }: { event: any, isUpcoming?: boolean, onImageClick?: (event: any) => void }) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="max-w-md w-full mx-auto"
    >
      <Card className="h-full overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 dark:bg-gray-800/50 backdrop-blur-sm focus-within:ring-2 focus-within:ring-amber-500 focus-within:ring-offset-2 dark:focus-within:ring-offset-gray-900">
        <div
          className="relative aspect-video overflow-hidden cursor-pointer"
          onClick={() => onImageClick && onImageClick(event)}
        >
          <img 
            src={event.image} 
            alt={event.title} 
            className={`w-full h-full ${event.title === "MechAdvance26 Symposium" ? "object-contain bg-slate-900" : "object-cover object-center"} group-hover:scale-105 transition-transform duration-300`}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
          <Badge className={`absolute top-4 left-4 ${getCategoryColor(event.category)}`}>
            {event.category}
          </Badge>
          {isUpcoming && event.date <= new Date(new Date().setDate(new Date().getDate() + 3)) && (
            <Badge className="absolute top-4 right-4 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
              Soon
            </Badge>
          )}
        </div>
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
            {event.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
            {event.description}
          </p>
          
          <div className="space-y-2">
            {event.title !== "Convocation" && (
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <CalendarIcon className="h-4 w-4 mr-2 text-amber-500 dark:text-amber-400" />
                <span>{format(event.date, "MMMM d, yyyy")}</span>
              </div>
            )}
            {event.title !== "Convocation" && (
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Clock className="h-4 w-4 mr-2 text-amber-500 dark:text-amber-400" />
                <span>{event.time}</span>
              </div>
            )}
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <MapPin className="h-4 w-4 mr-2 text-amber-500 dark:text-amber-400" />
              <span className="truncate">{event.location}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const Events = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [expandedEvents, setExpandedEvents] = useState<Set<number>>(new Set());

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Simulate loading state for better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      clearTimeout(timer);
    };
  }, []);

  const getFilteredEvents = (category: string) => {
    const events = (eventsData as any)[category];
    if (!selectedDate) return events;

    return events.filter((event: any) => {
      const eventDate = new Date(event.date);
      return eventDate.getDate() === selectedDate.getDate() &&
        eventDate.getMonth() === selectedDate.getMonth() &&
        eventDate.getFullYear() === selectedDate.getFullYear();
    });
  };

  const getEventDates = () => {
    const dates: Date[] = [];
    [...eventsData.upcoming, ...eventsData.conducted].forEach(event => {
      dates.push(new Date(event.date));
    });
    return dates;
  };

  const getEventsForDate = (date: Date) => {
    return [...eventsData.upcoming, ...eventsData.conducted].filter((event: any) => {
      const d = new Date(event.date);
      return d.getDate() === date.getDate() && d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear();
    });
  };

  const eventDates = getEventDates();

  const isDateWithEvent = (date: Date) => {
    return eventDates.some(eventDate => 
      eventDate.getDate() === date.getDate() &&
      eventDate.getMonth() === date.getMonth() &&
      eventDate.getFullYear() === date.getFullYear()
    );
  };

  const clearDateFilter = () => {
    setSelectedDate(undefined);
  };

  const toggleEventExpansion = (eventId: number) => {
    setExpandedEvents(prev => {
      const newSet = new Set(prev);
      if (newSet.has(eventId)) {
        newSet.delete(eventId);
      } else {
        newSet.add(eventId);
      }
      return newSet;
    });
  };

  const filteredUpcomingEvents = getFilteredEvents("upcoming");
  const filteredConductedEvents = getFilteredEvents("conducted");

  // Event card skeleton for loading state
  const EventCardSkeleton = () => (
    <Card className="overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="relative aspect-video bg-gray-200 dark:bg-gray-700 animate-pulse" />
      <CardContent className="p-6">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse mb-2" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse mb-4 w-3/4" />
        
        <div className="space-y-2 mb-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center">
              <div className="h-4 w-4 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse mr-2" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse w-1/2" />
            </div>
          ))}
        </div>
        
        <div className="flex gap-2">
          <div className="flex-1 h-9 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
          <div className="h-9 w-9 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );

  const EventCardCompact = ({ event }: { event: any }) => (
    <div className="flex flex-col md:flex-row gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/80 transition-colors backdrop-blur-sm shadow-sm">
      <div className="md:w-1/4 aspect-video md:aspect-auto md:h-32 relative rounded-md overflow-hidden">
        <img src={event.image} alt={event.title} className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
        <Badge className={`absolute top-2 left-2 ${getCategoryColor(event.category)}`}>
          {event.category}
        </Badge>
      </div>
      <div className="md:w-3/4 flex flex-col">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">{event.title}</h3>
        <p className={`text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-2 ${event.title === "Merch Launch" ? "" : "line-clamp-2"}`}>{event.description}</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-2">
          {event.title !== "Convocation" && (
            <div className="flex items-center">
              <CalendarIcon className="h-3 w-3 mr-1 text-amber-500 dark:text-amber-400" />
              <span>{format(event.date, "MMM d, yyyy")}</span>
            </div>
          )}
          {event.title !== "Convocation" && (
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1 text-amber-500 dark:text-amber-400" />
              <span>{event.time}</span>
            </div>
          )}
          <div className="flex items-center">
            <MapPin className="h-3 w-3 mr-1 text-amber-500 dark:text-amber-400" />
            <span className="truncate">{event.location}</span>
          </div>
          <div className="flex items-center">
            <Users className="h-3 w-3 mr-1 text-amber-500 dark:text-amber-400" />
            <span>{event.attendees}/{event.capacity}</span>
          </div>
        </div>
        <div className="mt-auto flex gap-2 pt-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="shrink-0 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700" 
                  asChild
                >
                  <a href={event.googleCalendarLink} target="_blank" rel="noopener noreferrer" aria-label="Add to calendar">
                    <ExternalLink className="h-4 w-4 text-amber-500 dark:text-amber-400" />
                  </a>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add to Google Calendar</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );

  const EventCardExpandable = ({ event, isExpanded, onToggle }: { event: any, isExpanded: boolean, onToggle: () => void }) => (
    <motion.div
      layout
      initial={false}
      animate={{ height: isExpanded ? "auto" : "auto" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden backdrop-blur-sm shadow-sm"
    >
      <div 
        className="flex flex-col md:flex-row gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/80 transition-colors cursor-pointer"
        onClick={onToggle}
      >
        <div className="md:w-1/4 aspect-video md:aspect-auto md:h-32 relative rounded-md overflow-hidden">
          <img src={event.image} alt={event.title} className="w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
          <Badge className={`absolute top-2 left-2 ${getCategoryColor(event.category)}`}>
            {event.category}
          </Badge>
        </div>
        <div className="md:w-3/4 flex flex-col">
          <div className="flex items-start justify-between">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">{event.title}</h3>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="text-amber-500 dark:text-amber-400"
            >
              ▼
            </motion.div>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">{event.description}</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-2">
            {event.title !== "Convocation" && (
              <div className="flex items-center">
                <CalendarIcon className="h-3 w-3 mr-1 text-amber-500 dark:text-amber-400" />
                <span>{format(event.date, "MMM d, yyyy")}</span>
              </div>
            )}
            {event.title !== "Convocation" && (
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-1 text-amber-500 dark:text-amber-400" />
                <span>{event.time}</span>
              </div>
            )}
            <div className="flex items-center">
              <MapPin className="h-3 w-3 mr-1 text-amber-500 dark:text-amber-400" />
              <span className="truncate">{event.location}</span>
            </div>
            <div className="flex items-center">
              <Users className="h-3 w-3 mr-1 text-amber-500 dark:text-amber-400" />
              <span>{event.attendees}/{event.capacity}</span>
            </div>
          </div>
        </div>
      </div>
      
      <motion.div
        initial={false}
        animate={{ 
          height: isExpanded ? "auto" : 0,
          opacity: isExpanded ? 1 : 0
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
          <div className="pt-4">
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              {event.description}
            </p>
            <div className="flex gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="shrink-0 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700" 
                      asChild
                    >
                      <a href={event.googleCalendarLink} target="_blank" rel="noopener noreferrer" aria-label="Add to calendar">
                        <ExternalLink className="h-4 w-4 text-amber-500 dark:text-amber-400" />
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add to Google Calendar</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  const DayCellContent = (props: any) => {
    const date: Date = props?.date ?? props?.day ?? props;
    const eventsForDate = getEventsForDate(date);
    return (
      <div className="flex flex-col items-start gap-1 w-full">
        <div className="text-xs font-medium leading-none">{date.getDate()}</div>
        {eventsForDate.slice(0, 2).map((ev: any) => (
          <button
            key={ev.id}
            className="text-[10px] leading-snug text-amber-600 dark:text-amber-400 truncate w-full text-left hover:underline"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedEvent(ev);
            }}
          >
            {ev.title}
          </button>
        ))}
        {eventsForDate.length > 2 && (
          <div className="text-[10px] leading-none text-gray-500 dark:text-gray-400">+{eventsForDate.length - 2} more</div>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="mb-8 border border-gray-200 dark:border-gray-700 shadow-sm">
          <CardHeader className="border-b border-gray-100 dark:border-gray-800">
            <CardTitle className="text-2xl sm:text-3xl text-gray-900 dark:text-gray-100">Events</CardTitle>
            <div className="w-20 h-1 bg-amber-500 mt-2 mb-3" />
            <CardDescription className="text-gray-600 dark:text-gray-300 text-base">
              Discover upcoming and conducted events organized by the Mechanical Engineering Association
            </CardDescription>
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pt-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-6 sm:mb-8 w-full bg-gray-100 dark:bg-gray-800 p-1 rounded-lg overflow-x-auto flex sm:inline-flex whitespace-nowrap text-xs sm:text-base">
                <TabsTrigger 
                  value="upcoming" 
                  className="flex-1 sm:flex-none rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-amber-600 dark:data-[state=active]:text-amber-400 data-[state=active]:shadow-sm transition-all duration-200"
                >
                  Upcoming
                </TabsTrigger>
                <TabsTrigger
                  value="conducted"
                  className="flex-1 sm:flex-none rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-amber-600 dark:data-[state=active]:text-amber-400 data-[state=active]:shadow-sm transition-all duration-200"
                >
                  Conducted
                </TabsTrigger>
                <TabsTrigger 
                  value="calendar" 
                  className="flex-1 sm:flex-none rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-amber-600 dark:data-[state=active]:text-amber-400 data-[state=active]:shadow-sm transition-all duration-200"
                >
                  Calendar
                </TabsTrigger>
              </TabsList>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <TabsContent value="upcoming" className="w-full">
                  {selectedDate && (
                    <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg gap-2 border border-amber-200 dark:border-amber-800">
                      <div className="flex items-center">
                        <CalendarIcon className="h-5 w-5 mr-2 text-amber-500 dark:text-amber-400" />
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          Showing events for: <span className="font-semibold">{format(selectedDate, "MMMM d, yyyy")}</span>
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={clearDateFilter} 
                        className="self-end border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/30"
                      >
                        Clear Filter
                      </Button>
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-5xl mx-auto justify-items-center">
                    {isLoading ? (
                      Array(3).fill(0).map((_, i) => <EventCardSkeleton key={i} />)
                    ) : filteredUpcomingEvents.length > 0 ? (
                      filteredUpcomingEvents.map((event: any) => (
                        <EventCard
                          key={event.id}
                          event={event}
                          isUpcoming={true}
                          onImageClick={setSelectedEvent}
                        />
                      ))
                    ) : (
                      <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-center py-10 sm:py-12 bg-gray-50 dark:bg-gray-800/30 rounded-lg border border-gray-200 dark:border-gray-700">
                        <CalendarIcon className="h-12 w-12 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
                        <p className="text-gray-600 dark:text-gray-400 text-base">No upcoming events found for the selected date.</p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={clearDateFilter} 
                          className="mt-4"
                        >
                          View All Events
                        </Button>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="conducted" className="w-full">
                  {selectedDate && (
                    <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg gap-2 border border-amber-200 dark:border-amber-800">
                      <div className="flex items-center">
                        <CalendarIcon className="h-5 w-5 mr-2 text-amber-500 dark:text-amber-400" />
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          Showing events for: <span className="font-semibold">{format(selectedDate, "MMMM d, yyyy")}</span>
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={clearDateFilter} 
                        className="self-end border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/30"
                      >
                        Clear Filter
                      </Button>
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {isLoading ? (
                      Array(3).fill(0).map((_, i) => <EventCardSkeleton key={i} />)
                    ) : filteredConductedEvents.length > 0 ? (
                      filteredConductedEvents.map((event: any) => (
                        <EventCard
                          key={event.id}
                          event={event}
                          onImageClick={setSelectedEvent}
                        />
                      ))
                    ) : (
                      <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-center py-10 sm:py-12 bg-gray-50 dark:bg-gray-800/30 rounded-lg border border-gray-200 dark:border-gray-700">
                        <CalendarIcon className="h-12 w-12 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
                        <p className="text-gray-600 dark:text-gray-400 text-base">No conducted events found for the selected date.</p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={clearDateFilter} 
                          className="mt-4"
                        >
                          View All Events
                        </Button>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="calendar" className="w-full">
                  <Card className="border border-gray-200 dark:border-gray-700 shadow-sm w-full">
                    <CardHeader className="pb-2 border-b border-gray-100 dark:border-gray-800">
                      <CardTitle className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        Calendar
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-2 sm:p-4 w-full">
                      {isLoading ? (
                        <div className="animate-pulse w-full">
                          <div className="grid grid-cols-7 gap-2 mb-4">
                            {Array(7).fill(0).map((_, i) => (
                              <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md" />
                            ))}
                          </div>
                          <div className="grid grid-cols-7 gap-2">
                            {Array(35).fill(0).map((_, i) => (
                              <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded-md" />
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="w-full">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            className="rounded-md border border-gray-200 dark:border-gray-700 p-2 sm:p-3 w-full"
                            classNames={{
                              months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 w-full",
                              month: "space-y-4 w-full",
                              caption: "flex justify-center pt-1 relative items-center",
                              caption_label: "text-sm font-medium",
                              nav: "space-x-1 flex items-center",
                              nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                              nav_button_previous: "absolute left-1",
                              nav_button_next: "absolute right-1",
                              table: "w-full border-collapse space-y-1",
                              head_row: "flex w-full",
                              head_cell: "text-muted-foreground rounded-md w-full font-normal text-[0.8rem]",
                              row: "flex w-full mt-2",
                              cell: "w-full p-1 align-top",
                              day: "w-full h-20 sm:h-24 md:h-28 lg:h-32 text-left items-start justify-start p-2",
                              day_selected: "bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-100",
                            }}
                            components={{
                              DayContent: DayCellContent as any,
                            }}
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </motion.div>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
      <Dialog open={!!selectedEvent} onOpenChange={(open) => !open && setSelectedEvent(null)}>
        <DialogContent>
          {selectedEvent && (
            <div className="space-y-4">
              <DialogHeader>
                <DialogTitle>{selectedEvent.title}</DialogTitle>
                <DialogDescription>
                  {format(selectedEvent.date, "MMMM d, yyyy")} • {selectedEvent.time}
                </DialogDescription>
              </DialogHeader>
              <div className="w-full max-h-[80vh] bg-black flex items-center justify-center rounded-md overflow-hidden">
                <img
                  src={selectedEvent.image}
                  alt={selectedEvent.title}
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">{selectedEvent.description}</p>
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1 text-amber-500" />
                  {selectedEvent.location}
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1 text-amber-500" />
                  {selectedEvent.attendees}/{selectedEvent.capacity}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" asChild>
                  <a href={selectedEvent.googleCalendarLink} target="_blank" rel="noopener noreferrer">Add to Calendar</a>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Events;
