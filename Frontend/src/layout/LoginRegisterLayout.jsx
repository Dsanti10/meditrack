import { Outlet } from "react-router";

export default function LoginSignUpLayout() {
  return (
    <div>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
