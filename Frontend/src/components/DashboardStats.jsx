import { useState, useEffect } from "react";
import useQuery from "../api/useQuery";
import {
  ChartBarIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

export default function DashboardStats() {
  const { data: medications = [] } = useQuery("/medications", "medications");
  const { data: todaySchedule = [] } = useQuery(
    "/medications/schedule/today",
    "todaySchedule"
  );
  const { data: upcomingRefills = [] } = useQuery(
    "/refills/upcoming",
    "upcomingRefills"
  );

  // Calculate statistics
  const totalMedications = medications.length;
  const completedToday = todaySchedule.filter(
    (item) => item.status === "completed"
  ).length;
  const pendingToday = todaySchedule.filter(
    (item) => item.status === "pending" || item.status === "upcoming"
  ).length;
  const overdueToday = todaySchedule.filter(
    (item) => item.status === "overdue"
  ).length;
  const refillsNeeded = upcomingRefills.filter((refill) => {
    const refillDate = new Date(refill.refill_date);
    const today = new Date();
    const daysUntilRefill = Math.ceil(
      (refillDate - today) / (1000 * 60 * 60 * 24)
    );
    return daysUntilRefill <= 7; // Refills needed within a week
  }).length;

  const stats = [
    {
      title: "Total Medications",
      value: totalMedications,
      icon: ChartBarIcon,
      color: "bg-blue-500",
      textColor: "text-blue-600",
    },
    {
      title: "Completed Today",
      value: completedToday,
      icon: CheckCircleIcon,
      color: "bg-green-500",
      textColor: "text-green-600",
    },
    {
      title: "Pending Today",
      value: pendingToday,
      icon: ClockIcon,
      color: "bg-yellow-500",
      textColor: "text-yellow-600",
    },
    {
      title: "Refills Needed",
      value: refillsNeeded,
      icon: ExclamationTriangleIcon,
      color: "bg-red-500",
      textColor: "text-red-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <div key={index} className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base-content/60 text-sm font-medium">
                    {stat.title}
                  </p>
                  <p className={`text-3xl font-bold ${stat.textColor}`}>
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
