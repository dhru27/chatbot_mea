// 

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar, Search, FileText, ChevronLeft, X, ChevronRight, ChevronLeft as ChevronLeftIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Sample blog posts
const blogPosts = [
  {
    id: 1,
    title: "MechXplor - Episode 3 - The New Fastest Car in the World",
    excerpt: "You may have heard about the Yangwang U9, which is dethroning practically all the records that any racing car has achieved to date. But what makes the car so lithe and powerful, all while being energy-efficient? Read this episode to find out.",
    author: "MEA Editorial Team",
    date: "November 3, 2025",
    category: "MechXplor",
    readTime: "5 min read",
    image: "/blogs/mechexplor3/1.jpeg",
    images: [
      "/blogs/mechexplor3/1.jpeg",
      "/blogs/mechexplor3/2.jpeg",
      "/blogs/mechexplor3/3.jpeg",
      "/blogs/mechexplor3/4.jpeg",
      "/blogs/mechexplor3/5.jpeg",
      "/blogs/mechexplor3/6.jpeg"
    ]
  },
  {
    id: 2,
    title: "MechXplor - Episode 2 - 3D Printing of Liquid Rocket Engines",
    excerpt: "The episode shows how 3D printing is transforming rocket engine design, allowing engineers to print complex parts in one piece, cutting time, cost, and waste while creating lighter, stronger engines for the future of space travel.",
    author: "MEA Editorial Team",
    date: "November 3, 2025",
    category: "MechXplor",
    readTime: "5 min read",
    image: "/blogs/mechxplor2/1.jpeg",
    images: [
      "/blogs/mechxplor2/1.jpeg",
      "/blogs/mechxplor2/2.jpeg",
      "/blogs/mechxplor2/3.jpeg",
      "/blogs/mechxplor2/4.jpeg",
      "/blogs/mechxplor2/5.jpeg",
      "/blogs/mechxplor2/6.jpeg"
    ]
  },
  /*
  {
    id: 3,
    title: "Student Spotlight: Innovative Projects from the Graduating Batch",
    excerpt: "Highlighting the impressive final-year projects from our most recent batch of mechanical engineering graduates.",
    author: "Dr. Priya Patel",
    date: "March 22, 2023",
    category: "Projects",
    readTime: "6 min read",
    image: "/lovable-uploads/5f363352-0705-487a-baed-4c046690236b.png"
  },
  {
    id: 4,
    title: "Industry Collaboration: Bridging Academia and Professional Practice",
    excerpt: "How our department is working with industry partners to enhance student learning and research opportunities.",
    author: "Prof. Rajesh Kumar",
    date: "February 10, 2023",
    category: "Partnerships",
    readTime: "5 min read",
    image: "/lovable-uploads/e3fd6b91-d6bc-45ef-8ccf-7fd7292b928d.png"
  },
  {
    id: 5,
    title: "Alumni Success Story: From MEA to SpaceX",
    excerpt: "An inspiring journey of our alumnus who went from leading MEA initiatives to working on cutting-edge aerospace projects.",
    author: "Vikram Singh",
    date: "January 28, 2023",
    category: "Alumni",
    readTime: "7 min read",
    image: "/lovable-uploads/6b115935-67fc-4138-8a82-cf42108c1d16.png"
  }
  */
];

// Updated newsletters data with PDF URLs
const newslettersData = [
  {
    id: 1,
    title: "Freshie Booklet 25-26",
    content: "Everything a UG freshman needs to get started in the Institute - comprehensive guide for new students.",
    date: "August 2025",
    pdfUrl: "https://heyzine.com/flip-book/28c00a021d.html",
    isFlipbook: true
  },
  {
    id: 2,
    title: "MEA Newsletter 2024-25",
    content: "Comprehensive newsletter covering department activities, achievements, and highlights from the 2024-25 academic year.",
    date: "October 2025",
    pdfUrl: "https://heyzine.com/flip-book/f29bd1d583.html",
    isFlipbook: true
  },
  /*
  {
    id: 3,
    title: "Freshmen Introductory Booklet 24-25",
    content: "Anything and everything a UG freshmen needs to get started in the Insti.",
    date: "August 20, 2024",
    pdfUrl: "https://drive.google.com/file/d/1_5xQfWwkKnz_GDfCewDOCwlx-KdD8ixN/view?usp=drive_link"
  },
  {
    id: 4,
    title: "Mechanical Department Handbook",
    content: "Recap of events, research highlights, and department news from February 2023.",
    date: "August 20, 2024",
    pdfUrl: "https://drive.google.com/file/d/1Ysv1q5w6SNGOHnm6z_J58zmAteAY72ca/view?usp=drive_link"
  },
  {
    id: 5,
    title: "Department Annual Report 2024",
    content: "Comprehensive annual report covering all department activities, achievements, and future plans.",
    date: "December 15, 2024",
    pdfUrl: "https://drive.google.com/file/d/1rvmoje3AYXyh9E2qXI2k0h20p466OVNT/view?usp=drive_link"
  },
  {
    id: 6,
    title: "Student Activities Newsletter",
    content: "Monthly newsletter highlighting student achievements, events, and upcoming activities.",
    date: "November 30, 2024",
    pdfUrl: "#"
  },
  {
    id: 7,
    title: "Research Highlights Quarterly",
    content: "Quarterly publication showcasing the latest research projects and publications from faculty and students.",
    date: "October 15, 2024",
    pdfUrl: "#"
  }
  */
];

const InstagramPostViewer = ({ post, isOpen, onClose }: { post: any; isOpen: boolean; onClose: () => void }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex(0);
  }, [post]);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % post.images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + post.images.length) % post.images.length);
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  if (!post) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full h-[90vh] p-0 bg-black">
        <div className="relative w-full h-full flex">
          {/* Image Section */}
          <div className="relative flex-1 bg-black flex items-center justify-center">
            <img
              src={post.images[currentIndex]}
              alt={`${post.title} - Image ${currentIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />

            {/* Navigation Arrows */}
            {post.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                >
                  <ChevronLeftIcon size={24} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}

            {/* Image Counter */}
            {post.images.length > 1 && (
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {currentIndex + 1} / {post.images.length}
              </div>
            )}

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content Section - Instagram Style */}
          <div className="w-80 bg-white dark:bg-gray-900 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-mea-gold rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">M</span>
                </div>
                <div>
                  <div className="font-semibold text-sm">MEA IIT Bombay</div>
                  <div className="text-xs text-gray-500">MechXplor Series</div>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <span className="text-lg">⋯</span>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="mb-4">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-6 h-6 bg-mea-gold rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xs">M</span>
                  </div>
                  <span className="font-semibold text-sm">MEA IIT Bombay</span>
                </div>
                <p className="text-sm leading-relaxed">{post.excerpt}</p>
              </div>

              {/* Thumbnail Navigation */}
              {post.images.length > 1 && (
                <div className="flex space-x-1 mt-4 overflow-x-auto">
                  {post.images.map((image: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => goToImage(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden ${
                        index === currentIndex ? 'border-mea-gold' : 'border-gray-300'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t dark:border-gray-700">
              <div className="text-xs text-gray-500 mb-2">
                {post.date} • {post.readTime}
              </div>

              <div className="text-xs font-medium bg-mea-gold/10 text-mea-gold px-2 py-1 rounded-full inline-block">
                #{post.category}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Editorial = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeNewsletter, setActiveNewsletter] = useState<any>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedBlogPost, setSelectedBlogPost] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

  const filteredNewsletters = newslettersData.filter((newsletter) => 
    newsletter.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    newsletter.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (!activeNewsletter && filteredNewsletters.length > 0) {
      setActiveNewsletter(filteredNewsletters[0]);
    }
  }, [filteredNewsletters]);

  const handleNewsletterSelect = (newsletter: any) => {
    setActiveNewsletter(newsletter);
    if (isMobile) {
      setShowSidebar(false);
    }
  };

  const handleBlogPostClick = (post: any) => {
    if (post.images) {
      setSelectedBlogPost(post);
    }
  };

  const handleCloseImageViewer = () => {
    setSelectedBlogPost(null);
  };

  const getEmbedUrl = (url: string) => {
    if (url.includes('drive.google.com/file/d/')) {
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
          <CardTitle className="text-2xl sm:text-3xl">Editorial</CardTitle>
          <CardDescription>
            Explore our newsletters and research at Mechanical Engineering Department, IIT Bombay
            </CardDescription>
        </CardHeader>
        <CardContent className="px-3 sm:px-6">
          <Tabs defaultValue="blog">
            <TabsList className="grid w-full grid-cols-2 mb-6 sm:mb-8">
              <TabsTrigger value="blog">Research</TabsTrigger>
              <TabsTrigger value="newsletters">Newsletters</TabsTrigger>
            </TabsList>
            
            <TabsContent value="blog">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {blogPosts.map((post) => (
                  <Card
                    key={post.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                    onClick={() => handleBlogPostClick(post)}
                  >
                    <div className="h-40 sm:h-48 overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-wrap items-center mb-2">
                        <span className="text-xs font-medium bg-mea-gold/10 text-mea-gold px-2 py-1 rounded-full">{post.category}</span>
                        <span className="mx-2 text-gray-400">•</span>
                        <span className="text-xs text-gray-500">{post.readTime}</span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-semibold mb-2 line-clamp-2">{post.title}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-2 text-sm sm:text-base">{post.excerpt}</p>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                          <div className="font-medium text-sm">{post.author}</div>
                          <div className="text-xs text-gray-500">{post.date}</div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="self-end sm:self-auto"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBlogPostClick(post);
                          }}
                        >
                          {post.images ? 'View Images' : 'Read More'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="text-center mt-6 sm:mt-8">
                <Button>View All Posts</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="newsletters">
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search newsletters..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              
              <div className="lg:grid lg:grid-cols-4 lg:gap-6">
                {isMobile && !showSidebar && (
                  <div className="mb-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setShowSidebar(true)} 
                      className="flex items-center text-sm gap-1 w-full"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Back to Newsletter List
                    </Button>
                  </div>
                )}
                
                {(!isMobile || showSidebar) && (
                  <div className={`lg:col-span-1 border rounded-lg p-3 sm:p-4 dark:border-gray-700 mb-4 lg:mb-0 ${isMobile && activeNewsletter ? 'animate-in fade-in-0 zoom-in-95' : ''}`}>
                    <h3 className="font-medium mb-3 text-sm sm:text-base">Newsletters</h3>
                    {filteredNewsletters.length > 0 ? (
                      <ul className="space-y-1 sm:space-y-2">
                        {filteredNewsletters.map((newsletter) => (
                          <li key={newsletter.id}>
                            <button
                              onClick={() => handleNewsletterSelect(newsletter)}
                              className={`text-left w-full px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-sm ${
                                activeNewsletter?.id === newsletter.id 
                                  ? 'bg-mea-gold/10 text-mea-gold font-medium' 
                                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                              }`}
                            >
                              <div className="font-medium">{newsletter.title}</div>
                              <div className="text-xs text-gray-500 mt-1">{newsletter.date}</div>
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-gray-500 dark:text-gray-400 italic px-3 py-2 text-sm">
                        No newsletters match your search
                      </div>
                    )}
                  </div>
                )}
                
                {(!isMobile || (isMobile && !showSidebar && activeNewsletter)) && (
                  <div className={`lg:col-span-3 ${isMobile && !showSidebar ? 'animate-in fade-in-0 zoom-in-95' : ''}`}>
                    {activeNewsletter ? (
                      <div className="p-3 sm:p-6 border rounded-lg h-full dark:border-gray-700">
                        <div className="flex items-center mb-3 sm:mb-4">
                          <FileText className="text-mea-gold h-5 w-5 sm:h-6 sm:w-6 mr-2 flex-shrink-0" />
                          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold">{activeNewsletter.title}</h2>
                        </div>
                        
                        <div className="flex items-center text-mea-gold mb-3 sm:mb-4">
                          <Calendar className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                          <span className="text-sm sm:text-base">{activeNewsletter.date}</span>
                        </div>
                        
                        <p className="text-gray-700 dark:text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base">{activeNewsletter.content}</p>
                        
                        {activeNewsletter.pdfUrl !== "#" ? (
                          <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] border rounded overflow-hidden">
                            {activeNewsletter.isFlipbook ? (
                              <iframe 
                                src={activeNewsletter.pdfUrl} 
                                width="100%" 
                                height="100%" 
                                allow="autoplay"
                                className="border-0"
                                loading="lazy"
                                title={activeNewsletter.title}
                                style={{ border: 'none' }}
                              ></iframe>
                            ) : (
                              <iframe 
                                src={getEmbedUrl(activeNewsletter.pdfUrl)} 
                                width="100%" 
                                height="100%" 
                                allow="autoplay"
                                className="border-0"
                                loading="lazy"
                                title={activeNewsletter.title}
                              ></iframe>
                            )}
                          </div>
                        ) : (
                          <div className="w-full h-[250px] sm:h-[350px] md:h-[450px] border rounded bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                            <div className="text-center p-4">
                              <FileText className="h-8 w-8 sm:h-10 sm:w-10 mx-auto mb-3 sm:mb-4 text-mea-gold/60" />
                              <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">Newsletter preview not available</p>
                              <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 mt-1 sm:mt-2">{activeNewsletter.title}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-48 sm:h-64 border rounded-lg dark:border-gray-700">
                        <div className="text-center">
                          <FileText className="h-8 w-8 mx-auto mb-3 text-gray-300" />
                          <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">Select a newsletter to view its content</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Instagram-style Image Viewer */}
      <InstagramPostViewer
        post={selectedBlogPost}
        isOpen={!!selectedBlogPost}
        onClose={handleCloseImageViewer}
      />
    </div>
  );
};

export default Editorial;