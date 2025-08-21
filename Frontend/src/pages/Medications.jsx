import {
  PlusIcon,
  FunnelIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import MedicationIcon from "@mui/icons-material/Medication";
import { useState } from "react";
import useQuery from "../api/useQuery";
import useMutation from "../api/useMutation";

export default function Medications() {
  const {
    data: medications = [],
    loading,
    error,
  } = useQuery("/medications", "medications");

  const createMedicationMutation = useMutation("POST", "/medications", [
    "medications",
  ]);
  const updateMedicationMutation = useMutation("PUT", "/medications", [
    "medications",
  ]);
  const deleteMedicationMutation = useMutation("DELETE", "/medications", [
    "medications",
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMedication, setEditingMedication] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Form state for adding/editing medications
  const [medicationForm, setMedicationForm] = useState({
    name: "",
    dosage: "",
    frequency: "Once daily",
    time_slots: [],
    current_stock: 0,
    status: "active",
    color: "primary",
    notes: "",
    prescribed_by: "",
    start_date: new Date().toISOString().split("T")[0],
    refills_remaining: 0,
    prescription_number: "",
    pharmacy: "",
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

  const colorOptions = [
    { value: "primary", label: "Blue" },
    { value: "secondary", label: "Green" },
    { value: "accent", label: "Purple" },
    { value: "success", label: "Teal" },
    { value: "warning", label: "Yellow" },
    { value: "info", label: "Sky" },
  ];

  const resetForm = () => {
    setMedicationForm({
      name: "",
      dosage: "",
      frequency: "Once daily",
      time_slots: [],
      current_stock: 0,
      status: "active",
      color: "primary",
      notes: "",
      prescribed_by: "",
      start_date: new Date().toISOString().split("T")[0],
      refills_remaining: 0,
      prescription_number: "",
      pharmacy: "",
    });
    setEditingMedication(null);
  };

  const handleAddMedication = () => {
    setIsAddModalOpen(true);
    resetForm();
  };

  const handleEditMedication = (medication) => {
    setMedicationForm(medication);
    setEditingMedication(medication);
    setIsAddModalOpen(true);
  };

  const handleDeleteMedication = async (medicationId) => {
    if (confirm("Are you sure you want to delete this medication?")) {
      try {
        const success = await deleteMedicationMutation.mutate(
          null,
          `/medications/${medicationId}`
        );
        if (success) {
          setToastMessage("Medication deleted successfully!");
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3000);
        } else {
          setToastMessage("Failed to delete medication. Please try again.");
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3000);
        }
      } catch (error) {
        console.error("Error deleting medication:", error);
        setToastMessage("An error occurred while deleting. Please try again.");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    }
  };

  const handleSaveMedication = async (e) => {
    e.preventDefault();

    try {
      if (editingMedication) {
        // Update existing medication - include ID in URL
        const { time_slots, ...medicationDataWithoutTimeSlots } =
          medicationForm;
        const success = await updateMedicationMutation.mutate(
          medicationDataWithoutTimeSlots,
          `/medications/${editingMedication.id}`
        );
        if (success) {
          setToastMessage("Medication updated successfully!");
          setShowToast(true);
          setIsAddModalOpen(false);
          resetForm();
          setTimeout(() => setShowToast(false), 3000);
        } else {
          setToastMessage("Failed to update medication. Please try again.");
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3000);
        }
      } else {
        // Add new medication
        const { time_slots, ...medicationDataWithoutTimeSlots } =
          medicationForm;
        const success = await createMedicationMutation.mutate(
          medicationDataWithoutTimeSlots
        );
        if (success) {
          // TODO: Handle time_slots creation separately if needed
          setToastMessage("Medication added successfully!");
          setShowToast(true);
          setIsAddModalOpen(false);
          resetForm();
          setTimeout(() => setShowToast(false), 3000);
        } else {
          setToastMessage("Failed to add medication. Please try again.");
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3000);
        }
      }
    } catch (error) {
      console.error("Error saving medication:", error);
      setToastMessage("An error occurred. Please try again.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const addTimeSlot = () => {
    const time = document.getElementById("timeSlot").value;
    if (time && !medicationForm.time_slots.includes(time)) {
      setMedicationForm({
        ...medicationForm,
        time_slots: [...medicationForm.time_slots, time],
      });
      document.getElementById("timeSlot").value = "";
    }
  };

  const removeTimeSlot = (timeToRemove) => {
    setMedicationForm({
      ...medicationForm,
      time_slots: medicationForm.time_slots.filter(
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

  // Filter medications based on search and status
  const filteredMedications = medications.filter((med) => {
    const matchesSearch =
      med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (med.prescribed_by &&
        med.prescribed_by.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === "all" || med.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const activeMedications = medications.filter(
    (med) => med.status === "active"
  ).length;
  const lowStockCount = medications.filter(
    (med) => med.current_stock <= 5
  ).length;
  const totalDoses = medications.reduce(
    (total, med) => total + (med.time_slots ? med.time_slots.length : 0),
    0
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-base-100 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-center h-96">
          <div className="loading loading-spinner loading-lg"></div>
          <p className="ml-4 text-lg">Loading medications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-base-100 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-center h-96">
          <div className="alert alert-error">
            <ExclamationCircleIcon className="w-6 h-6" />
            <span>Failed to load medications: {error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 p-6">
      <div className="max-w-7xl mx-auto">
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
            <button className="btn btn-primary" onClick={handleAddMedication}>
              <PlusIcon className="w-5 h-5" />
              Add Medication
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="stat bg-primary/10 rounded-lg p-4">
            <div className="stat-value text-2xl text-primary">
              {activeMedications}
            </div>
            <div className="stat-title text-sm">Active Medications</div>
          </div>
          <div className="stat bg-secondary/10 rounded-lg p-4">
            <div className="stat-value text-2xl text-secondary">
              {totalDoses}
            </div>
            <div className="stat-title text-sm">Daily Doses</div>
          </div>
          <div className="stat bg-warning/10 rounded-lg p-4">
            <div className="stat-value text-2xl text-warning">
              {lowStockCount}
            </div>
            <div className="stat-title text-sm">Low Stock Alerts</div>
          </div>
          <div className="stat bg-info/10 rounded-lg p-4">
            <div className="stat-value text-2xl text-info">
              {medications.length}
            </div>
            <div className="stat-title text-sm">Total Medications</div>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="card bg-base-100 shadow-lg mb-6">
          <div className="card-body py-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="form-control flex-1">
                <div className="input-group">
                  <span className="bg-base-200">
                    <MagnifyingGlassIcon className="w-5 h-5" />
                  </span>
                  <input
                    type="text"
                    placeholder="Search medications..."
                    className="input input-bordered flex-1"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="form-control">
                <select
                  className="select select-bordered"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Medications List */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title mb-6">
              <MedicationIcon className="w-6 h-6" />
              All Medications ({filteredMedications.length})
            </h2>

            {filteredMedications.length === 0 ? (
              <div className="text-center py-12">
                <MedicationIcon className="w-16 h-16 mx-auto text-base-300 mb-4" />
                <h3 className="text-xl font-semibold text-base-content/60 mb-2">
                  No medications found
                </h3>
                <p className="text-base-content/40">
                  {searchTerm
                    ? "Try adjusting your search terms"
                    : "Add your first medication to get started"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredMedications.map((medication) => {
                  const stockInfo = getStockIndicator(medication.current_stock);
                  return (
                    <div
                      key={medication.id}
                      className="border border-base-300 rounded-lg p-6 hover:bg-base-50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4">
                          <div
                            className={`p-3 rounded-lg bg-${medication.color}/20`}
                          >
                            <MedicationIcon
                              className={`w-8 h-8 text-${medication.color}`}
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-xl mb-1">
                              {medication.name}
                            </h3>
                            <p className="text-base-content/70 mb-2">
                              {medication.dosage} • {medication.frequency}
                            </p>
                            <p className="text-sm text-base-content/60">
                              Prescribed by {medication.prescribed_by} • Started{" "}
                              {new Date(
                                medication.start_date
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={getStatusBadge(medication.status)}>
                            {medication.status}
                          </span>
                          <div className="dropdown dropdown-end">
                            <label
                              tabIndex={0}
                              className="btn btn-ghost btn-sm"
                            >
                              •••
                            </label>
                            <ul
                              tabIndex={0}
                              className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
                            >
                              <li>
                                <a
                                  onClick={() =>
                                    handleEditMedication(medication)
                                  }
                                >
                                  <PencilIcon className="w-4 h-4" />
                                  Edit
                                </a>
                              </li>
                              <li>
                                <a
                                  className="text-error"
                                  onClick={() =>
                                    handleDeleteMedication(medication.id)
                                  }
                                >
                                  <TrashIcon className="w-4 h-4" />
                                  Delete
                                </a>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Time Slots */}
                      {medication.time_slots &&
                        medication.time_slots.length > 0 && (
                          <div className="mb-4">
                            <p className="text-sm font-medium mb-2">
                              Scheduled Times:
                            </p>
                            <div className="flex gap-2 flex-wrap">
                              {medication.time_slots.map((time, index) => (
                                <span
                                  key={index}
                                  className="badge badge-outline"
                                >
                                  <ClockIcon className="w-3 h-3 mr-1" />
                                  {time}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                      {/* Stock and Refill Information */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg ${stockInfo.bg}`}
                        >
                          {medication.current_stock === 0 ? (
                            <ExclamationCircleIcon className="w-5 h-5 text-error" />
                          ) : (
                            <CheckCircleIcon className="w-5 h-5 text-success" />
                          )}
                          <span
                            className={`text-sm font-medium ${stockInfo.class}`}
                          >
                            {medication.current_stock} pills • {stockInfo.text}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-info/10">
                          <span className="text-sm font-medium text-info">
                            {medication.refills_remaining} refills remaining
                          </span>
                        </div>
                      </div>

                      {/* Notes */}
                      {medication.notes && (
                        <div className="bg-base-200 rounded-lg p-4">
                          <p className="text-sm text-base-content/70">
                            <strong>Notes:</strong> {medication.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Add/Edit Medication Modal */}
        {isAddModalOpen && (
          <div className="modal modal-open">
            <div className="modal-box max-w-2xl">
              <h3 className="font-bold text-lg mb-4">
                {editingMedication ? "Edit Medication" : "Add New Medication"}
              </h3>

              <form onSubmit={handleSaveMedication} className="space-y-4">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Medication Name *</span>
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
                      <span className="label-text">Dosage *</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered"
                      placeholder="e.g. 500mg, 10ml"
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <span className="label-text">Color Theme</span>
                    </label>
                    <select
                      className="select select-bordered"
                      value={medicationForm.color}
                      onChange={(e) =>
                        setMedicationForm({
                          ...medicationForm,
                          color: e.target.value,
                        })
                      }
                    >
                      {colorOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Time Slots */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Scheduled Times</span>
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="time"
                      id="timeSlot"
                      className="input input-bordered flex-1"
                    />
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={addTimeSlot}
                    >
                      Add Time
                    </button>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {medicationForm.time_slots.map((time, index) => (
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Current Stock</span>
                    </label>
                    <input
                      type="number"
                      className="input input-bordered"
                      min="0"
                      value={medicationForm.current_stock}
                      onChange={(e) =>
                        setMedicationForm({
                          ...medicationForm,
                          current_stock: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Refills Remaining</span>
                    </label>
                    <input
                      type="number"
                      className="input input-bordered"
                      min="0"
                      value={medicationForm.refills_remaining}
                      onChange={(e) =>
                        setMedicationForm({
                          ...medicationForm,
                          refills_remaining: parseInt(e.target.value) || 0,
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Prescribed By</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered"
                      placeholder="Dr. Smith"
                      value={medicationForm.prescribed_by}
                      onChange={(e) =>
                        setMedicationForm({
                          ...medicationForm,
                          prescribed_by: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Start Date</span>
                    </label>
                    <input
                      type="date"
                      className="input input-bordered"
                      value={medicationForm.start_date}
                      onChange={(e) =>
                        setMedicationForm({
                          ...medicationForm,
                          start_date: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Notes</span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered h-20"
                    placeholder="Any special instructions or notes"
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
                    {editingMedication ? "Update" : "Add"} Medication
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Toast Notification */}
        {showToast && (
          <div className="toast toast-top toast-end z-50">
            <div className="alert alert-success">
              <CheckCircleIcon className="w-6 h-6" />
              <span>{toastMessage}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
