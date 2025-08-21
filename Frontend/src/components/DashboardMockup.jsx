import { useEffect, useState } from "react";
import TodayScheduleMockup from "./TodayScheduleMockup";

export default function DashboardMockup({ className = "" }) {
  const [previewTheme, setPreviewTheme] = useState("light");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={`w-full max-w-6xl ${className}`} data-theme={previewTheme}>
      <div className="mockup-browser border bg-base-300">
        <div className="mockup-browser-toolbar">
          <div className="input">https://app.meditrack.local/dashboard</div>
          <div className="ml-auto join">
            <button
              className={`join-item btn btn-xs ${
                previewTheme === "light" ? "btn-primary" : "btn-ghost"
              }`}
              onClick={(e) => {
                e.preventDefault();
                setPreviewTheme("light");
              }}
            >
              Light
            </button>
            <button
              className={`join-item btn btn-xs ${
                previewTheme === "dark" ? "btn-primary" : "btn-ghost"
              }`}
              onClick={(e) => {
                e.preventDefault();
                setPreviewTheme("dark");
              }}
            >
              Dark
            </button>
          </div>
        </div>
        <div className="bg-base-200 p-2 sm:p-4">
          <div className="rounded-box bg-base-100 overflow-hidden">
            <div className="p-3 sm:p-4 space-y-4">
              {loading ? (
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                    <div className="card bg-base-100 shadow">
                      <div className="card-body">
                        <div className="skeleton h-5 w-32 mb-3" />
                        <div className="skeleton h-4 w-full mb-2" />
                        <div className="skeleton h-4 w-5/6" />
                      </div>
                    </div>
                    <div className="card bg-base-100 shadow">
                      <div className="card-body">
                        <div className="skeleton h-5 w-40 mb-3" />
                        <div className="skeleton h-4 w-full mb-2" />
                        <div className="skeleton h-4 w-4/6" />
                      </div>
                    </div>
                  </div>
                  <div className="card bg-base-100 shadow">
                    <div className="card-body">
                      <div className="skeleton h-5 w-48 mb-3" />
                      <div className="skeleton h-16 w-full" />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <TodayScheduleMockup />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
