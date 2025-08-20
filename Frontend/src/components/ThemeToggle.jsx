import {
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
} from "@heroicons/react/24/outline";
import { useTheme } from "../contexts/ThemeContext";

export default function ThemeToggle() {
  const { theme, changeTheme } = useTheme();

  const getNextTheme = (currentTheme) => {
    switch (currentTheme) {
      case "light":
        return "dark";
      case "dark":
        return "system";
      case "system":
        return "light";
      default:
        return "light";
    }
  };

  const getThemeIcon = (currentTheme) => {
    switch (currentTheme) {
      case "light":
        return <SunIcon className="w-5 h-5" />;
      case "dark":
        return <MoonIcon className="w-5 h-5" />;
      case "system":
        return <ComputerDesktopIcon className="w-5 h-5" />;
      default:
        return <SunIcon className="w-5 h-5" />;
    }
  };

  const handleToggle = () => {
    const nextTheme = getNextTheme(theme);
    changeTheme(nextTheme);
  };

  return (
    <button
      onClick={handleToggle}
      className="btn btn-ghost btn-sm"
      title={`Current theme: ${theme}. Click to cycle through themes.`}
      aria-label={`Switch theme from ${theme}`}
    >
      {getThemeIcon(theme)}
    </button>
  );
}
