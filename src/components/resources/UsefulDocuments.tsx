import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FileText, Download, BookOpen, GraduationCap, Wrench, Folder, ExternalLink } from "lucide-react";
import { useState } from "react";

// Sample document data
const documents = {
  "academic": [
    {
      id: 1,
      title: "UG curriculum 2024 onwards",
      type: "PDF",
      size: "2.4 MB",
      updated: "Aug 15, 2023",
      url: "https://www.me.iitb.ac.in/sites/default/files/UG-Curriculum-Mechanical-2024Batch-Onwards-Aug-2025.pdf"
    },
    {
      id: 2,
      title: "Academic Calendar",
      type: "PDF",
      size: "1.1 MB",
      updated: "Jul 20, 2023",
      url: "https://acad.iitb.ac.in/files/Academic%20Calendar%202025-26_FINAL.pdf"
    },
    // {
    //   id: 3,
    //   title: "Course Registration Guide",
    //   type: "PDF",
    //   size: "3.7 MB",
    //   updated: "Jul 25, 2023",
    //   url: "#"
    // },
    {
      id: 3,
      title: "Mech Sophomore Resume Repository",
      type: "FOLDER",
      size: "Google Drive",
      updated: "May 2024",
      url: "https://drive.google.com/drive/folders/1pVUY2o7LxqjIvjODknqTudbHCw6YNJ7O?usp=drive_link"
    },
    {
      id: 4,
      title: "Previous Exam Papers",
      type: "FOLDER",
      size: "Google Drive",
      updated: "Aug 5, 2023",
      url: "https://drive.google.com/drive/u/2/folders/1RHMC_CEmf-EYcWtf2b6Uij2wdHKd3NHL"
    }
  ],
  /*"research": [
    {
      id: 5,
      title: "Research Labs Overview",
      type: "PDF",
      size: "4.2 MB",
      updated: "Jun 10, 2023",
      url: "#"
    },
    {
      id: 6,
      title: "BTech Project Guidelines",
      type: "DOCX",
      size: "1.5 MB",
      updated: "Jul 12, 2023",
      url: "#"
    },
    {
      id: 7,
      title: "Publication Style Guide",
      type: "PDF",
      size: "2.1 MB",
      updated: "May 30, 2023",
      url: "#"
    }
  ],*/
  /*"technical": [
    {
      id: 8,
      title: "CAD Software Installation Guide",
      type: "PDF",
      size: "3.3 MB",
      updated: "Apr 18, 2023",
      url: "#"
    },
    {
      id: 9,
      title: "Lab Safety Manual",
      type: "PDF",
      size: "5.6 MB",
      updated: "Mar 22, 2023",
      url: "#"
    },
    {
      id: 10,
      title: "Machine Shop User Guide",
      type: "PDF",
      size: "4.7 MB",
      updated: "Jun 5, 2023",
      url: "#"
    }
  ],*/
};

const renderIcon = (docType: string) => {
  switch (docType) {
    case "PDF":
      return <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />;
    case "DOCX":
      return <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />;
    case "FOLDER":
      return <Folder className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />;
    default:
      return <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />;
  }
};

const UsefulDocuments = () => {
  const [activeTab, setActiveTab] = useState("academic"); // Default to academic since research and technical are commented out

  return (
    <Card className="w-full">
      <CardHeader className="px-3 sm:px-6 pb-2 sm:pb-6">
        <CardTitle className="text-xl sm:text-2xl">Useful Documents</CardTitle>
        <p className="text-sm text-gray-500 mt-1 block md:hidden">
          Swipe on documents to see all details
        </p>
      </CardHeader>
      <CardContent className="px-3 sm:px-6">
        <Tabs defaultValue="academic" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-1 mb-4 sm:mb-6 text-[11px] sm:text-xs">
            <TabsTrigger value="academic" className="flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5">
              <BookOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="inline text-[10px] sm:text-xs">Academic</span>
            </TabsTrigger>
            {/* Research tab commented out
            <TabsTrigger value="research" className="flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5">
              <GraduationCap className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="inline text-[10px] sm:text-xs">Research</span>
            </TabsTrigger>
            */}
            {/* Technical tab commented out
            <TabsTrigger value="technical" className="flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5">
              <Wrench className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="inline text-[10px] sm:text-xs">Technical</span>
            </TabsTrigger>
            */}
          </TabsList>
          
          <div className="overflow-x-auto">
            {Object.keys(documents).map((category) => (
              <TabsContent key={category} value={category} className="min-w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  {(documents as any)[category].map((doc: any) => (
                    <div key={doc.id} className="flex flex-row items-center justify-between p-3 sm:p-4 rounded-lg border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors gap-2 overflow-x-auto">
                      <div className="flex items-center min-w-0">
                        <div className="flex-shrink-0">
                          {renderIcon(doc.type)}
                        </div>
                        <div className="ml-3 mr-2 overflow-hidden">
                          <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm sm:text-base whitespace-nowrap text-ellipsis overflow-hidden">{doc.title}</h4>
                          <div className="flex flex-wrap items-center text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-1 gap-1">
                            <span className="rounded bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 inline-block">{doc.type}</span>
                            <span className="inline-block">{doc.size}</span>
                          </div>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost" className="flex-shrink-0 text-xs sm:text-sm h-8 sm:h-9" asChild>
                        <a href={doc.url} target={doc.type === "FOLDER" ? "_blank" : undefined} rel={doc.type === "FOLDER" ? "noopener noreferrer" : undefined} download={doc.type !== "FOLDER"}>
                          {doc.type === "FOLDER" ? (
                            <ExternalLink className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5" />
                          ) : (
                            <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5" />
                          )}
                          <span className="whitespace-nowrap">{doc.type === "FOLDER" ? "Open" : "Download"}</span>
                        </a>
                      </Button>
                    </div>
                  ))}
                </div>
                
                {/* Show empty state when no documents are available */}
                {(documents as any)[category].length === 0 && (
                  <div className="text-center py-8">
                    <FileText className="h-10 w-10 mx-auto text-gray-400" />
                    <p className="mt-2 text-gray-500">No documents available</p>
                  </div>
                )}
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default UsefulDocuments;
