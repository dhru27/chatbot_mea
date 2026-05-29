
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import GalleryGrid from "@/components/Gallery/GalleryGrid";

const Gallery = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl">Photo Gallery</CardTitle>
          <CardDescription>
            Explore memories from our events, workshops, and activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GalleryGrid />
        </CardContent>
      </Card>
    </div>
  );
};

export default Gallery;
