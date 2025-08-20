import { Link, NavLink } from "react-router";
import ThemeAwareLogo from "./ThemeAwareLogo";

export default function LoginRegisterNavBar() {
  return (
    <header id="navbar">
      <div className="navbar bg-base-100 shadow-sm">
        <div className="">
          <NavLink to="/" className="btn btn-ghost text-xl">
            <ThemeAwareLogo className="h-14" />
          </NavLink>
        </div>
      </div>
    </header>
  );
}
