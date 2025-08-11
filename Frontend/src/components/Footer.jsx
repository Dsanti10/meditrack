export default function Footer() {
  return (
    <footer className="footer w-full footer-horizontal footer-center bg-base-100 text-base-content rounded p-10 ">
      <nav className="grid grid-flow-col gap-4">
        <a className="btn btn-ghost">About</a>
        <a className="btn btn-ghost">Contact</a>
        <a className="btn btn-ghost">Sign Up</a>
      </nav>
      <aside>
        <p>
          Copyright © {new Date().getFullYear()} - All right reserved by
          MediTrack
        </p>
      </aside>
    </footer>
  );
}
