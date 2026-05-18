
import { Card, CardContent } from "@/components/ui/card";

const AboutSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-mea-lightgray dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 relative inline-block">
            <span className="text-mea-darkblue dark:text-mea-lightblue">What is </span>
            <span className="text-mea-gold">MEA</span>
            <span className="text-mea-darkblue dark:text-mea-lightblue">?</span>
          </h2>
          <p className="max-w-4xl mx-auto text-lg text-gray-700 dark:text-gray-300">
            The Mechanical Engineering Association (MEA) is the bridge that brings the entire Mechanical family together—students, faculty, and alumni. We connect dreams with guidance, doubts with solutions, and opportunities with the people who deserve them, creating a bond that inspires growth and happiness.
          </p>
        </div>

        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="floating-card dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="pt-6">
              <h3 className="text-2xl font-semibold text-mea-gold mb-4 text-center">Values</h3>
              <p className="text-gray-700 dark:text-gray-300">
                At MEA, we value care, connection, and celebration. We are the bridge that turns fear into confidence, hesitation into action, and effort into achievement, all while building a community where everyone feels at home.
              </p>
            </CardContent>
          </Card>

          <Card className="floating-card dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="pt-6">
              <h3 className="text-2xl font-semibold text-mea-gold mb-4 text-center">Mission</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Our mission is to be the bridge that guides students through every challenge—be it academics, career worries, or life in Mechanical. We connect them to professors, alumni, and opportunities while hosting moments of joy and laughter to keep spirits high and minds refreshed.
              </p>
            </CardContent>
          </Card>

          <Card className="floating-card dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="pt-6">
              <h3 className="text-2xl font-semibold text-mea-gold mb-4 text-center">Vision</h3>
              <p className="text-gray-700 dark:text-gray-300">
                To create a family where no one feels left behind, where every doubt is met with guidance and every dream is met with opportunity. MEA is the bridge to a thriving, united Mechanical Engineering community where "Mech Machata Hai" becomes a legacy we all proudly carry forward.
              </p>
            </CardContent>
          </Card>
        </div> */}
      </div>
    </section>
  );
};

export default AboutSection;
