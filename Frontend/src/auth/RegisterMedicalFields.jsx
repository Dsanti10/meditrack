import React from "react";

export default function RegisterMedicalFields({ formData, onChange }) {
  return (
    <>
      {/* Blood Type */}
      <div className="form-control">
        <label className="label" htmlFor="bloodType">
          <span className="label-text text-base-content">Blood Type</span>
        </label>
        <select
          id="bloodType"
          name="bloodType"
          className="select select-bordered w-full"
          value={formData.bloodType || ""}
          onChange={onChange}
        >
          <option value="">Select Blood Type</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
        </select>
      </div>
      {/* Allergies */}
      <div className="form-control">
        <label className="label" htmlFor="allergies">
          <span className="label-text text-base-content">
            Allergies (comma separated)
          </span>
        </label>
        <input
          id="allergies"
          name="allergies"
          type="text"
          className="input input-bordered w-full"
          value={formData.allergies || ""}
          onChange={onChange}
        />
      </div>
      {/* Medical Conditions */}
      <div className="form-control">
        <label className="label" htmlFor="medicalConditions">
          <span className="label-text text-base-content">
            Medical Conditions (comma separated)
          </span>
        </label>
        <input
          id="medicalConditions"
          name="medicalConditions"
          type="text"
          className="input input-bordered w-full"
          value={formData.medicalConditions || ""}
          onChange={onChange}
        />
      </div>
      {/* Primary Doctor */}
      <div className="form-control">
        <label className="label" htmlFor="primaryDoctor">
          <span className="label-text text-base-content">Primary Doctor</span>
        </label>
        <input
          id="primaryDoctor"
          name="primaryDoctor"
          type="text"
          className="input input-bordered w-full"
          value={formData.primaryDoctor || ""}
          onChange={onChange}
        />
      </div>
      {/* Insurance */}
      <div className="form-control">
        <label className="label" htmlFor="insurance">
          <span className="label-text text-base-content">Insurance</span>
        </label>
        <input
          id="insurance"
          name="insurance"
          type="text"
          className="input input-bordered w-full"
          value={formData.insurance || ""}
          onChange={onChange}
        />
      </div>
      {/* Insurance Number */}
      <div className="form-control">
        <label className="label" htmlFor="insuranceNumber">
          <span className="label-text text-base-content">Insurance Number</span>
        </label>
        <input
          id="insuranceNumber"
          name="insuranceNumber"
          type="text"
          className="input input-bordered w-full"
          value={formData.insuranceNumber || ""}
          onChange={onChange}
        />
      </div>
    </>
  );
}
