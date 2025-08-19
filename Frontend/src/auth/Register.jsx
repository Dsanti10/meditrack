import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "./AuthContext";
import loginimg from "../assets/loginimg.jpg";

/** A form that allows users to register a new account */
export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);

  const onRegister = async (formData) => {
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPass = formData.get("confirmPassword");

    // Check if passwords match
    if (password !== confirmPass) {
      setPasswordMatch(false);
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    setError(null);
    setPasswordMatch(true);

    try {
      await register({ email, password });
      navigate("/dashboard");
    } catch (e) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-300 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Main Register Card */}
        <div className="card bg-base-100 shadow-2xl border border-base-content/10 h-full flex flex-col justify-center">
          <div className="card-body p-8">
            {/* Header Section */}
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center shadow-lg">
                  <svg
                    className="h-8 w-8 text-secondary-content"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                  </svg>
                </div>
              </div>
              <h1 className="text-3xl font-bold text-base-content mt-4">
                Join MediTrack
              </h1>
              <p className="text-base-content/70 mt-2">
                Create your account to start managing your medications
              </p>
            </div>

            {/* Register Form */}
            <form className="space-y-4" action={onRegister}>
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
                  className="input input-bordered w-full bg-base-200 border-base-content/20 text-base-content placeholder:text-base-content/50 focus:border-secondary focus:outline-none"
                  placeholder="Enter your email address"
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
                  className="input input-bordered w-full bg-base-200 border-base-content/20 text-base-content placeholder:text-base-content/50 focus:border-secondary focus:outline-none"
                  placeholder="Create a secure password"
                />
              </div>

              {/* Confirm Password Field */}
              <div className="form-control">
                <label className="label" htmlFor="confirmPassword">
                  <span className="label-text text-base-content">
                    Confirm Password
                  </span>
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className={`input input-bordered w-full bg-base-200 border-base-content/20 text-base-content placeholder:text-base-content/50 focus:outline-none ${
                    passwordMatch
                      ? "focus:border-secondary"
                      : "border-error focus:border-error"
                  }`}
                  placeholder="Confirm your password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="alert alert-error shadow-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="stroke-current shrink-0 h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-error-content">{error}</span>
                </div>
              )}

              {/* Submit Button */}
              <div className="form-control mt-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn btn-secondary w-full shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {isLoading ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Creating account...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                        />
                      </svg>
                      Create Account
                    </>
                  )}
                </button>
              </div>

              {/* Login Link */}
              <div className="divider text-base-content/50">OR</div>
              <div className="text-center">
                <p className="text-base-content/70">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="link link-secondary font-medium hover:link-hover"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Image Section */}
        <div className="hidden lg:flex items-center justify-center h-full">
          <div className="relative w-full h-full min-h-[600px] rounded-2xl overflow-hidden shadow-2xl">
            <img
              src={loginimg}
              alt="Healthcare professional with patients and medical background"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-secondary/30 to-transparent"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
