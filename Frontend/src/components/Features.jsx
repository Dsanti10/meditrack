import { BellIcon, CalendarIcon, ClipboardListIcon } from "lucide-react";

export function Features() {
  const features = [
    {
      icon: (
        <BellIcon className="h-8 w-8 text-base-content transition-colors duration-300 group-hover:text-primary" />
      ),
      title: "Smart Reminders",
      description:
        "Get timely browser notifications and email alerts for your medication schedule, customized to your routine and preferences.",
    },
    {
      icon: (
        <CalendarIcon className="h-8 w-8 text-base-content transition-colors duration-300 group-hover:text-primary" />
      ),
      title: "Refill Tracking",
      description:
        "Never run out of your important medications with automatic refill reminders and prescription management.",
    },
    {
      icon: (
        <ClipboardListIcon className="h-8 w-8 text-base-content transition-colors duration-300 group-hover:text-primary" />
      ),
      title: "Medication Log",
      description:
        "Keep a detailed history of your medication intake, including missed doses and side effects.",
    },
  ];
  return (
    <section
      id="features"
      className="py-35 md:py-60 w-full bg-center bg-[url(../src/assets/medical.png)] bg-cover bg- bg-base-100 bg-blend-overlay bg-fixed"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-base-content mb-4">
            Features Designed for Your Health
          </h2>
          <p className="text-lg text-base-content max-w-2xl mx-auto">
            Our comprehensive medication management tools help you stay on track
            with your health goals.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 rounded-lg bg-base-100 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] border border-base-300 dark:border-primary/30 dark:shadow-[0_0_20px_rgba(var(--p)/0.3)]"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-base-content mb-2">
                {feature.title}
              </h3>
              <p className="text-base-content/70">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
