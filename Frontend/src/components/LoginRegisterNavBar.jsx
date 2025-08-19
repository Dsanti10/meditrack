import { Link, NavLink } from "react-router";
import MediTrackLogo from "../assets/MediTrackMainLogo.svg";

export default function LoginRegisterNavBar() {
  return (
    <header id="navbar">
      <div className="navbar bg-base-100 shadow-sm">
        <div className="">
          <NavLink to="/" className="btn btn-ghost text-xl">
            <img src={MediTrackLogo} alt="MediTrack" className="h-14" />
          </NavLink>
        </div>
      </div>
    </header>
  );
}
