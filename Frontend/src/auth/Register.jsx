import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "./AuthContext";
import RegisterAccountFields from "./RegisterAccountFields";
import RegisterContactFields from "./RegisterContactFields";
import RegisterMedicalFields from "./RegisterMedicalFields";

/** A form that allows users to register a new account */
export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [passwordMatch, setPasswordMatch] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      if (name === "confirmPassword" || name === "password") {
        setPasswordMatch(
          (next.password || "") === (next.confirmPassword || "")
        );
      }
      return next;
    });
  };

  const handleNext = (e) => {
    e.preventDefault();
    setStep((prev) => prev + 1);
  };
  const handleBack = (e) => {
    e.preventDefault();
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if ((formData.password || "") !== (formData.confirmPassword || "")) {
      setPasswordMatch(false);
      setError("Passwords do not match");
      return;
    }
    setIsLoading(true);
    setError(null);
    setPasswordMatch(true);
    try {
      const { confirmPassword, ...payload } = formData;
      await register(payload);

      // Show success message
      setIsSuccess(true);
      setIsLoading(false);

      // Wait 2 seconds then navigate to dashboard
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (e) {
      setError(e.message);
      setIsLoading(false);
      setIsSuccess(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-300 flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        <div className="card bg-base-100 shadow-2xl border border-base-content/10 h-full flex flex-col justify-center">
          <div className="card-body p-8">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-base-content mt-4">
                Join MediTrack
              </h1>
              <p className="text-base-content/70 mt-2">
                Create your account to start managing your medications
              </p>
            </div>
            <form
              className="space-y-4"
              onSubmit={step === 2 ? handleSubmit : handleNext}
            >
              {step === 0 && (
                <RegisterAccountFields
                  formData={formData}
                  onChange={handleChange}
                />
              )}
              {step === 1 && (
                <RegisterContactFields
                  formData={formData}
                  onChange={handleChange}
                />
              )}
              {step === 2 && (
                <RegisterMedicalFields
                  formData={formData}
                  onChange={handleChange}
                />
              )}
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

              {isSuccess && (
                <div className="alert alert-success shadow-lg">
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
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <h3 className="font-bold">Registration Successful!</h3>
                    <div className="text-xs">Loading your dashboard...</div>
                  </div>
                  <span className="loading loading-spinner loading-sm"></span>
                </div>
              )}
              <div className="form-control mt-6 flex flex-row gap-2">
                {step > 0 && (
                  <button
                    type="button"
                    className="btn btn-outline flex-1"
                    onClick={handleBack}
                    disabled={isLoading || isSuccess}
                  >
                    Back
                  </button>
                )}
                {step < 2 && (
                  <button
                    type="submit"
                    className="btn btn-primary flex-1"
                    disabled={isLoading || (step === 0 && !passwordMatch)}
                  >
                    Next
                  </button>
                )}
                {step === 2 && (
                  <button
                    type="submit"
                    className="btn btn-secondary flex-1"
                    disabled={isLoading || isSuccess}
                  >
                    {isLoading ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>
                        Creating account...
                      </>
                    ) : isSuccess ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>
                        Account created!
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
                )}
              </div>
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
      </div>
    </div>
  );
}
