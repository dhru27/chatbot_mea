import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="hero-section py-24 md:py-36">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
            Welcome to the Mechanical Engineering Association
          </h1>
          <h2 className="text-xl md:text-3xl font-medium mb-8 text-amber-200">
            IIT Bombay
          </h2>
          <p className="text-lg mb-10 text-gray-200/90 max-w-2xl mx-auto">
            We connect students, faculty, and alumni to build a thriving community that inspires growth and innovation.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/events">
              <Button size="lg" className="bg-mea-gold hover:bg-amber-500 text-gray-900 font-semibold">Explore Events</Button>
            </Link>
            <Link to="/resources">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 hover:text-white">Access Resources</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;