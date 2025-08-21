import {
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import MedicationIcon from "@mui/icons-material/Medication";
import { useState } from "react";
import { Link } from "react-router";
import useQuery from "../api/useQuery";
import useMutation from "../api/useMutation";

export default function MyMedications() {
  const {
    data: medications = [],
    loading,
    error,
  } = useQuery("/medications", "medications");
  const createMedicationMutation = useMutation("POST", "/medications", [
    "medications",
  ]);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success"); // 'success' or 'error'
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [medicationForm, setMedicationForm] = useState({
    name: "",
    dosage: "",
    frequency: "Once daily",
    current_stock: 0,
    status: "active",
    color: "primary",
    notes: "",
    prescribed_by: "",
    start_date: new Date().toISOString().split("T")[0],
    refills_remaining: 0,
    prescription_number: "",
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

  const handleAddMedication = () => {
    setMedicationForm({
      name: "",
      dosage: "",
      frequency: "Once daily",
      current_stock: 0,
      status: "active",
      color: "primary",
      notes: "",
      prescribed_by: "",
      start_date: new Date().toISOString().split("T")[0],
      refills_remaining: 0,
      prescription_number: "",
    });
    setIsAddModalOpen(true);
  };

  const handleSaveNewMedication = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!medicationForm.name.trim() || !medicationForm.dosage.trim()) {
      setToastMessage("Please fill in all required fields");
      setToastType("error");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    try {
      console.log("Submitting medication form:", medicationForm);
      const success = await createMedicationMutation.mutate(medicationForm);

      if (success) {
        setToastMessage("Medication added successfully!");
        setToastType("success");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        setIsAddModalOpen(false);
        // Reset form
        setMedicationForm({
          name: "",
          dosage: "",
          frequency: "Once daily",
          current_stock: 0,
          status: "active",
          color: "primary",
          notes: "",
          prescribed_by: "",
          start_date: new Date().toISOString().split("T")[0],
          refills_remaining: 0,
          prescription_number: "",
        });
      } else {
        // Check if there's an error from the mutation
        if (createMedicationMutation.error) {
          setToastMessage(`Error: ${createMedicationMutation.error}`);
        } else {
          setToastMessage("Failed to add medication. Please try again.");
        }
        setToastType("error");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    } catch (error) {
      console.error("Failed to add medication:", error);
      setToastMessage(`Error: ${error.message || "Failed to add medication"}`);
      setToastType("error");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    let processedValue = value;

    // Convert numeric fields to proper numbers
    if (type === "number") {
      processedValue = value === "" ? 0 : parseInt(value, 10);
    }

    setMedicationForm((prev) => ({
      ...prev,
      [name]: processedValue,
    }));
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: "badge badge-success",
      paused: "badge badge-warning",
      discontinued: "badge badge-error",
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
    return total + (med.time_slots ? med.time_slots.length : 0);
  }, 0);

  if (loading) {
    return (
      <div className="card bg-base-100 shadow-xl h-full">
        <div className="card-body p-4 sm:p-6 flex items-center justify-center">
          <div className="loading loading-spinner loading-lg"></div>
          <p className="ml-4">Loading medications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card bg-base-100 shadow-xl h-full">
        <div className="card-body p-4 sm:p-6 flex items-center justify-center">
          <div className="alert alert-error">
            <ExclamationCircleIcon className="w-6 h-6" />
            <span>Failed to load medications</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-xl h-full">
      {/* Toast notification */}
      {showToast && (
        <div className="toast toast-top toast-end">
          <div
            className={`alert ${
              toastType === "success" ? "alert-success" : "alert-error"
            }`}
          >
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      <div className="card-body p-4 sm:p-6 flex flex-col h-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 flex-shrink-0">
          <div className="mb-2 sm:mb-0">
            <h2 className="card-title text-lg sm:text-xl md:text-2xl mb-1 sm:mb-2">
              My Medications
            </h2>
            <p className="text-base-content/70 text-sm sm:text-base hidden sm:block">
              {activeMedications} active medications, {totalDoses} daily doses
            </p>
          </div>
          <div className="flex gap-2">
            <button
              className="btn btn-primary btn-sm"
              onClick={handleAddMedication}
            >
              <PlusIcon className="w-4 h-4" />
              Add
            </button>
            <Link to="/medications" className="btn btn-outline btn-sm">
              View All
            </Link>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto min-h-0">
          {medications.length === 0 ? (
            <div className="text-center py-8">
              <MedicationIcon className="w-16 h-16 mx-auto text-base-300 mb-4" />
              <h3 className="text-lg font-semibold text-base-content/60 mb-2">
                No medications yet
              </h3>
              <p className="text-base-content/40 mb-4">
                Add your first medication to get started
              </p>
              <button onClick={handleAddMedication} className="btn btn-primary">
                <PlusIcon className="w-5 h-5" />
                Add Medication
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {medications.slice(0, 6).map((medication) => {
                const stockInfo = getStockIndicator(medication.current_stock);
                return (
                  <div
                    key={medication.id}
                    className="border border-base-300 rounded-lg p-3 sm:p-4 hover:bg-base-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0 pr-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div
                            className={`badge badge-${medication.color} badge-sm`}
                          >
                            <MedicationIcon className="w-3 h-3" />
                          </div>
                          <h3 className="font-semibold text-sm sm:text-base truncate">
                            {medication.name}
                          </h3>
                          <span className={getStatusBadge(medication.status)}>
                            {medication.status}
                          </span>
                        </div>

                        <div className="text-xs sm:text-sm text-base-content/70 mb-2">
                          <div className="flex flex-wrap gap-x-4 gap-y-1">
                            <span>
                              <strong>Dosage:</strong> {medication.dosage}
                            </span>
                            <span>
                              <strong>Frequency:</strong> {medication.frequency}
                            </span>
                          </div>
                        </div>

                        {medication.time_slots &&
                          medication.time_slots.length > 0 && (
                            <div className="mb-2">
                              <div className="flex flex-wrap gap-1">
                                {medication.time_slots.map((time, index) => (
                                  <span
                                    key={index}
                                    className="badge badge-ghost badge-sm"
                                  >
                                    <ClockIcon className="w-3 h-3 mr-1" />
                                    {time}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                        <div className="flex items-center gap-2">
                          <div
                            className={`text-xs px-2 py-1 rounded ${stockInfo.bg}`}
                          >
                            <span className={stockInfo.class}>
                              {stockInfo.text}: {medication.current_stock}
                            </span>
                          </div>
                        </div>

                        {medication.notes && (
                          <p className="text-xs text-base-content/60 mt-2 line-clamp-2">
                            {medication.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {medications.length > 6 && (
                <div className="text-center pt-2">
                  <Link to="/medications" className="btn btn-ghost btn-sm">
                    View {medications.length - 6} more medications
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add Medication Modal */}
      {isAddModalOpen && (
        <div
          className="modal modal-open"
          onClick={(e) =>
            e.target === e.currentTarget && setIsAddModalOpen(false)
          }
        >
          <div className="modal-box max-w-2xl">
            <h3 className="font-bold text-lg mb-4">Add New Medication</h3>

            <form onSubmit={handleSaveNewMedication} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Medication Name *</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={medicationForm.name}
                    onChange={handleInputChange}
                    className="input input-bordered"
                    placeholder="e.g., Ibuprofen"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Dosage *</span>
                  </label>
                  <input
                    type="text"
                    name="dosage"
                    value={medicationForm.dosage}
                    onChange={handleInputChange}
                    className="input input-bordered"
                    placeholder="e.g., 500mg"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Frequency *</span>
                  </label>
                  <select
                    name="frequency"
                    value={medicationForm.frequency}
                    onChange={handleInputChange}
                    className="select select-bordered"
                    required
                  >
                    {frequencyOptions.map((freq) => (
                      <option key={freq} value={freq}>
                        {freq}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Current Stock</span>
                  </label>
                  <input
                    type="number"
                    name="current_stock"
                    value={medicationForm.current_stock}
                    onChange={handleInputChange}
                    className="input input-bordered"
                    min="0"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Prescribed By</span>
                  </label>
                  <input
                    type="text"
                    name="prescribed_by"
                    value={medicationForm.prescribed_by}
                    onChange={handleInputChange}
                    className="input input-bordered"
                    placeholder="Doctor's name"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Status</span>
                  </label>
                  <select
                    name="status"
                    value={medicationForm.status}
                    onChange={handleInputChange}
                    className="select select-bordered"
                  >
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                    <option value="discontinued">Discontinued</option>
                  </select>
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Notes</span>
                </label>
                <textarea
                  name="notes"
                  value={medicationForm.notes}
                  onChange={handleInputChange}
                  className="textarea textarea-bordered"
                  placeholder="Any additional notes or instructions"
                  rows="3"
                />
              </div>

              <div className="modal-action">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={createMedicationMutation.loading}
                >
                  {createMedicationMutation.loading ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Adding...
                    </>
                  ) : (
                    "Add Medication"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
