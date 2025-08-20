import React from "react";

export default function RegisterAccountFields({ formData, onChange }) {
  return (
    <>
      {/* First Name */}
      <div className="form-control">
        <label className="label" htmlFor="firstName">
          <span className="label-text text-base-content">First Name</span>
        </label>
        <input
          id="firstName"
          name="firstName"
          type="text"
          required
          className="input input-bordered w-full"
          value={formData.firstName || ""}
          onChange={onChange}
        />
      </div>
      {/* Last Name */}
      <div className="form-control">
        <label className="label" htmlFor="lastName">
          <span className="label-text text-base-content">Last Name</span>
        </label>
        <input
          id="lastName"
          name="lastName"
          type="text"
          required
          className="input input-bordered w-full"
          value={formData.lastName || ""}
          onChange={onChange}
        />
      </div>
      {/* Email Field */}
      <div className="form-control">
        <label className="label" htmlFor="email">
          <span className="label-text text-base-content">Email</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="input input-bordered w-full"
          value={formData.email || ""}
          onChange={onChange}
        />
      </div>
      {/* Password Field */}
      <div className="form-control">
        <label className="label" htmlFor="password">
          <span className="label-text text-base-content">Password</span>
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="input input-bordered w-full"
          value={formData.password || ""}
          onChange={onChange}
        />
      </div>
      {/* Confirm Password Field */}
      <div className="form-control">
        <label className="label" htmlFor="confirmPassword">
          <span className="label-text text-base-content">Confirm Password</span>
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          className="input input-bordered w-full"
          value={formData.confirmPassword || ""}
          onChange={onChange}
        />
      </div>
    </>
  );
}
