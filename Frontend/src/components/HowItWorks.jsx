import React from "react";
import { UserPlus, Settings, Bell } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      icon: (
        <UserPlus className="h-8 w-8 text-base-content transition-colors duration-300 group-hover:text-primary" />
      ),
      title: "Create Your Account",
      description:
        "Sign up for MediTrack in seconds. No downloads required - just create your free account to get started.",
    },
    {
      icon: (
        <Settings className="h-8 w-8 text-base-content transition-colors duration-300 group-hover:text-primary" />
      ),
      title: "Set Up Your Profile",
      description:
        "Add your medications, dosages, and schedule to create your personalized medication plan.",
    },
    {
      icon: (
        <Bell className="h-8 w-8 text-base-content transition-colors duration-300 group-hover:text-primary" />
      ),
      title: "Receive Reminders",
      description:
        "Get browser notifications and email alerts when it's time to take your medication and track your adherence.",
    },
  ];

  return (
    <section id="how-it-works" className="py-35 md:py-60 bg-base-200 w-full">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-base-content mb-4">
            How MediTrack Works
          </h2>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            Getting started with MediTrack is simple. Follow these easy steps to
            begin managing your medications effectively.
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-8 max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={index}
              className="group flex-1 flex flex-col items-center text-center p-6 rounded-lg bg-base-100 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] border border-base-300 dark:border-primary/30 dark:shadow-[0_0_20px_rgba(var(--p)/0.3)]"
            >
              <div className="mb-4">{step.icon}</div>
              <h3 className="text-xl font-semibold text-base-content mb-2">
                {step.title}
              </h3>
              <p className="text-base-content/70">{step.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-16 text-center">
          <button className="btn px-6 py-7 bg-primary text-primary-content rounded-md hover:bg-primary-focus transition-colors text-lg font-medium shadow-lg shadow-primary/30 hover:shadow-primary/50">
            Get Started Now
          </button>
        </div>
      </div>
    </section>
  );
}
