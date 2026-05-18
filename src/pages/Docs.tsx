import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, FileText, ChevronLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

// Updated documentation data based on the image
const docsData = {
  rulebooks: [
    {
      id: 1,
      title: "Department Constitution",
      content: "The Department Constitution outlines the governance structure, roles, and responsibilities within the Mechanical Engineering Department.",
      pdfUrl: "https://drive.google.com/file/d/1Zx7aC9RrW5fsqRwObe40cp3YY7f-_b0b/preview"
    },
    {
      id: 2,
      title: "UG Rulebook",
      content: "The Undergraduate Rulebook contains guidelines, policies, and procedures for undergraduate students in the Mechanical Engineering Department.",
      pdfUrl: "https://drive.google.com/file/d/1_5xQfWwkKnz_GDfCewDOCwlx-KdD8ixN/view?usp=drive_link"
    },
    {
      id: 3,
      title: "Masters Rulebook",
      content: "The Masters Rulebook provides information on programs, requirements, and procedures for master's degree students in Mechanical Engineering.",
      pdfUrl: "https://drive.google.com/file/d/1Ysv1q5w6SNGOHnm6z_J58zmAteAY72ca/view?usp=drive_link"
    },
    {
      id: 4,
      title: "PhD Rulebook",
      content: "The PhD Rulebook outlines the requirements, procedures, and guidelines for doctoral students in the Mechanical Engineering Department.",
      pdfUrl: "https://drive.google.com/file/d/1rvmoje3AYXyh9E2qXI2k0h20p466OVNT/view?usp=drive_link"
    }
  ],
  guidelines: [
    /*{
      id: 5,
      title: "Project-based Course Guidelines",
      content: "These guidelines provide information on how project-based courses are structured and evaluated in the Mechanical Engineering Department.",
      pdfUrl: "#"
    },
    {
      id: 6,
      title: "UGAC Booklets",
      content: "UGAC (Undergraduate Academic Committee) booklets containing information on undergraduate academic matters.",
      pdfUrl: "https://lnk.bio/CareerCell"
    },*/
    {
      id: 7,
      title: "Univ Intern Booklet",
      content: "The University Internship Booklet provides information on internship opportunities, procedures, and requirements for students.",
      pdfUrl: "https://drive.google.com/file/d/1ga1ZHs3ZL6QnZiFKWMnyVjoCAXCVqFlB/view?usp=drive_link"
    },
    {
      id: 8,
      title: "Internship Guide 101",
      content: "A comprehensive guide to help students navigate the internship process from application to completion.",
      pdfUrl: "https://drive.google.com/file/d/1_5H-I7K1BbgDCbBxZbBe14G87rKAdN4j/view?usp=drive_link"
    }
  ],
  miscellaneous: [
    {
      id: 9,
      title: "Core Resume Repository",
      content: "A collection of resume templates and examples for students in the Mechanical Engineering Department.",
      pdfUrl: "#"
    },
    {
      id: 10,
      title: "DCAMP Previous Year Resume Repos",
      content: "Repository of resumes from previous years' DCAMP (Department Campus Placement) activities.",
      pdfUrl: "https://drive.google.com/drive/u/2/folders/1pVUY2o7LxqjIvjODknqTudbHCw6YNJ7O"
    },
    {
      id: 11,
      title: "ISCP Handbook",
      content: "The Institute Student Companion Program (ISCP) handbook provides guidance for student mentors and mentees.",
      pdfUrl: "#"
    },
    {
      id: 12,
      title: "Retagging norms",
      content: "Guidelines for the retagging process for courses and academic records.",
      pdfUrl: "#"
    }
  ],
  forms: [
    {
      id: 14,
      title: "Student Application Form",
      // content: "Application forms for various student programs, scholarships, and activities in the department.",
      pdfUrl: "https://acad.iitb.ac.in/files/Studentsapplicationnewform_0.pdf"
    }
  ]
};

const Docs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeDoc, setActiveDoc] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState("rulebooks"); // Default to rulebooks since misc is commented out
  const [showSidebar, setShowSidebar] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Check if on mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setShowSidebar(true);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Filter docs based on search term
  const filteredDocs = (docsData as any)[activeCategory].filter((doc: any) => 
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Select the first doc by default if none is selected
  useEffect(() => {
    if (!activeDoc && filteredDocs.length > 0) {
      setActiveDoc(filteredDocs[0]);
    }
  }, [activeCategory, filteredDocs]);

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setActiveDoc(null);
    if (isMobile) {
      setShowSidebar(true);
    }
  };

  // Handle doc selection
  const handleDocSelect = (doc: any) => {
    setActiveDoc(doc);
    // On mobile, when a document is selected, hide the sidebar to focus on content
    if (isMobile) {
      setShowSidebar(false);
    }
  };

  // Format PDF URL for embedding
  const getEmbedUrl = (url: string) => {
    if (url.includes('drive.google.com/file/d/')) {
      // Extract the file ID and convert to embed URL
      const fileId = url.match(/\/d\/([^\/]+)/);
      if (fileId && fileId[1]) {
        return `https://drive.google.com/file/d/${fileId[1]}/preview`;
      }
    }
    return url;
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl sm:text-3xl">Documentation</CardTitle>
          <CardDescription>
            Access rulebooks and guidelines
          </CardDescription>
        </CardHeader>
        <CardContent className="px-3 sm:px-6">
          <Tabs value={activeCategory} onValueChange={handleCategoryChange}>
            <TabsList className="grid w-full grid-cols-3 mb-6 sm:mb-8 text-xs sm:text-sm">
              <TabsTrigger value="rulebooks">Rulebooks</TabsTrigger>
              <TabsTrigger value="guidelines">Guidelines</TabsTrigger>
              <TabsTrigger value="forms">Forms</TabsTrigger>
              {/* <TabsTrigger value="miscellaneous">Misc</TabsTrigger> */}
            </TabsList>
            
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search documentation..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <div className="lg:grid lg:grid-cols-4 lg:gap-6">
              {/* Mobile View: Toggle Button to show sidebar */}
              {isMobile && !showSidebar && (
                <div className="mb-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowSidebar(true)} 
                    className="flex items-center text-sm gap-1 w-full"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Back to Document List
                  </Button>
                </div>
              )}
              
              {/* Sidebar */}
              {(!isMobile || showSidebar) && (
                <div className={`lg:col-span-1 border rounded-lg p-3 sm:p-4 dark:border-gray-700 mb-4 lg:mb-0 ${isMobile && activeDoc ? 'animate-in fade-in-0 zoom-in-95' : ''}`}>
                  <h3 className="font-medium mb-3 text-sm sm:text-base">Table of Contents</h3>
                  {filteredDocs.length > 0 ? (
                    <ul className="space-y-1 sm:space-y-2">
                      {filteredDocs.map((doc: any) => (
                        <li key={doc.id}>
                          <button
                            onClick={() => handleDocSelect(doc)}
                            className={`text-left w-full px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-sm ${
                              activeDoc?.id === doc.id 
                                ? 'bg-mea-gold/10 text-mea-gold font-medium' 
                                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                            }`}
                          >
                            {doc.title}
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-gray-500 dark:text-gray-400 italic px-3 py-2 text-sm">
                      No documents match your search
                    </div>
                  )}
                </div>
              )}
              
              {/* Document Content - PDF Embed */}
              {(!isMobile || (isMobile && !showSidebar && activeDoc)) && (
                <div className={`lg:col-span-3 ${isMobile && !showSidebar ? 'animate-in fade-in-0 zoom-in-95' : ''}`}>
                  {activeDoc ? (
                    <div className="p-3 sm:p-6 border rounded-lg h-full dark:border-gray-700">
                      <div className="flex items-center mb-3 sm:mb-4">
                        <FileText className="text-mea-gold h-5 w-5 sm:h-6 sm:w-6 mr-2 flex-shrink-0" />
                        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold">{activeDoc.title}</h2>
                      </div>
                      
                      <p className="text-gray-700 dark:text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base">{activeDoc.content}</p>
                      
                      {activeDoc.pdfUrl !== "#" ? (
                        activeCategory === "forms" ? (
                          <div className="flex items-center justify-center p-6 border rounded-lg bg-gray-50 dark:bg-gray-800">
                            <div className="text-center">
                              <FileText className="h-12 w-12 mx-auto mb-4 text-mea-gold" />
                              <h3 className="text-lg font-semibold mb-2">Download Form</h3>
                              <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">Click the button below to download or open the form</p>
                              <Button asChild className="bg-mea-gold hover:bg-mea-gold/90 text-black">
                                <a href={activeDoc.pdfUrl} target="_blank" rel="noopener noreferrer">
                                  Download Form
                                </a>
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] border rounded overflow-hidden">
                            <iframe
                              src={getEmbedUrl(activeDoc.pdfUrl)}
                              width="100%"
                              height="100%"
                              allow="autoplay"
                              className="border-0"
                              loading="lazy"
                              title={activeDoc.title}
                            ></iframe>
                          </div>
                        )
                      ) : (
                        <div className="w-full h-[250px] sm:h-[350px] md:h-[450px] border rounded bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                          <div className="text-center p-4">
                            <FileText className="h-8 w-8 sm:h-10 sm:w-10 mx-auto mb-3 sm:mb-4 text-mea-gold/60" />
                            <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">Document preview not available</p>
                            <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 mt-1 sm:mt-2">{activeDoc.title}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-48 sm:h-64 border rounded-lg dark:border-gray-700">
                      <div className="text-center">
                        <FileText className="h-8 w-8 mx-auto mb-3 text-gray-300" />
                        <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">Select a document to view its content</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Docs;
