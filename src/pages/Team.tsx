import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Linkedin, Mail, UserRound, Instagram } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
// Combined team data
// const teamData = [
//   {
//     id: 1,
//     name: "Prof. Amit Kumar",
//     position: "Faculty Advisor, MEA",
//     department: "Mechanical Engineering",
//     email: "amit@me.iitb.ac.in",
//     linkedin: "#",
//     bio: "Professor Kumar specializes in thermal engineering and has been the faculty advisor for MEA since 2020.",
//     image: "/public/lovable-uploads/f4aa4742-2202-46f3-9eec-cefb01abd89b.png"
//   },
//   {
//     id: 2,
//     name: "Prof. Priya Patel",
//     position: "Co-Faculty Advisor, MEA",
//     department: "Mechanical Engineering",
//     email: "priya@me.iitb.ac.in",
//     linkedin: "#",
//     bio: "Professor Patel focuses on robotics and automation. She has been instrumental in developing industry partnerships.",
//     image: "/public/lovable-uploads/5f363352-0705-487a-baed-4c046690236b.png"
//   },
//   {
//     id: 3,
//     name: "Rahul Gupta",
//     position: "Overall Coordinator",
//     year: "4th Year",
//     email: "rahul@iitb.ac.in",
//     linkedin: "#",
//     bio: "Rahul oversees all MEA activities and has been part of the association since his first year.",
//     image: "/public/lovable-uploads/6b115935-67fc-4138-8a82-cf42108c1d16.png"
//   },
//   {
//     id: 4,
//     name: "Sneha Sharma",
//     position: "Technical Events Coordinator",
//     year: "3rd Year",
//     email: "sneha@iitb.ac.in",
//     linkedin: "#",
//     bio: "Sneha manages all technical workshops and competitions. She has a keen interest in CAD design.",
//     image: "/public/lovable-uploads/e3fd6b91-d6bc-45ef-8ccf-7fd7292b928d.png"
//   },
//   {
//     id: 5,
//     name: "Vikram Singh",
//     position: "Academic Coordinator",
//     year: "3rd Year",
//     email: "vikram@iitb.ac.in",
//     linkedin: "#",
//     bio: "Vikram coordinates academic initiatives including mentorship programs and study sessions.",
//     image: "/public/lovable-uploads/f4aa4742-2202-46f3-9eec-cefb01abd89b.png"
//   },
//   {
//     id: 6,
//     name: "Ananya Desai",
//     position: "Technical Team Member",
//     year: "2nd Year",
//     email: "ananya@iitb.ac.in",
//     linkedin: "#",
//     bio: "Ananya is passionate about thermal sciences and helps organize technical workshops on CAD design.",
//     image: "/public/lovable-uploads/5f363352-0705-487a-baed-4c046690236b.png"
//   },
//   {
//     id: 7,
//     name: "Raj Mehta",
//     position: "Events Team Member",
//     year: "2nd Year",
//     email: "raj@iitb.ac.in",
//     linkedin: "#",
//     bio: "Raj assists in planning and executing various MEA events and competitions throughout the academic year.",
//     image: "/public/lovable-uploads/6b115935-67fc-4138-8a82-cf42108c1d16.png"
//   },
//   {
//     id: 8,
//     name: "Neha Kapoor",
//     position: "Editorial Team Member",
//     year: "2nd Year",
//     email: "neha@iitb.ac.in",
//     linkedin: "#",
//     bio: "Neha contributes to MEA's newsletter and manages social media content to keep students informed.",
//     image: "/public/lovable-uploads/e3fd6b91-d6bc-45ef-8ccf-7fd7292b928d.png"
//   },
//   {
//     id: 9,
//     name: "Arjun Reddy",
//     position: "Web Team Member",
//     year: "2nd Year",
//     email: "arjun@iitb.ac.in",
//     linkedin: "#",
//     bio: "Arjun maintains the MEA website and helps develop new features to improve user experience.",
//     image: "/public/lovable-uploads/f4aa4742-2202-46f3-9eec-cefb01abd89b.png"
//   }
// ];

const teamData = [
  {
    id: 1,
    name: "Tanmay Kulkarni",
    position: "Department General Secretary",
    email: "22b2188@iitb.ac.in",
    phone: "8380983079",
    linkedin: null,
    instagram: null,
    bio: "Department General Secretary of MEA, responsible for overseeing all departmental activities and ensuring smooth coordination between various committees.",
    image: "/members/Tanmay_photo.jpg"
  },
  {
    id: 2,
    name: "Abhishek Sokhal",
    position: "PG Secretary",
    email: "23m1722@iitb.ac.in",
    phone: "7988561774",
    linkedin: null,
    instagram: null,
    bio: "PG Secretary, representing postgraduate students and coordinating activities specifically designed for the PG community within MEA.",
    image: "/members/ABHISHEK.jpg"
  },
  {
    id: 3,
    name: "Aditya Udeniya",
    position: "MEA Chief Secretary",
    email: "23b2109@iitb.ac.in",
    phone: "9462222225",
    linkedin: "https://www.linkedin.com/in/aditya-udeniya-428714290/",
    instagram: "https://www.instagram.com/only.adii8?igsh=MWY3dTVibHNjY3p5NQ==",
    bio: "MEA Chief Secretary, leading the Mechanical Engineering Association with strategic vision and ensuring excellence in all departmental activities.",
    image: "/members/Aditya.jpg"
  },
  {
    id: 4,
    name: "Khushi Sharma",
    position: "Chief Secretary - Academic Affairs",
    email: "23b2182@iitb.ac.in",
    phone: "9999595888",
    linkedin: "https://www.linkedin.com/in/khushi-r-sharma/",
    instagram: "https://www.instagram.com/khushi_knrs",
    bio: "Chief Secretary for Academic Affairs, overseeing academic initiatives and ensuring the highest standards of educational excellence.",
    image: "/static/media/placeholder.49403b70.jpg"
  },
  {
    id: 5,
    name: "Manaswi Goyal",
    position: "Department Research Coordinator",
    email: "manaswi@iitb.ac.in",
    phone: "9301457621",
    linkedin: null,
    instagram: null,
    bio: "Department Research Coordinator, focused on promoting research activities and fostering academic excellence within the mechanical engineering department.",
    image: "/static/media/placeholder.49403b70.jpg"
  },
  {
    id: 6,
    name: "Animith Srimani",
    position: "PG Cultural Secretary",
    email: "24m1662@iitb.ac.in",
    phone: "9830767887",
    linkedin: null,
    instagram: null,
    bio: "PG Cultural Secretary, organizing cultural events and activities for postgraduate students while promoting artistic expression.",
    image: "/static/media/placeholder.49403b70.jpg"
  },
  {
    id: 7,
    name: "Avinash Chauhan",
    position: "PG Sports Secretary",
    email: "24m1646@iitb.ac.in",
    phone: "7267080276",
    linkedin: "https://www.linkedin.com/in/avinash-chauhan-1426b71b3",
    instagram: "https://www.instagram.com/avirsingh7801?igsh=MTlpcXFuODAzdjhzNA==",
    bio: "PG Sports Secretary, organizing sports activities specifically for postgraduate students and promoting physical fitness among the PG community.",
    image: "/members/Avi.JPG"
  },
  {
    id: 8,
    name: "Rihan Ashraf",
    position: "Chief Secretary - Industrial Outreach",
    email: "rihanashraf@iitb.ac.in",
    phone: "9326287348",
    linkedin: "https://www.linkedin.com/in/rihan-ashraf/",
    instagram: "https://www.instagram.com/rihan_ash/",
    bio: "Chief Secretary for Industrial Outreach, dedicated to building strong industry connections and creating opportunities for students through corporate partnerships.",
    image: "/static/media/placeholder.49403b70.jpg"
  },
  {
    id: 9,
    name: "Bharat Gupta",
    position: "Third Year Class Representative",
    email: "23b2180@iitb.ac.in",
    phone: "9888122008",
    linkedin: null,
    instagram: null,
    bio: "Third Year Class Representative, serving as the bridge between third-year students and the department administration.",
    image: "/members/Bharat.jpg"
  },
  {
    id: 10,
    name: "Aarav Gupta",
    position: "Web Secretary",
    email: "24b2235@iitb.ac.in",
    phone: "9665138787",
    linkedin: "https://www.linkedin.com/in/aarav-gupta-128282202/",
    instagram: null,
    bio: "Web Secretary, managing the digital presence of MEA and ensuring effective online communication and information dissemination.",
    image: "/static/media/placeholder.49403b70.jpg"
  },
  {
    id: 11,
    name: "Angel Singhvi",
    position: "Second Year Class Representative",
    email: "24b2134@iitb.ac.in",
    phone: "7023389911",
    linkedin: null,
    instagram: null,
    bio: "Second Year Class Representative, working to address the concerns and needs of second-year students while promoting their active participation.",
    image: "/members/Angel.jpg"
  },
  {
    id: 12,
    name: "Bhavya Choudhury",
    position: "Alumni Secretary",
    email: "24b2107@iitb.ac.in",
    phone: "6375939670",
    linkedin: "https://www.linkedin.com/in/bhavya-choudhury-561142318/",
    instagram: "https://www.instagram.com/_bhavya_1_3/",
    bio: "Alumni Secretary, maintaining strong connections with department alumni and organizing events to foster networking opportunities.",
    image: "/static/media/placeholder.49403b70.jpg"
  },
  {
    id: 13,
    name: "Mitesh",
    position: "Sports Secretary",
    email: "24b2249@iitb.ac.in",
    phone: "8209945491",
    linkedin: "www.linkedin.com/in/mitesh-ruhela-0126592b5",
    instagram: null,
    bio: "Sports Secretary, promoting sports activities and organizing athletic events to encourage physical fitness and team spirit among students.",
    image: "/members/Mitesh. jpg.jpg"
  },
  {
    id: 14,
    name: "Nevedhya Jain",
    position: "Associate Secretary",
    email: "24b2200@iitb.ac.in",
    phone: "6376977714",
    linkedin: "https://www.linkedin.com/in/nevedhya-jain-203822314?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
    instagram: "https://www.instagram.com/nevedhya_jain?igsh=MXU4OWc1dnJwNHQ1Yg%3D%3D&utm_source=qr",
    bio: "Associate Secretary, supporting the core team in various administrative tasks and ensuring efficient communication across all departments.",
    image: "/members/Nevedhya.PNG"
  },
  {
    id: 15,
    name: "Prakhar Gupta",
    position: "Second Year Class Representative",
    email: "24b2173@iitb.ac.in",
    phone: "9893280821",
    linkedin: null,
    instagram: null,
    bio: "Second Year Class Representative, serving as the voice of second-year students and facilitating communication between students and faculty.",
    image: "/members/prakhar.jpg"
  },
  {
    id: 16,
    name: "Ryan Sammy D'Souza",
    position: "Second Year Class Representative",
    email: "24b2267@iitb.ac.in",
    phone: "9372040972",
    linkedin: "https://www.linkedin.com/in/ryansammydsouza/",
    instagram: "https://www.instagram.com/ryandsouza0221/",
    bio: "Second Year Class Representative, representing the interests of second-year students and ensuring their voices are heard in departmental matters.",
    image: "/members/RyanDSouza.jpg"
  },
  {
    id: 17,
    name: "Siddhant Chetan Patil",
    position: "Senior Editor",
    email: "24B2121@iitb.ac.in",
    phone: "8830569434",
    linkedin: null,
    instagram: null,
    bio: "Senior Editor, responsible for content creation, editing, and maintaining the quality of all written materials and publications for MEA.",
    image: "/members/siddhant.jpg"
  },
  {
    id: 18,
    name: "Sinchana Patil",
    position: "Design Secretary",
    email: "24b2257@iitb.ac.in",
    phone: "8722836140",
    linkedin: null,
    instagram: null,
    bio: "Design Secretary, creating visually appealing content and managing the aesthetic aspects of all MEA events and communications.",
    image: "/members/Sinchana.png"
  },
  {
    id: 19,
    name: "Srikrishna Mourya",
    position: "Associate Secretary",
    email: "24b2198@iitb.ac.in",
    phone: "9769362275",
    linkedin: "https://www.linkedin.com/in/srikrishnamourya-karunakaram-467b04314/",
    instagram: null,
    bio: "Associate Secretary, working closely with the core team to ensure smooth operations and effective coordination of all MEA activities.",
    image: "/members/Srikrishna.jpg"
  },
  {
    id: 20,
    name: "Varad Vinay Padhye",
    position: "Media Secretary",
    email: "24b2179@iitb.ac.in",
    phone: "8975383053",
    linkedin: "https://www.linkedin.com/in/varad-padhye-60743a329?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    instagram: "https://www.instagram.com/varad_padhye_21?igsh=ajlpcDVrZWRha2xk",
    bio: "Media Secretary, managing all media-related activities including photography, videography, and social media presence for MEA events.",
    image: "/members/varad.jpg"
  },
  {
    id: 21,
    name: "Varun Inamdar",
    position: "Third Year Class Representative",
    email: "23b2203@iitb.ac.in",
    phone: "8850163828",
    linkedin: "https://www.linkedin.com/in/varun-inamdar-0935b6243/",
    instagram: "https://www.instagram.com/varun_inamdar_2005/",
    bio: "Third Year Class Representative, representing the third-year student body and ensuring their academic and extracurricular needs are met.",
    image: "/static/media/placeholder.49403b70.jpg"
  }
]

const TeamMemberCard = ({ member }: { member: any }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };
  
  return (
    <div 
      className="h-[400px] w-full perspective-1000" 
      onClick={handleFlip}
    >
      <div 
        className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* Front of Card */}
        <Card className="absolute w-full h-full backface-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
          <CardContent className="p-6 flex flex-col items-center justify-center h-full">
            <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-2 border-transparent hover:border-mea-gold transition-all duration-300">
              <Avatar className="w-full h-full">
                <AvatarImage
                  src={member.image}
                  alt={member.name}
                  className={`${
                    member.name === "Varad Vinay Padhye" ? "object-cover object-top" :
                    member.name === "Avinash Chauhan" ? "object-cover object-top" :
                    member.name === "Nevedhya Jain" ? "object-cover object-top scale-150" :
                    member.name === "Sinchana Patil" ? "object-cover object-top scale-180" :
                    member.name === "Abhishek Sokhal" ? "object-contain" : "object-cover"
                  }`}
                />
                <AvatarFallback>
                  <UserRound className="w-12 h-12 text-muted-foreground" />
                </AvatarFallback>
              </Avatar>
            </div>
            <h3 className="text-lg font-semibold">{member.name}</h3>
            <p className="text-mea-gold font-medium text-sm mb-1">{member.position}</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">
              {member.department || member.year}
            </p>
            
            <div className="flex space-x-3 mt-2">
              {member.email && (
                <a 
                  href={`mailto:${member.email}`}
                  className="text-gray-500 dark:text-gray-400 hover:text-mea-gold transition-colors"
                  aria-label={`Email ${member.name}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Mail size={18} />
                </a>
              )}
              {member.linkedin && (
                <a 
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 dark:text-gray-400 hover:text-mea-gold transition-colors"
                  aria-label={`${member.name}'s LinkedIn profile`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Linkedin size={18} />
                </a>
              )}
              {member.instagram && (
                <a 
                  href={member.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 dark:text-gray-400 hover:text-mea-gold transition-colors"
                  aria-label={`${member.name}'s Instagram profile`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Instagram size={18} />
                </a>
              )}
            </div>
            
            <div className="absolute bottom-4 text-center w-full">
              <span className="text-xs font-medium text-mea-gold inline-flex items-center">
                Click to view bio
              </span>
            </div>
          </CardContent>
        </Card>
        
        {/* Back of Card */}
        <Card className="absolute w-full h-full backface-hidden rotate-y-180 cursor-pointer overflow-hidden">
          <CardContent className="p-6 h-full flex flex-col">
            <div className="mb-2 flex flex-col items-center">
              <h3 className="text-lg font-bold">{member.name}</h3>
              <p className="text-mea-gold font-medium text-sm">{member.position}</p>
            </div>
            
            <div className="flex-grow overflow-auto custom-scrollbar my-4">
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                {member.bio || "No bio available."}
              </p>
            </div>
            
            <div className="mt-auto pt-2 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-center gap-4">
                {member.email && (
                  <a 
                    href={`mailto:${member.email}`}
                    className="text-gray-500 hover:text-mea-gold transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Mail size={18} />
                  </a>
                )}
                {member.linkedin && (
                  <a 
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-mea-gold transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Linkedin size={18} />
                  </a>
                )}
                {member.instagram && (
                  <a 
                    href={member.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-mea-gold transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Instagram size={18} />
                  </a>
                )}
              </div>
              <div className="text-xs text-center text-gray-500 mt-2">
                {member.email}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const Team = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl">Our Team</CardTitle>
          <CardDescription>
            Meet the people behind the Mechanical Engineering Association
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {teamData.map((member) => (
              <TeamMemberCard key={member.id} member={member} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Team;
