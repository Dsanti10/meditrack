import {
  ClockIcon,
  ShoppingCartIcon,
  BellIcon,
} from "@heroicons/react/24/outline";

// Mock data for demonstration
const mockRefills = [
  {
    id: 1,
    name: "Lisinopril",
    nextRefill: "2025-08-22",
    remaining: 3,
    status: "urgent", // urgent, soon, ok
  },
  {
    id: 2,
    name: "Metformin",
    nextRefill: "2025-08-28",
    remaining: 7,
    status: "soon",
  },
  {
    id: 3,
    name: "Atorvastatin",
    nextRefill: "2025-09-10",
    remaining: 20,
    status: "ok",
  },
];

export default function RefillsPage() {
  return (
    <div className="min-h-screen bg-base-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Refills</h1>
            <p className="text-base-content/70">
              Track and manage medication refills
            </p>
          </div>
          <div className="flex gap-3">
            <button className="btn btn-outline">
              <BellIcon className="w-5 h-5" />
              Set Reminders
            </button>
          </div>
        </div>

        {/* Refills Content */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">
              <ClockIcon className="w-6 h-6" />
              Refill Management
            </h2>
            {mockRefills.length === 0 ? (
              <div className="h-60 flex items-center justify-center text-base-content/50">
                No medications need refills right now.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>Medication</th>
                      <th>Next Refill</th>
                      <th>Remaining</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockRefills.map((med) => (
                      <tr key={med.id}>
                        <td className="font-semibold">{med.name}</td>
                        <td>{med.nextRefill}</td>
                        <td>{med.remaining} days</td>
                        <td>
                          {med.status === "urgent" && (
                            <span className="badge badge-error">Urgent</span>
                          )}
                          {med.status === "soon" && (
                            <span className="badge badge-warning">Soon</span>
                          )}
                          {med.status === "ok" && (
                            <span className="badge badge-success">OK</span>
                          )}
                        </td>
                        <td className="flex gap-2">
                          <button className="btn btn-xs btn-outline">
                            <BellIcon className="w-4 h-4 mr-1" /> Reminder
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
