
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import StatsSection from "@/components/StatsSection";
import LatestEvents from "@/components/LatestEvents";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <AboutSection />
      <StatsSection />
      <LatestEvents />
    </div>
  );
};

export default Index;
