import { ClockIcon, CheckIcon } from "lucide-react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="bg-base-200 w-full">
      <div className="container mx-auto px-4 py-16 md:py-40 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-10 md:mb-0">
          <h1 className="text-4xl md:text-5xl font-bold text-base-content mb-6">
            Never Miss Your Medication Again
          </h1>
          <p className="text-lg text-base-content/70 mb-8">
            MediTrack's web platform helps you manage your medications with
            personalized reminders, refill alerts, and health tracking -
            accessible from any device, anywhere.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/dashboard"
              className="btn px-6 py-7 bg-primary text-primary-content rounded-md hover:bg-primary-focus transition-colors text-lg font-medium shadow-lg shadow-primary/30 hover:shadow-primary/50"
            >
              Create Free Account
            </Link>
          </div>
          <div className="mt-8 flex items-center text-base-content/70">
            <CheckIcon className="h-5 w-5 text-success mr-2" />
            <span>No credit card required</span>
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <div className="relative w-full max-w-md shadow-xl rounded-xl bg-#121212 ">
            <div className="p-6 rounded-lg bg-base-100 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] border border-base-300 dark:border-primary/30 dark:shadow-[0_0_20px_rgba(var(--p)/0.3)]">
              <div className="flex items-center mb-6">
                <ClockIcon className="h-8 w-8 text-primary mr-3" />
                <h3 className="text-xl font-semibold">Medication Dashboard</h3>
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="flex items-center p-3 h-full w-full z-[1] opacity-90 rounded-xl inset-0.5 bg-[#323132] "
                  >
                    <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center mr-4">
                      <PillIcon />
                    </div>
                    <div>
                      <p className="font-medium text-base-600">
                        Medication {item}
                      </p>
                      <p className="text-sm text-base-400">8:00 AM • 1 pill</p>
                    </div>
                    <div className="ml-auto">
                      <div className="h-6 w-6 rounded-full bg-green-300 flex items-center justify-center">
                        <CheckIcon className="h-4 w-4 text-primary" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PillIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-shadow-white"
    >
      <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"></path>
      <path d="m8.5 8.5 7 7"></path>
    </svg>
  );
}
