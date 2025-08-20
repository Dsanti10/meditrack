import {
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  PlusIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import MedicationIcon from "@mui/icons-material/Medication";
import { useState } from "react";

export default function MyMedications() {
  const [medications, setMedications] = useState([
    {
      id: 1,
      name: "Metformin",
      dosage: "500mg",
      frequency: "Twice daily",
      timeSlots: ["8:00 AM", "8:00 PM"],
      currentStock: 5,
      status: "active",
      color: "primary",
      notes: "Take with meals to reduce stomach upset",
    },
    {
      id: 2,
      name: "Lisinopril",
      dosage: "10mg",
      frequency: "Once daily",
      timeSlots: ["8:00 AM"],
      currentStock: 12,
      status: "active",
      color: "secondary",
      notes: "Monitor blood pressure regularly",
    },
    {
      id: 3,
      name: "Atorvastatin",
      dosage: "20mg",
      frequency: "Once daily",
      timeSlots: ["9:00 PM"],
      currentStock: 20,
      status: "active",
      color: "accent",
      notes: "Take before bedtime",
    },
    {
      id: 4,
      name: "Vitamin D3",
      dosage: "1000 IU",
      frequency: "Once daily",
      timeSlots: ["8:00 AM"],
      currentStock: 8,
      status: "active",
      color: "success",
      notes: "Supplement - take with fatty meal",
    },
    {
      id: 5,
      name: "Aspirin",
      dosage: "81mg",
      frequency: "As needed",
      timeSlots: [],
      currentStock: 0,
      status: "paused",
      color: "warning",
      notes: "Low-dose for heart health - currently paused",
    },
  ]);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingMedication, setEditingMedication] = useState(null);

  // Form state for editing medications
  const [medicationForm, setMedicationForm] = useState({
    name: "",
    dosage: "",
    frequency: "Once daily",
    timeSlots: [],
    currentStock: 0,
    status: "active",
    color: "primary",
    notes: "",
  });

  const frequencyOptions = [
    "Once daily",
    "Twice daily",
    "Three times daily",
    "Four times daily",
    "As needed",
    "Every other day",
    "Weekly",
  ];

  const handleEditMedication = (medication) => {
    setMedicationForm(medication);
    setEditingMedication(medication);
    setIsEditModalOpen(true);
  };

  const handleSaveMedication = (e) => {
    e.preventDefault();

    setMedications(
      medications.map((med) =>
        med.id === editingMedication.id
          ? { ...medicationForm, id: editingMedication.id }
          : med
      )
    );

    setIsEditModalOpen(false);
    setEditingMedication(null);
  };

  const addTimeSlot = () => {
    const time = document.getElementById("editTimeSlot").value;
    if (time && !medicationForm.timeSlots.includes(time)) {
      setMedicationForm({
        ...medicationForm,
        timeSlots: [...medicationForm.timeSlots, time],
      });
      document.getElementById("editTimeSlot").value = "";
    }
  };

  const removeTimeSlot = (timeToRemove) => {
    setMedicationForm({
      ...medicationForm,
      timeSlots: medicationForm.timeSlots.filter(
        (time) => time !== timeToRemove
      ),
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: "badge badge-success",
      paused: "badge badge-warning",
      inactive: "badge badge-error",
    };
    return badges[status] || "badge badge-neutral";
  };

  const getStockIndicator = (stock) => {
    if (stock === 0)
      return { text: "Out of Stock", class: "text-error", bg: "bg-error/10" };
    if (stock <= 5)
      return { text: "Low Stock", class: "text-warning", bg: "bg-warning/10" };
    if (stock <= 15)
      return { text: "Medium Stock", class: "text-info", bg: "bg-info/10" };
    return { text: "Good Stock", class: "text-success", bg: "bg-success/10" };
  };

  const activeMedications = medications.filter(
    (med) => med.status === "active"
  ).length;
  const totalDoses = medications.reduce((total, med) => {
    return total + med.timeSlots.length;
  }, 0);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleAddMedication = () => {
    setMedicationForm({
      name: "",
      dosage: "",
      frequency: "Once daily",
      timeSlots: [],
      currentStock: 0,
      status: "active",
      color: "primary",
      notes: "",
    });
    setEditingMedication(null);
    setIsAddModalOpen(true);
  };

  const handleSaveNewMedication = (e) => {
    e.preventDefault();

    const newMedication = {
      ...medicationForm,
      id: Math.max(...medications.map((med) => med.id), 0) + 1,
    };

    setMedications([...medications, newMedication]);
    setIsAddModalOpen(false);
  };

  return (
    <div className="card bg-base-100 shadow-xl h-full">
      <div className="card-body p-4 sm:p-6 flex flex-col h-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 flex-shrink-0">
          <div className="mb-2 sm:mb-0">
            <h2 className="card-title text-lg sm:text-xl md:text-2xl mb-1 sm:mb-2">
              My Medications
            </h2>
            <p className="text-base-content/70 text-sm sm:text-base hidden sm:block">
              Current medication regimen
            </p>
          </div>
          <div className="flex gap-2">
            <button
              className="btn btn-primary btn-xs sm:btn-sm"
              onClick={handleAddMedication}
            >
              <PlusIcon className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Add Medication</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6 flex-shrink-0">
          <div className="stat bg-primary/10 rounded-lg p-2 sm:p-3 text-center">
            <div className="stat-value text-sm sm:text-xl text-primary">
              {activeMedications}
            </div>
            <div className="stat-title text-xs">Active</div>
          </div>
          <div className="stat bg-secondary/10 rounded-lg p-2 sm:p-3 text-center">
            <div className="stat-value text-sm sm:text-xl text-secondary">
              {totalDoses}
            </div>
            <div className="stat-title text-xs">Doses</div>
          </div>
          <div className="stat bg-accent/10 rounded-lg p-2 sm:p-3 text-center">
            <div className="stat-value text-sm sm:text-xl text-accent">
              {medications.filter((med) => med.currentStock <= 5).length}
            </div>
            <div className="stat-title text-xs">Low Stock</div>
          </div>
        </div>

        <div className="divider my-2 flex-shrink-0"></div>

        <div className="space-y-3 sm:space-y-4 flex-1 min-h-0 overflow-y-auto pr-1">
          {medications.map((medication) => {
            const stockInfo = getStockIndicator(medication.currentStock);
            return (
              <div
                key={medication.id}
                className="border border-base-300 rounded-lg p-3 sm:p-4 hover:bg-base-200 transition-colors"
              >
                <div className="flex items-start justify-between mb-2 sm:mb-3">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <div
                      className={`p-1.5 sm:p-2 md:p-3 rounded-lg bg-${medication.color}/20 flex-shrink-0`}
                    >
                      <MedicationIcon
                        className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-${medication.color}`}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-sm sm:text-base md:text-lg truncate">
                        {medication.name}
                      </h3>
                      <p className="text-base-content/70 text-xs sm:text-sm truncate">
                        {medication.dosage} • {medication.frequency}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1 sm:gap-2 flex-shrink-0">
                    <span
                      className={`${getStatusBadge(
                        medication.status
                      )} badge-xs sm:badge-sm`}
                    >
                      {medication.status}
                    </span>
                    <button
                      className="btn btn-ghost btn-xs"
                      onClick={() => handleEditMedication(medication)}
                    >
                      <PencilIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>

                {/* Time Slots */}
                {medication.timeSlots.length > 0 && (
                  <div className="mb-2 sm:mb-3">
                    <p className="text-xs sm:text-sm font-medium mb-1 sm:mb-2">
                      Scheduled Times:
                    </p>
                    <div className="flex gap-1 sm:gap-2 flex-wrap">
                      {medication.timeSlots.map((time, index) => (
                        <span
                          key={index}
                          className="badge badge-outline badge-xs sm:badge-sm"
                        >
                          <ClockIcon className="w-2 h-2 sm:w-3 sm:h-3 mr-1" />
                          {time}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stock Information */}
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`flex items-center gap-2 px-3 py-1 rounded-lg ${stockInfo.bg}`}
                  >
                    {medication.currentStock === 0 ? (
                      <ExclamationCircleIcon className="w-4 h-4 text-error" />
                    ) : (
                      <CheckCircleIcon className="w-4 h-4 text-success" />
                    )}
                    <span className={`text-sm font-medium ${stockInfo.class}`}>
                      {medication.currentStock} pills • {stockInfo.text}
                    </span>
                  </div>
                </div>

                {/* Notes */}
                {medication.notes && (
                  <div className="bg-base-200 rounded-lg p-3">
                    <p className="text-sm text-base-content/70">
                      <strong>Notes:</strong> {medication.notes}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="card-actions justify-between mt-4">
          <div className="flex gap-2">
            <button className="btn btn-primary btn-sm">Manage All</button>
          </div>
        </div>

        {/* Add Medication Modal */}
        {isAddModalOpen && (
          <div className="modal modal-open">
            <div className="modal-box max-w-xl">
              <h3 className="font-bold text-lg mb-4">Add New Medication</h3>

              <form onSubmit={handleSaveNewMedication} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Medication Name</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered"
                      value={medicationForm.name}
                      onChange={(e) =>
                        setMedicationForm({
                          ...medicationForm,
                          name: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Dosage</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered"
                      value={medicationForm.dosage}
                      onChange={(e) =>
                        setMedicationForm({
                          ...medicationForm,
                          dosage: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Frequency</span>
                  </label>
                  <select
                    className="select select-bordered"
                    value={medicationForm.frequency}
                    onChange={(e) =>
                      setMedicationForm({
                        ...medicationForm,
                        frequency: e.target.value,
                      })
                    }
                  >
                    {frequencyOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Scheduled Times</span>
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="time"
                      id="addTimeSlot"
                      className="input input-bordered flex-1"
                    />
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => {
                        const time =
                          document.getElementById("addTimeSlot").value;
                        if (time && !medicationForm.timeSlots.includes(time)) {
                          setMedicationForm({
                            ...medicationForm,
                            timeSlots: [...medicationForm.timeSlots, time],
                          });
                          document.getElementById("addTimeSlot").value = "";
                        }
                      }}
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {medicationForm.timeSlots.map((time, index) => (
                      <span key={index} className="badge badge-primary gap-2">
                        {time}
                        <button
                          type="button"
                          className="btn btn-xs btn-circle btn-ghost"
                          onClick={() => removeTimeSlot(time)}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Current Stock</span>
                    </label>
                    <input
                      type="number"
                      className="input input-bordered"
                      min="0"
                      value={medicationForm.currentStock}
                      onChange={(e) =>
                        setMedicationForm({
                          ...medicationForm,
                          currentStock: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Status</span>
                    </label>
                    <select
                      className="select select-bordered"
                      value={medicationForm.status}
                      onChange={(e) =>
                        setMedicationForm({
                          ...medicationForm,
                          status: e.target.value,
                        })
                      }
                    >
                      <option value="active">Active</option>
                      <option value="paused">Paused</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Notes</span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered h-20"
                    value={medicationForm.notes}
                    onChange={(e) =>
                      setMedicationForm({
                        ...medicationForm,
                        notes: e.target.value,
                      })
                    }
                  ></textarea>
                </div>

                <div className="modal-action">
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => setIsAddModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Add Medication
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Medication Modal */}
        {isEditModalOpen && (
          <div className="modal modal-open">
            <div className="modal-box max-w-xl">
              <h3 className="font-bold text-lg mb-4">Edit Medication</h3>

              <form onSubmit={handleSaveMedication} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Medication Name</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered"
                      value={medicationForm.name}
                      onChange={(e) =>
                        setMedicationForm({
                          ...medicationForm,
                          name: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Dosage</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered"
                      value={medicationForm.dosage}
                      onChange={(e) =>
                        setMedicationForm({
                          ...medicationForm,
                          dosage: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Frequency</span>
                  </label>
                  <select
                    className="select select-bordered"
                    value={medicationForm.frequency}
                    onChange={(e) =>
                      setMedicationForm({
                        ...medicationForm,
                        frequency: e.target.value,
                      })
                    }
                  >
                    {frequencyOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Scheduled Times</span>
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="time"
                      id="editTimeSlot"
                      className="input input-bordered flex-1"
                    />
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={addTimeSlot}
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {medicationForm.timeSlots.map((time, index) => (
                      <span key={index} className="badge badge-primary gap-2">
                        {time}
                        <button
                          type="button"
                          className="btn btn-xs btn-circle btn-ghost"
                          onClick={() => removeTimeSlot(time)}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Current Stock</span>
                    </label>
                    <input
                      type="number"
                      className="input input-bordered"
                      min="0"
                      value={medicationForm.currentStock}
                      onChange={(e) =>
                        setMedicationForm({
                          ...medicationForm,
                          currentStock: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Status</span>
                    </label>
                    <select
                      className="select select-bordered"
                      value={medicationForm.status}
                      onChange={(e) =>
                        setMedicationForm({
                          ...medicationForm,
                          status: e.target.value,
                        })
                      }
                    >
                      <option value="active">Active</option>
                      <option value="paused">Paused</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Notes</span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered h-20"
                    value={medicationForm.notes}
                    onChange={(e) =>
                      setMedicationForm({
                        ...medicationForm,
                        notes: e.target.value,
                      })
                    }
                  ></textarea>
                </div>

                <div className="modal-action">
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => setIsEditModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Update Medication
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
