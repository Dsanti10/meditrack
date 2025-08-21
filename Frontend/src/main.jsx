import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { ApiProvider } from "./api/ApiContext.jsx";
import App from "./App.jsx";
import { AuthProvider } from "./auth/AuthContext.jsx";
import { ThemeProvider } from "./contexts/ThemeContext.jsx";
import { ReminderProvider } from "./contexts/ReminderContext.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <ThemeProvider>
    <AuthProvider>
      <ApiProvider>
        <ReminderProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ReminderProvider>
      </ApiProvider>
    </AuthProvider>
  </ThemeProvider>
);
