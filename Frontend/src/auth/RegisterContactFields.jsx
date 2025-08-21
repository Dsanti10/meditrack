export default function RegisterContactFields({ formData, onChange }) {
  return (
    <>
      {/* Phone */}
      <div className="form-control">
        <label className="label" htmlFor="phone">
          <span className="label-text text-base-content">Phone</span>
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          className="input input-bordered w-full"
          value={formData.phone || ""}
          onChange={onChange}
        />
      </div>
      {/* Address */}
      <div className="form-control">
        <label className="label" htmlFor="address">
          <span className="label-text text-base-content">Address</span>
        </label>
        <input
          id="address"
          name="address"
          type="text"
          className="input input-bordered w-full"
          value={formData.address || ""}
          onChange={onChange}
        />
      </div>
      {/* Date of Birth */}
      <div className="form-control">
        <label className="label" htmlFor="dateOfBirth">
          <span className="label-text text-base-content">Date of Birth</span>
        </label>
        <input
          id="dateOfBirth"
          name="dateOfBirth"
          type="date"
          className="input input-bordered w-full"
          value={formData.dateOfBirth || ""}
          onChange={onChange}
        />
      </div>
      {/* Emergency Contact */}
      <div className="form-control">
        <label className="label" htmlFor="emergencyContact">
          <span className="label-text text-base-content">
            Emergency Contact
          </span>
        </label>
        <input
          id="emergencyContact"
          name="emergencyContact"
          type="text"
          className="input input-bordered w-full"
          value={formData.emergencyContact || ""}
          onChange={onChange}
        />
      </div>
    </>
  );
}
