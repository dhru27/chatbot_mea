
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { mclImages } from "./mclImages";
import { badmintonImages } from "./badmintonImages";
import { damanImages } from "./damanImages";

const baseImages = [
  {
    id: 1,
    category: "chess",
    year: "2024-25",
    src: "/lovable-uploads/chess2.webp",
    alt: "Chess Tournament",
    description: "Annual chess tournament organized by MEA"
  },
  {
    id: 2,
    category: "trip",
    year: "2023-24",
    src: "/lovable-uploads/deptrip.jpg",
    alt: "Department Trip",
    description: "Mechanical Department trip to nearby hills"
  },
  {
    id: 3,
    category: "sports",
    year: "2023-24",
    src: "/lovable-uploads/chess.webp",
    alt: "Sports Event",
    description: "Inter-department sports competition"
  },
  {
    id: 5,
    category: "chess",
    year: "2023-24",
    src: "/lovable-uploads/chess1.webp",
    alt: "Chess Tournament Winners",
    description: "Winners of the annual chess tournament"
  },
  {
    id: 6,
    category: "trip",
    year: "2023-24",
    src: "/lovable-uploads/grpphoto.jpg",
    alt: "Group Photo",
    description: "Group photo at the department trip"
  },
  {
    id: 7,
    category: "sports",
    year: "2023-24",
    src: "/lovable-uploads/football2.webp",
    alt: "Football Match",
    description: "Inter-department football match"
  }
];

const mclImagesWithAdjustedIds = mclImages.map((img, index) => ({
  ...img,
  id: 9 + index
}));

const badmintonImagesWithAdjustedIds = badmintonImages.map((img, index) => ({
  ...img,
  id: 9 + mclImages.length + index
}));

const damanImagesWithAdjustedIds = damanImages.map((img, index) => ({
  ...img,
  id: 9 + mclImages.length + badmintonImages.length + index
}));

// Sort images with randomized order for variety in All Years view
const sortImagesForDisplay = (images: typeof baseImages, selectedYear: string) => {
  if (selectedYear === "all") {
    // For All Years view: randomize order to create variety upfront
    const shuffledImages = [...images];

    // Fisher-Yates shuffle algorithm
    for (let i = shuffledImages.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledImages[i], shuffledImages[j]] = [shuffledImages[j], shuffledImages[i]];
    }

    return shuffledImages;
  } else {
    // For specific year views: sort by year (latest first)
    return images.sort((a, b) => {
      const yearA = a.year ? parseInt(a.year.split('-')[0]) : 0;
      const yearB = b.year ? parseInt(b.year.split('-')[0]) : 0;
      return yearB - yearA; // Descending order (newest first)
    });
  }
};

const allImages = [...baseImages, ...mclImagesWithAdjustedIds, ...badmintonImagesWithAdjustedIds, ...damanImagesWithAdjustedIds];

// LazyImage component for optimized image loading
interface LazyImageProps {
  src: string;
  alt: string;
  description?: string;
  year?: string;
  className?: string;
  onClick?: () => void;
}

const LazyImage = ({ src, alt, description, year, className, onClick }: LazyImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const maxRetries = 2;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px', // Increased for better UX
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
      observerRef.current = observer;
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    if (retryCount < maxRetries) {
      // Retry loading after a short delay
      setTimeout(() => {
        setRetryCount(prev => prev + 1);
        setHasError(false);
      }, 1000 * (retryCount + 1));
    } else {
      setHasError(true);
      setIsLoaded(true);
    }
  };

  // Generate optimized image URLs
  const getOptimizedSrc = (originalSrc: string) => {
    // Check if it's a gallery image that might have an optimized version
    if (originalSrc.includes('/images/')) {
      const pathParts = originalSrc.split('/');
      const filename = pathParts[pathParts.length - 1];
      const dirname = pathParts[pathParts.length - 2];

      // Return optimized version if available
      return `/images/optimized/${dirname}/${filename.replace(/\.(jpg|jpeg|png)$/i, '_optimized.jpg')}`;
    }
    return originalSrc;
  };

  const optimizedSrc = getOptimizedSrc(src);

  return (
    <div
      ref={imgRef}
      className={`relative overflow-hidden aspect-square cursor-pointer group ${className}`}
      onClick={onClick}
    >
      {/* Skeleton placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-mea-gold rounded-full animate-spin"></div>
        </div>
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-sm">Failed to load image</p>
          </div>
        </div>
      )}

      {/* Actual image */}
      {isInView && (
        <img
          src={optimizedSrc}
          alt={alt}
          className={`w-full h-full object-cover transition-all duration-500 ${
            isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          } group-hover:scale-110`}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
          decoding="async"
        />
      )}

      {/* Retry indicator */}
      {retryCount > 0 && retryCount < maxRetries && (
        <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
          Retrying... ({retryCount}/{maxRetries})
        </div>
      )}

      {/* Overlay content */}
      {isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <h4 className="text-white font-medium text-sm leading-tight">{alt}</h4>
          {description && <p className="text-gray-200 text-xs mt-1 line-clamp-2">{description}</p>}
          {year && <p className="text-gray-300 text-xs mt-1">{year}</p>}
        </div>
      )}
    </div>
  );
};

const GalleryGrid = () => {
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [hoveredYear, setHoveredYear] = useState<string | null>(null);
  const [clickedYear, setClickedYear] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<typeof allImages[0] | null>(null);
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const imagesPerPage = 24; // Show 24 images per page for better performance

  const years = ["all", "2023-24", "2024-25", "2025-26"];
  const categories = [
    { id: "all", name: "All" },
    { id: "chess", name: "Chess" },
    { id: "trip", name: "Trips" },
    // { id: "sports", name: "Sports" },
    {id: "badminton", name: "Badminton"},
    { id: "cricket", name: "Cricket" },
    { id: "workshop", name: "Workshops" }
  ];

  const filteredImages = useMemo(() => {
    const filtered = allImages.filter(img => {
      const yearMatch = selectedYear === "all" || img.year === selectedYear;
      const categoryMatch = selectedCategory === "all" || img.category === selectedCategory;
      return yearMatch && categoryMatch;
    });
    return sortImagesForDisplay(filtered, selectedYear);
  }, [selectedYear, selectedCategory]); // Only recalculate when filters change

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedYear, selectedCategory]);

  // Pagination logic
  const totalPages = Math.ceil(filteredImages.length / imagesPerPage);
  const startIndex = (currentPage - 1) * imagesPerPage;
  const endIndex = startIndex + imagesPerPage;
  const currentImages = filteredImages.slice(startIndex, endIndex);

  const handleImageClick = (image: typeof allImages[0]) => {
    setSelectedImage(image);
    setOpen(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Smooth scroll to top of gallery
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleYearClick = (year: string) => {
    setSelectedYear(year);
    setSelectedCategory("all");
    if (year === "all") {
      setClickedYear(null);
    } else {
      setClickedYear(clickedYear === year ? null : year);
    }
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setClickedYear(null);
  };

  const shouldShowDropdown = (year: string) => {
    return year !== "all" && (hoveredYear === year || clickedYear === year);
  };

  return (
    <div>
      <style>
        {`
          @keyframes dropdownSlideIn {
            from {
              opacity: 0;
              transform: translateY(-8px) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
          
          @keyframes dropdownSlideOut {
            from {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
            to {
              opacity: 0;
              transform: translateY(-8px) scale(0.95);
            }
          }
          
          .dropdown-enter {
            animation: dropdownSlideIn 0.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          }
          
          .dropdown-exit {
            animation: dropdownSlideOut 0.15s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          }
        `}
      </style>

      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {years.map(year => (
          <div
            key={year}
            className="relative"
            onMouseEnter={() => setHoveredYear(year)}
            onMouseLeave={() => setHoveredYear(null)}
          >
            <button
              onClick={() => handleYearClick(year)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ease-out transform hover:scale-105 active:scale-95 ${
                selectedYear === year 
                  ? 'bg-mea-gold text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
              }`}
            >
              {year === "all" ? "All Years" : year}
            </button>
            
            {shouldShowDropdown(year) && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-10 min-w-[150px] dropdown-enter">
                <div className="py-1">
                  {categories.slice(1).map((category, index) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryClick(category.id)}
                      className={`w-full text-left px-3 py-2 text-sm transition-all duration-150 ease-out transform hover:scale-[1.02] hover:bg-gray-50 ${
                        selectedCategory === category.id 
                          ? 'bg-mea-gold text-white shadow-sm' 
                          : 'text-gray-700'
                      }`}
                      style={{
                        animationDelay: `${index * 30}ms`
                      }}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedCategory !== "all" && (
        <div className="flex justify-center mb-4">
          <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full transition-all duration-200 ease-out transform hover:scale-105">
            Showing {selectedCategory} from {selectedYear === "all" ? "all years" : selectedYear}
          </span>
        </div>
      )}

      {/* Image count display */}
      <div className="flex justify-center mb-4">
        <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
          Showing {startIndex + 1}-{Math.min(endIndex, filteredImages.length)} of {filteredImages.length} images
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {currentImages.map(image => (
          <LazyImage
            key={image.id}
            src={image.src}
            alt={image.alt}
            description={image.description}
            year={image.year}
            onClick={() => handleImageClick(image)}
          />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            Previous
          </button>

          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(page => {
                // Show first page, last page, current page, and pages around current
                return page === 1 ||
                       page === totalPages ||
                       (page >= currentPage - 1 && page <= currentPage + 1);
              })
              .map((page, index, array) => {
                // Add ellipsis if there's a gap
                if (index > 0 && page - array[index - 1] > 1) {
                  return (
                    <span key={`ellipsis-${page}`} className="px-2 py-1">
                      ...
                    </span>
                  );
                }

                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 rounded-lg border transition-colors ${
                      currentPage === page
                        ? 'bg-mea-gold text-white border-mea-gold'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            Next
          </button>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-3xl p-0 overflow-hidden bg-black">
          {selectedImage && (
            <div>
              <img 
                src={selectedImage.src} 
                alt={selectedImage.alt} 
                className="w-full h-auto max-h-[80vh] object-contain"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-4">
                <h3 className="text-white text-lg font-medium">{selectedImage.alt}</h3>
                <p className="text-gray-300">{selectedImage.description}</p>
                <p className="text-gray-400 text-sm mt-1">{selectedImage.year}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GalleryGrid;
