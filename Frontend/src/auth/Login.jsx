import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "./AuthContext";

/** A form that allows users to log into an existing account. */
export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const onLogin = async (formData) => {
    const email = formData.get("email");
    const password = formData.get("password");

    setIsLoading(true);
    setError(null);

    try {
      await login({ email, password });
      navigate("/dashboard");
    } catch (e) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-300 flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg p-2 sm:p-4 items-center justify-center">
        {/* Main Login Card */}
        <div className="card bg-base-100 shadow-2xl border border-base-content/10 w-full">
          <div className="card-body p-4 sm:p-6 md:p-8">
            {/* Header Section */}
            <div className="text-center mb-4 sm:mb-6">
              <div className="flex justify-center mb-3 sm:mb-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-primary flex items-center justify-center shadow-lg">
                  <svg
                    className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-primary-content"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-base-content mt-3 sm:mt-4">
                Welcome back
              </h1>
              <p className="text-base-content/70 mt-1 sm:mt-2 text-sm sm:text-base">
                Sign in to your MediTrack account
              </p>
            </div>

            {/* Login Form */}
            <form className="space-y-3 sm:space-y-4" action={onLogin}>
              {/* Username Field */}
              <div className="form-control">
                <label className="label" htmlFor="username">
                  <span className="label-text text-base-content text-sm sm:text-base">
                    Username
                  </span>
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="input input-bordered w-full bg-base-200 border-base-content/20 text-base-content placeholder:text-base-content/50 focus:border-primary focus:outline-none text-sm sm:text-base"
                  placeholder="Enter your username"
                />
              </div>

              {/* Password Field */}
              <div className="form-control">
                <label className="label" htmlFor="password">
                  <span className="label-text text-base-content text-sm sm:text-base">
                    Password
                  </span>
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="input input-bordered w-full bg-base-200 border-base-content/20 text-base-content placeholder:text-base-content/50 focus:border-primary focus:outline-none text-sm sm:text-base"
                  placeholder="Enter your password"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="alert alert-error shadow-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="stroke-current shrink-0 h-5 w-5 sm:h-6 sm:w-6"
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
                  className="btn btn-primary w-full shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {isLoading ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Signing in...
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
                          d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                        />
                      </svg>
                      Sign In
                    </>
                  )}
                </button>
              </div>

              {/* Register Link */}
              <div className="divider text-base-content/50">OR</div>
              <div className="text-center">
                <p className="text-base-content/70">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="link link-primary font-medium hover:link-hover"
                  >
                    Create one here
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
