export type EventItem = {
  id: number;
  title: string;
  date: Date;
  time: string;
  location: string;
  attendees: number;
  capacity: number;
  image: string;
  description: string;
  category: string;
  googleCalendarLink: string;
};

export type EventsData = {
  upcoming: EventItem[];
  conducted: EventItem[];
};

export const eventsData: EventsData = {
  upcoming: [
    {
      id: 3,
      title: "Trad Day",
      date: new Date(2026, 2, 15),
      time: "18:00 - 22:00",
      location: "ME Workshop Area",
      attendees: 0,
      capacity: 80,
      image: "/lovable-uploads/trad.jpg",
      description:
        "Trad Day is a fun cultural day where everyone from the Mechanical Department turns up in traditional outfits, takes photos, and chills together between all the academic chaos.",
      category: "Informal",
      googleCalendarLink:
        "https://calendar.google.com/calendar/u/0/r/eventedit?text=Trad+Day&dates=20251225T100000Z/20251225T170000Z&location=ME+Workshop+Area&pli=1",
    },
    {
      id: 9,
      title: "MechAdvance26 Symposium",
      date: new Date(2026, 2, 14),
      time: "10:00 - 18:00",
      location: "ME Department, IIT Bombay",
      attendees: 0,
      capacity: 300,
      image: "/lovable-uploads/MechAdvance26.jpeg",
      description:
        "Flagship IITB Mechanical Engineering symposium exploring advances in interdisciplinary research linking ME with AI, robotics, biomechanics, energy, materials, manufacturing, and mechanics.",
      category: "Conference",
      googleCalendarLink:
        "https://calendar.google.com/calendar/u/0/r/eventedit?text=MechAdvance26+Symposium&dates=20260314T100000Z/20260314T180000Z&location=ME+Department,+IIT+Bombay&pli=1",
    },
  ],
  conducted: [
    {
      id: 10,
      title: "MEA Department Trip: Goa",
      date: new Date(2026, 0, 24),
      time: "January 24 - 26",
      location: "Goa",
      attendees: 0,
      capacity: 120,
      image: "/lovable-uploads/goa.jpeg",
      description:
        "Hello Mech peeps!! Here comes the much anticipated MEA Department Trip all set and we're headed to Goa this year. An opportunity to get a break from the hectic schedules and create lifetime memories with your friends.",
      category: "Trip",
      googleCalendarLink: "#",
    },
    {
      id: 8,
      title: "MEA Football League 2026",
      date: new Date(2026, 1, 15),
      time: "07:20 - 10:00; 16:00 - 20:00",
      location: "IITB Football Turf",
      attendees: 0,
      capacity: 120,
      image: "/lovable-uploads/football.jpeg",
      description:
        "Ready to dominate the field, unleash your skills, forge unbreakable squad bonds, and seize the victory that's calling your name? The MEA Football League 2026 is here to deliver the ultimate kickstart. Claim the grand prize and eternal glory!",
      category: "Competition",
      googleCalendarLink: "#",
    },
    {
      id: 2,
      title: "Merch Launch",
      date: new Date(2026, 1, 11),
      time: "21:00 - 23:00",
      location: "PG Lounge, Mech Building",
      attendees: 0,
      capacity: 150,
      image: "/lovable-uploads/merchlaunch.jpeg",
      description:
        "Be the first to get your hands on the latest MEA merchandise! From stylish t-shirts to exclusive accessories, celebrate your mechanical engineering pride with our brand new collection.",
      category: "Social",
      googleCalendarLink:
        "https://calendar.google.com/calendar/u/0/r/eventedit?text=Merch+Launch&dates=20251220T160000Z/20251220T200000Z&location=ME+Department+Plaza&pli=1",
    },
    {
      id: 7,
      title: "Treasure Hunt",
      date: new Date(2025, 10, 11),
      time: "18:00 - 22:00",
      location: "OAT",
      attendees: 96,
      capacity: 120,
      image: "/lovable-uploads/treasurehunt.jpeg",
      description:
        "A thrilling treasure hunt that tested both mental acuity and physical endurance. Teams navigated through challenging clues hidden across the department, combining problem-solving with exploration.",
      category: "Competition",
      googleCalendarLink: "#",
    },
    {
      id: 6,
      title: "Mechanza",
      date: new Date(2025, 8, 29),
      time: "18:00 - 22:00",
      location: "LT-PCSA",
      attendees: 142,
      capacity: 150,
      image: "/lovable-uploads/mechanza25.jpg",
      description:
        "The most anticipated soirée of the year where sophistication meets celebration. Mechanical engineers dressed in their finest attire for an evening of elegance, conversation, and unforgettable memories.",
      category: "Social",
      googleCalendarLink: "#",
    },
    {
      id: 5,
      title: "Convocation",
      date: new Date(2024, 7, 20),
      time: "",
      location: "Convocation Hall",
      attendees: 500,
      capacity: 600,
      image: "/lovable-uploads/convo.jpg",
      description:
        "A grand celebration marking the successful completion of the mechanical engineering program. Graduates received their degrees amidst inspiring speeches and memorable moments.",
      category: "Social",
      googleCalendarLink: "#",
    },
  ],
};

