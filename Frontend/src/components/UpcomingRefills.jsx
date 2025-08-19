import {
  ExclamationTriangleIcon,
  ClockIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";

export default function UpcomingRefills() {
  const refills = [
    {
      id: 1,
      medication: "Metformin 500mg",
      currentStock: 5,
      daysLeft: 3,
      refillDate: "2025-08-15",
      priority: "high",
      pharmacy: "CVS Pharmacy",
      prescriptionNumber: "RX123456",
    },
    {
      id: 2,
      medication: "Lisinopril 10mg",
      currentStock: 12,
      daysLeft: 7,
      refillDate: "2025-08-19",
      priority: "medium",
      pharmacy: "Walgreens",
      prescriptionNumber: "RX789012",
    },
    {
      id: 3,
      medication: "Vitamin D3",
      currentStock: 8,
      daysLeft: 5,
      refillDate: "2025-08-17",
      priority: "medium",
      pharmacy: "CVS Pharmacy",
      prescriptionNumber: "RX345678",
    },
    {
      id: 4,
      medication: "Atorvastatin 20mg",
      currentStock: 20,
      daysLeft: 14,
      refillDate: "2025-08-26",
      priority: "low",
      pharmacy: "Target Pharmacy",
      prescriptionNumber: "RX901234",
    },
  ];

  const getPriorityBadge = (priority) => {
    const badges = {
      high: "badge badge-error",
      medium: "badge badge-warning",
      low: "badge badge-success",
    };
    return badges[priority] || "badge badge-neutral";
  };

  const getPriorityIcon = (priority) => {
    if (priority === "high") {
      return <ExclamationTriangleIcon className="w-4 h-4" />;
    }
    return <ClockIcon className="w-4 h-4" />;
  };

  const getStockStatus = (stock) => {
    if (stock <= 5) return { text: "Low Stock", class: "text-error" };
    if (stock <= 10) return { text: "Medium Stock", class: "text-warning" };
    return { text: "Good Stock", class: "text-success" };
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="card-title text-2xl mb-2">Upcoming Refills</h2>
            <p className="text-base-content/70">
              Monitor your medication inventory
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2">
              <div className="badge badge-error">2 urgent</div>
              <div className="badge badge-warning">1 soon</div>
            </div>
          </div>
        </div>

        <div className="divider my-2"></div>

        <div className="space-y-3 max-h-80 overflow-y-auto">
          {refills.map((refill) => {
            const stockStatus = getStockStatus(refill.currentStock);
            return (
              <div
                key={refill.id}
                className={`p-4 rounded-lg border transition-colors hover:bg-base-200 ${
                  refill.priority === "high"
                    ? "border-error bg-error/5"
                    : refill.priority === "medium"
                    ? "border-warning bg-warning/5"
                    : "border-base-300"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">
                        {refill.medication}
                      </h3>
                      <span className={getPriorityBadge(refill.priority)}>
                        <div className="flex items-center gap-1">
                          {getPriorityIcon(refill.priority)}
                          {refill.priority}
                        </div>
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-base-content/70">Current Stock</p>
                        <p className={`font-bold ${stockStatus.class}`}>
                          {refill.currentStock} pills ({stockStatus.text})
                        </p>
                      </div>
                      <div>
                        <p className="text-base-content/70">Days Remaining</p>
                        <p className="font-bold">{refill.daysLeft} days</p>
                      </div>
                      <div>
                        <p className="text-base-content/70">Refill Date</p>
                        <p className="font-bold">
                          {new Date(refill.refillDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-base-content/70">Pharmacy</p>
                        <p className="font-bold">{refill.pharmacy}</p>
                      </div>
                    </div>

                    <p className="text-xs text-base-content/50 mt-2">
                      Prescription: {refill.prescriptionNumber}
                    </p>
                  </div>

                  <div className="gap-2">
                    <button className="btn btn-outline btn-sm">
                      Set Reminder
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="card-actions justify-between mt-4">
          <button className="btn btn-ghost btn-sm">View All Medications</button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-2 mt-4">
          <div className="stat bg-error/10 rounded-lg">
            <div className="stat-value text-lg text-error">2</div>
            <div className="stat-title text-xs">Critical</div>
          </div>
          <div className="stat bg-warning/10 rounded-lg">
            <div className="stat-value text-lg text-warning">1</div>
            <div className="stat-title text-xs">Soon</div>
          </div>
          <div className="stat bg-success/10 rounded-lg">
            <div className="stat-value text-lg text-success">1</div>
            <div className="stat-title text-xs">Good</div>
          </div>
          <div className="stat bg-info/10 rounded-lg">
            <div className="stat-value text-lg text-info">4</div>
            <div className="stat-title text-xs">Total</div>
          </div>
        </div>
      </div>
    </div>
  );
}
