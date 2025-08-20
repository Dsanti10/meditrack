import { Link } from "react-router";
import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import ThemeToggle from "../components/ThemeToggle";
import ThemeAwareLogo from "../components/ThemeAwareLogo";

export default function Navbar() {
  const { token, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header id="navbar">
      <div className="navbar bg-base-100 shadow-sm px-4 sm:px-6">
        <div className="navbar-start">
          <div className="dropdown lg:hidden">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            {isMobileMenuOpen && (
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow-lg border"
              >
                <li>
                  <Link to="#features" onClick={toggleMobileMenu}>
                    Features
                  </Link>
                </li>
                <li>
                  <Link to="#how-it-works" onClick={toggleMobileMenu}>
                    How It Works
                  </Link>
                </li>
              </ul>
            )}
          </div>
          <ThemeAwareLogo className="h-8 sm:h-10 md:h-12 lg:h-14" />
        </div>

        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link to="#features">Features</Link>
            </li>
            <li>
              <Link to="#how-it-works">How It Works</Link>
            </li>
          </ul>
        </div>

        <div className="navbar-end gap-2">
          <ThemeToggle />
          <Link to="/login" className="btn btn-ghost btn-sm sm:btn-md">
            Log In
          </Link>
          <Link to="/register" className="btn btn-primary btn-sm sm:btn-md">
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  );
}
