import { useTheme } from "../contexts/ThemeContext";

// Light theme icon (dark elements)
const MediTrackIconLight = ({ className = "w-10 h-10" }) => (
  <svg
    width="64"
    height="64"
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient
        id="iconGradientLight"
        x1="0%"
        y1="0%"
        x2="100%"
        y2="100%"
      >
        <stop offset="0%" style={{ stopColor: "#661AE6", stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: "#8B5CF6", stopOpacity: 1 }} />
      </linearGradient>
      <filter id="iconShadowLight" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow
          dx="0"
          dy="2"
          stdDeviation="4"
          floodColor="#661AE6"
          floodOpacity="0.3"
        />
      </filter>
    </defs>

    <circle
      cx="32"
      cy="32"
      r="28"
      fill="url(#iconGradientLight)"
      filter="url(#iconShadowLight)"
    />

    <g transform="translate(32, 32)">
      <rect x="-2" y="-12" width="4" height="24" fill="white" rx="2" />
      <rect x="-12" y="-2" width="24" height="4" fill="white" rx="2" />
    </g>
  </svg>
);

// Dark theme icon (light elements)
const MediTrackIconDark = ({ className = "w-10 h-10" }) => (
  <svg
    width="64"
    height="64"
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="iconGradientDark" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: "#8B5CF6", stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: "#A78BFA", stopOpacity: 1 }} />
      </linearGradient>
      <filter id="iconShadowDark" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow
          dx="0"
          dy="2"
          stdDeviation="4"
          floodColor="#8B5CF6"
          floodOpacity="0.5"
        />
      </filter>
    </defs>

    <circle
      cx="32"
      cy="32"
      r="28"
      fill="url(#iconGradientDark)"
      filter="url(#iconShadowDark)"
    />

    <g transform="translate(32, 32)">
      <rect x="-2" y="-12" width="4" height="24" fill="white" rx="2" />
      <rect x="-12" y="-2" width="24" height="4" fill="white" rx="2" />
    </g>
  </svg>
);

// Main component that switches based on theme
export default function ThemeAwareIcon({ className = "w-10 h-10" }) {
  const { theme } = useTheme();

  // Determine if we should use dark icon
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  return isDark ? (
    <MediTrackIconDark className={className} />
  ) : (
    <MediTrackIconLight className={className} />
  );
}
