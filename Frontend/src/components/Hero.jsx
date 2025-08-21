import DashboardMockup from "./DashboardMockup";

export default function Hero() {
  return (
    <section className="bg-base-200 w-full">
      <div className="flex flex-col items-center w-full px-4 py-16 md:py-50">
        <div className="flex flex-col items-center md:w-full mb-10 md:mb-0">
          <h1 className="text-4xl md:text-5xl font-bold text-base-content mb-10 animate-fade-in animate-duration-700">
            Never Miss Your Medication Again
          </h1>
          <p className="text-lg text-base-content/70 mb-30">
            MediTrack's web platform helps you manage your medications with
            personalized reminders, refill alerts, and health tracking -
            accessible from any device, anywhere.
          </p>
          <div className="w-full flex flex-col items-center animate-fade-in-up animate-duration-700 animate-ease-in-out animate-delay-75 mb-0">
            <DashboardMockup />
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
      className="text-primary-content"
    >
      <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"></path>
      <path d="m8.5 8.5 7 7"></path>
    </svg>
  );
}
