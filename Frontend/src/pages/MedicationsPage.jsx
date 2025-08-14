import { BeakerIcon, PlusIcon, FunnelIcon } from "@heroicons/react/24/outline";

export default function MedicationsPage() {
  return (
    <div className="min-h-screen bg-base-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Medications</h1>
            <p className="text-base-content/70">
              Manage your medication inventory and schedules
            </p>
          </div>
          <div className="flex gap-3">
            <button className="btn btn-outline">
              <FunnelIcon className="w-5 h-5" />
              Filter
            </button>
            <button className="btn btn-primary">
              <PlusIcon className="w-5 h-5" />
              Add Medication
            </button>
          </div>
        </div>

        {/* Medications Content */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">
              <BeakerIcon className="w-6 h-6" />
              All Medications
            </h2>
            <div className="h-96 flex items-center justify-center border-2 border-dashed border-base-300 rounded-lg">
              <div className="text-center">
                <BeakerIcon className="w-16 h-16 mx-auto text-base-300 mb-4" />
                <p className="text-lg font-semibold text-base-content/50">
                  Detailed Medications View
                </p>
                <p className="text-base-content/30">
                  Extended medication management interface
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
