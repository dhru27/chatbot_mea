
const statsData = [
  { value: "1400+", label: "Students" },
  { value: "60", label: "Faculty" },
  { value: "69", label: "Global Department Rank" },
  { value: "40+", label: "Labs" }
];

const StatsSection = () => {
  return (
    <section className="py-16 bg-mea-darkblue text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {statsData.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-5xl font-bold text-mea-gold mb-2">{stat.value}</div>
              <div className="text-lg font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
