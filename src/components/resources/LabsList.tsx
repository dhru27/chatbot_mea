import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ExternalLink, MapPin, User, Phone, Wrench } from "lucide-react";

// Sample labs data
const labsData = [
  {
    id: 1,
    name: "Acoustics and Hearing Laboratory",
    location: "ME Building",
    inCharge: "Prof Sripriya Ramamoorthy",
    equipment: "Multi-functional materials, noise cancellation, hearing research",
    contact: "ramamoor@iitb.ac.in",
    website: "#"
  },
  {
    id: 2,
    name: "Advanced Mechanical Testing Facility",
    location: "ME Building",
    inCharge: "Amber Srivastava",
    equipment: "Solid state joining, additive manufacturing, thermo-mechanical processing, microscopy",
    contact: "ashrivastava.me@iitb.ac.in",
    website: "#"
  },
  {
    id: 3,
    name: "Computational Fluid Dynamics Lab",
    location: "ME Building",
    inCharge: "Atul Sharma",
    equipment: "Computational fluid dynamics, multi-phase flows, fluid-structure interaction, energy harvesting",
    contact: "atulsharma@iitb.ac.in, head.me@iitb.ac.in, (+91)-22-25767505",
    website: "#"
  },
  {
    id: 4,
    name: "Computational Solid Mechanics Laboratory",
    location: "ME Building",
    inCharge: "Parag Tandaiya",
    equipment: "Mechanical response of materials, finite element method, molecular dynamics, DFT",
    contact: "parag.ut@iitb.ac.in",
    website: "#"
  },
  {
    id: 5,
    name: "Hybrid Additive Manufacturing Laboratory",
    location: "ME Building",
    inCharge: "Asim Tiwari",
    equipment: "Smart manufacturing, additive manufacturing algorithms, 3D microscopy, image analysis",
    contact: "asim.tewari@iitb.ac.in",
    website: "#"
  },
  {
    id: 6,
    name: "Laser Advanced Materials Laboratory",
    location: "ME Building",
    inCharge: "Deepak Marla",
    equipment: "Laser materials processing, micro-manufacturing, numerical process modeling, simulation",
    contact: "dmarla@iitb.ac.in",
    website: "#"
  },
  {
    id: 7,
    name: "Mechanics of Materials Laboratory",
    location: "ME Building",
    inCharge: "Krishna Jonnalagadda",
    equipment: "Mechanical behavior of materials, fracture mechanics, dynamic deformation, thin film mechanics",
    contact: "krishnajn@iitb.ac.in",
    website: "#"
  },
  {
    id: 8,
    name: "Microstructural Mechanics and Micro-forming Laboratory",
    location: "ME Building",
    inCharge: "Asim Tewari, Sushil Mishra",
    equipment: "Metal-forming, microstructure, materials modeling, additive manufacturing, 4D X-ray microscopy",
    contact: "asim.tewari@iitb.ac.in, sushil.mishra@iitb.ac.in",
    website: "#"
  },
  {
    id: 9,
    name: "Machine Tools Laboratory",
    location: "ME Building",
    inCharge: "RK Singh",
    equipment: "Micromachining, CNC machining, laser micromachining, sustainable microscale manufacturing",
    contact: "rsingh@iitb.ac.in",
    website: "#"
  },
  {
    id: 10,
    name: "National Centre For Aerospace Innovation and Research",
    location: "ME Building",
    inCharge: "Asim Tewari",
    equipment: "Smart manufacturing, additive manufacturing, image analysis, AI in manufacturing",
    contact: "asim.tewari@iitb.ac.in",
    website: "#"
  },
  {
    id: 11,
    name: "Refrigenation, air conditioning and cryogenics lab",
    location: "ME Building",
    inCharge: "Milind Atrey",
    equipment: "Cryocoolers, vapor compression, absorption systems, cooling towers, heat transfer",
    contact: "matrey@iitb.ac.in, +91-22-2576-7522, +91-22-2572-6875",
    website: "#"
  },
  {
    id: 12,
    name: "RAPID MANUFACTURING LABORATORY",
    location: "ME Building",
    inCharge: "K P Karunakaran",
    equipment: "Rapid manufacturing, CNC automation, 3D printing, hybrid layered manufacturing",
    contact: "karuna@iitb.ac.in",
    website: "#"
  },
  {
    id: 13,
    name: "Robotics Laboratory",
    location: "ME Building",
    inCharge: "Anirban Guha, Abhishek G, V. Kartik",
    equipment: "Robotics, human-robot interaction, assistive devices, machine learning in robotics",
    contact: "anirbanguha1@gmail.com, abhi.gupta@iitb.ac.in, vkartik@iitb.ac.in",
    website: "#"
  },
  {
    id: 14,
    name: "Scalable Algorithms and Numerical Methods in Computing Laboratory",
    location: "ME Building",
    inCharge: "Shivasubramanian Gopalakrishnan",
    equipment: "Computational fluid dynamics, multiphase flows, numerical methods, geophysical fluid dynamics",
    contact: "sgopalak@iitb.ac.in, +91-22-2576-7524",
    website: "#"
  },
  {
    id: 15,
    name: "Solid Mechanics Laboratory",
    location: "ME Building",
    inCharge: "Nitesh Yelve",
    equipment: "Vibration analysis, machinery diagnostics, structural health monitoring, composites",
    contact: "nitesh.yelve@iitb.ac.in",
    website: "#"
  },
  {
    id: 16,
    name: "Thermal hydraulics Test facility",
    location: "ME Building",
    inCharge: "Janani Sree Murallidharan",
    equipment: "Multiphase heat transfer, computational fluid dynamics, interface tracking, rod bundle heat transfer",
    contact: "js.murallidharan@iitb.ac.in",
    website: "#"
  },
  {
    id: 17,
    name: "Thermal Science Lab",
    location: "ME Building",
    inCharge: "Sandip Kumar Saha",
    equipment: "SS-PCM for electronics, thermochemical energy storage, Leidenfrost phenomenon simulation",
    contact: "",
    website: "#"
  },
  {
    id: 18,
    name: "Vibrational Spectroscopy Lab",
    location: "ME Building",
    inCharge: "Dipanshu Bansal",
    equipment: "Ultrafast vibrational spectroscopy, DSC/TGA, spectrometer, monochromator",
    contact: "dipanshu@iitb.ac.in",
    website: "#"
  },
  {
    id: 19,
    name: "Wave and Vibration Engineering (WaVE) Lab",
    location: "ME Building",
    inCharge: "Prof. Nitesh Prakash Yelve",
    equipment: "Vibration analysis, machinery fault diagnosis, product design, vibration reduction",
    contact: "nitesh.yelve@iitb.ac.in",
    website: "#"
  }
];

const LabCard = ({ lab }: { lab: any }) => {
  return (
    <Card className="mb-4 overflow-hidden">
      <CardContent className="p-4">
        <h3 className="font-medium text-lg mb-3">{lab.name}</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 mt-0.5 text-gray-500 flex-shrink-0" />
            <span>{lab.location}</span>
          </div>
          <div className="flex items-start gap-2">
            <User className="h-4 w-4 mt-0.5 text-gray-500 flex-shrink-0" />
            <span>{lab.inCharge}</span>
          </div>
          <div className="flex items-start gap-2">
            <Wrench className="h-4 w-4 mt-0.5 text-gray-500 flex-shrink-0" />
            <span>{lab.equipment}</span>
          </div>
          <div className="flex items-start gap-2">
            <Phone className="h-4 w-4 mt-0.5 text-gray-500 flex-shrink-0" />
            <span>{lab.contact}</span>
          </div>
        </div>
        <div className="mt-3 text-right">
          <Button variant="ghost" size="sm" asChild>
            <a href={lab.website} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-1" />
              View Details
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const LabsList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'ascending' | 'descending' } | null>(null);
  const [isMobileView, setIsMobileView] = useState(false);

  // Check for mobile view on component mount and window resize
  useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    checkMobileView();
    window.addEventListener('resize', checkMobileView);
    return () => window.removeEventListener('resize', checkMobileView);
  }, []);

  // Filter labs based on search term
  const filteredLabs = labsData.filter(lab => 
    lab.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lab.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lab.inCharge.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort function
  const sortedLabs = [...filteredLabs].sort((a, b) => {
    if (!sortConfig) return 0;
    
    const aValue = (a as any)[sortConfig.key];
    const bValue = (b as any)[sortConfig.key];
    
    if (aValue < bValue) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return (
    <Card className="w-full">
      <CardHeader className="px-3 sm:px-6 pb-2 sm:pb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4">
          <CardTitle className="text-xl sm:text-2xl">Mechanical Engineering Labs</CardTitle>
          <div className="relative w-full sm:w-64 mt-2 sm:mt-0">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search labs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-3 sm:px-6">
        {/* Mobile View - Card Layout */}
        <div className="md:hidden">
          {sortedLabs.length > 0 ? (
            sortedLabs.map(lab => (
              <LabCard key={lab.id} lab={lab} />
            ))
          ) : (
            <div className="text-center py-6 text-sm text-gray-500">
              No labs match your search criteria
            </div>
          )}
        </div>

        {/* Desktop View - Table Layout */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px] cursor-pointer" onClick={() => requestSort('name')}>
                  Lab Name
                  {sortConfig?.key === 'name' && (
                    <span className="ml-1">{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                  )}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => requestSort('location')}>
                  Location
                  {sortConfig?.key === 'location' && (
                    <span className="ml-1">{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                  )}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => requestSort('inCharge')}>
                  In-Charge
                  {sortConfig?.key === 'inCharge' && (
                    <span className="ml-1">{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                  )}
                </TableHead>
                <TableHead>Equipment</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead className="text-right">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedLabs.map((lab) => (
                <TableRow key={lab.id}>
                  <TableCell className="font-medium">{lab.name}</TableCell>
                  <TableCell>{lab.location}</TableCell>
                  <TableCell>{lab.inCharge}</TableCell>
                  <TableCell>{lab.equipment}</TableCell>
                  <TableCell>{lab.contact}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <a href={lab.website} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        View
                      </a>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredLabs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                    No labs match your search criteria
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default LabsList;
