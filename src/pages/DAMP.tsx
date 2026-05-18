
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const DAMP = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl">DAMP - Department Academic Mentorship Program</CardTitle>
          <CardDescription>
            A student-run mentorship program to help juniors navigate through academic challenges
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="about">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="about">About DAMP</TabsTrigger>
              <TabsTrigger value="mentors">Mentors</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
            </TabsList>
            
            <TabsContent value="about">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <h3 className="text-2xl font-semibold mb-4">What is DAMP?</h3>
                    <p className="text-gray-700 mb-4">
                      The Department Academic Mentorship Program (DAMP) is a student-run initiative in the Mechanical Engineering Department at IIT Bombay. It aims to create a support system for students, particularly freshmen and sophomores, to help them navigate their academic journey.
                    </p>
                    <p className="text-gray-700">
                      Through DAMP, senior students (mentors) guide junior students (mentees) in academic matters, course selection, study strategies, and other aspects of academic life at IIT Bombay.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-semibold mb-4">Our Mission</h3>
                    <p className="text-gray-700">
                      DAMP's mission is to facilitate a smooth academic transition for new students, promote academic excellence, and foster a collaborative learning environment within the Mechanical Engineering Department.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-semibold mb-4">Program Structure</h3>
                    <p className="text-gray-700 mb-4">
                      Each mentor is assigned a group of mentees, typically from the same year or with similar academic interests. Mentors meet with their mentees regularly to discuss academic progress, address concerns, and provide guidance.
                    </p>
                    <p className="text-gray-700">
                      DAMP also organizes department-wide events such as orientation sessions, study groups, and workshops on academic topics.
                    </p>
                  </div>
                </div>
                
                <div className="lg:col-span-1">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">Program Benefits</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-4">
                        <li className="flex items-start">
                          <div className="flex-shrink-0 h-6 w-6 rounded-full bg-mea-gold/20 text-mea-gold flex items-center justify-center mr-3 mt-0.5">
                            1
                          </div>
                          <p className="text-gray-700">
                            <span className="font-medium">Academic Guidance:</span> Get help with coursework, assignments, and exam preparation.
                          </p>
                        </li>
                        <li className="flex items-start">
                          <div className="flex-shrink-0 h-6 w-6 rounded-full bg-mea-gold/20 text-mea-gold flex items-center justify-center mr-3 mt-0.5">
                            2
                          </div>
                          <p className="text-gray-700">
                            <span className="font-medium">Course Selection:</span> Receive advice on elective courses and academic pathways.
                          </p>
                        </li>
                        <li className="flex items-start">
                          <div className="flex-shrink-0 h-6 w-6 rounded-full bg-mea-gold/20 text-mea-gold flex items-center justify-center mr-3 mt-0.5">
                            3
                          </div>
                          <p className="text-gray-700">
                            <span className="font-medium">Study Resources:</span> Access notes, previous years' question papers, and study materials.
                          </p>
                        </li>
                        <li className="flex items-start">
                          <div className="flex-shrink-0 h-6 w-6 rounded-full bg-mea-gold/20 text-mea-gold flex items-center justify-center mr-3 mt-0.5">
                            4
                          </div>
                          <p className="text-gray-700">
                            <span className="font-medium">Peer Network:</span> Connect with seniors and peers with similar academic interests.
                          </p>
                        </li>
                      </ul>
                      
                      <div className="mt-6">
                        <Button className="w-full bg-mea-gold hover:bg-amber-500">
                          Join as a Mentee
                        </Button>
                        <Button variant="outline" className="w-full mt-2">
                          Apply to be a Mentor
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="mentors">
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-semibold mb-4">Meet Our Mentors</h3>
                  <p className="text-gray-700 mb-6">
                    Our mentors are experienced students who have volunteered to guide juniors through their academic journey. They are well-versed in the department's curriculum and eager to share their knowledge and experiences.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Mentor cards would go here - using placeholder data */}
                    {[1, 2, 3, 4, 5, 6].map((id) => (
                      <Card key={id} className="hover:shadow-md transition-shadow duration-300">
                        <CardContent className="p-6">
                          <div className="flex items-center mb-4">
                            <div className="h-12 w-12 rounded-full bg-gray-200 mr-4"></div>
                            <div>
                              <h4 className="font-semibold">Mentor Name</h4>
                              <p className="text-sm text-gray-500">4th Year BTech</p>
                            </div>
                          </div>
                          <p className="text-gray-700 text-sm mb-3">
                            Specializes in Thermal Engineering and Fluid Mechanics. Has maintained a high CPI throughout the program.
                          </p>
                          <div className="text-sm text-gray-600">
                            <p><span className="font-medium">Courses:</span> ME101, ME201, ME301</p>
                            <p><span className="font-medium">Contact:</span> mentor@iitb.ac.in</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-2xl font-semibold mb-4">Become a Mentor</h3>
                  <p className="text-gray-700 mb-4">
                    If you're passionate about helping juniors navigate their academic journey, consider becoming a DAMP mentor. As a mentor, you'll have the opportunity to guide students, share your knowledge, and develop leadership skills.
                  </p>
                  <Button>Apply to Become a Mentor</Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="resources">
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-semibold mb-4">Academic Resources</h3>
                  <p className="text-gray-700 mb-6">
                    DAMP provides various resources to help students excel in their academic pursuits. These resources are curated by our mentors and are regularly updated.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-xl">Course Materials</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          {[1, 2,, 3, 4].map((id) => (
                            <li key={id} className="flex justify-between items-center p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                              <div>
                                <h4 className="font-medium">ME{id}01 - Course Name</h4>
                                <p className="text-sm text-gray-500">Lecture notes, tutorials, and practice problems</p>
                              </div>
                              <Button variant="ghost" size="sm" className="flex-shrink-0" asChild>
                                <a href="#" download>
                                  <Download className="h-4 w-4 mr-1" />
                                  <span>Download</span>
                                </a>
                              </Button>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-xl">Previous Year Papers</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          {[1, 2, 3, 4].map((id) => (
                            <li key={id} className="flex justify-between items-center p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                              <div>
                                <h4 className="font-medium">ME{id}01 - Course Name</h4>
                                <p className="text-sm text-gray-500">Mid-sem and End-sem papers (2019-2022)</p>
                              </div>
                              <Button variant="ghost" size="sm" className="flex-shrink-0" asChild>
                                <a href="#" download>
                                  <Download className="h-4 w-4 mr-1" />
                                  <span>Download</span>
                                </a>
                              </Button>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-2xl font-semibold mb-4">Study Guides</h3>
                  <p className="text-gray-700 mb-6">
                    Our mentors have prepared comprehensive study guides for various courses. These guides provide an overview of the course, important topics, study strategies, and recommended resources.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((id) => (
                      <Card key={id} className="hover:shadow-md transition-shadow duration-300">
                        <CardContent className="p-6">
                          <h4 className="font-semibold mb-2">Study Guide - Topic {id}</h4>
                          <p className="text-gray-700 text-sm mb-4">
                            A comprehensive guide to help you understand and excel in this subject area.
                          </p>
                          <Button variant="outline" size="sm" className="w-full" asChild>
                            <a href="#" download>
                              <Download className="h-4 w-4 mr-1" />
                              <span>Download Guide</span>
                            </a>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="schedule">
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-semibold mb-4">Mentorship Schedule</h3>
                  <p className="text-gray-700 mb-6">
                    DAMP mentorship sessions are scheduled throughout the semester. Check the schedule below to find when your mentor is available.
                  </p>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr>
                          <th className="border p-3 bg-gray-100 text-left">Day</th>
                          <th className="border p-3 bg-gray-100 text-left">Time</th>
                          <th className="border p-3 bg-gray-100 text-left">Mentor</th>
                          <th className="border p-3 bg-gray-100 text-left">Location</th>
                          <th className="border p-3 bg-gray-100 text-left">Topics</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { day: "Monday", time: "15:00 - 17:00", mentor: "Mentor 1", location: "ME Building, Room 101", topics: "ME101, ME201" },
                          { day: "Tuesday", time: "14:00 - 16:00", mentor: "Mentor 2", location: "ME Building, Room 102", topics: "ME301, ME401" },
                          { day: "Wednesday", time: "16:00 - 18:00", mentor: "Mentor 3", location: "ME Building, Room 103", topics: "ME501, ME601" },
                          { day: "Thursday", time: "15:00 - 17:00", mentor: "Mentor 4", location: "ME Building, Room 104", topics: "ME701, ME801" },
                          { day: "Friday", time: "14:00 - 16:00", mentor: "Mentor 5", location: "ME Building, Room 105", topics: "ME901, ME1001" }
                        ].map((session, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="border p-3">{session.day}</td>
                            <td className="border p-3">{session.time}</td>
                            <td className="border p-3">{session.mentor}</td>
                            <td className="border p-3">{session.location}</td>
                            <td className="border p-3">{session.topics}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-2xl font-semibold mb-4">Upcoming Events</h3>
                  <p className="text-gray-700 mb-6">
                    DAMP organizes various events throughout the semester, including orientation sessions, workshop, and study groups.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      { title: "Freshers' Orientation", date: "July 20, 2023", time: "10:00 AM", location: "ME Auditorium" },
                      { title: "Exam Preparation Workshop", date: "August 15, 2023", time: "2:00 PM", location: "ME Seminar Hall" },
                      { title: "Course Registration Guidance", date: "August 25, 2023", time: "11:00 AM", location: "ME Conference Room" }
                    ].map((event, index) => (
                      <Card key={index} className="hover:shadow-md transition-shadow duration-300">
                        <CardContent className="p-6">
                          <h4 className="font-semibold mb-2">{event.title}</h4>
                          <div className="text-sm text-gray-600 space-y-2">
                            <p><span className="font-medium">Date:</span> {event.date}</p>
                            <p><span className="font-medium">Time:</span> {event.time}</p>
                            <p><span className="font-medium">Location:</span> {event.location}</p>
                          </div>
                          <Button className="w-full mt-4 bg-mea-gold hover:bg-amber-500">
                            Register
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DAMP;
