import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Timetable from "@/components/resources/Timetable";
import LabsList from "@/components/resources/LabsList";
import UsefulDocuments from "@/components/resources/UsefulDocuments";

const Resources = () => {
  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <Card className="mb-8">
        <CardHeader className="px-3 sm:px-6">
          <CardTitle className="text-2xl sm:text-3xl">Resources</CardTitle>
          <CardDescription>
            Access academic timetables, lab information, and useful documents
          </CardDescription>
        </CardHeader>
        <CardContent className="px-3 sm:px-6">
          <Tabs defaultValue="labs">
            <TabsList className="grid w-full grid-cols-3 mb-6 sm:mb-8 text-xs sm:text-sm">
              <TabsTrigger value="timetable">Timetable</TabsTrigger>
              <TabsTrigger value="labs">Labs Info</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>
            
            <TabsContent value="timetable">
              <Timetable />
            </TabsContent>
            
            <TabsContent value="labs">
              <LabsList />
            </TabsContent>
            
            <TabsContent value="documents">
              <UsefulDocuments />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Resources;
