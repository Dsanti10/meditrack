import { useTheme } from "../contexts/ThemeContext";

// Light theme logo (dark text/elements)
const MediTrackLogoLight = ({ className = "h-14" }) => (
  <svg
    width="300"
    height="80"
    viewBox="0 0 300 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient
        id="primaryGradientLight"
        x1="0%"
        y1="0%"
        x2="100%"
        y2="100%"
      >
        <stop offset="0%" style={{ stopColor: "#661AE6", stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: "#8B5CF6", stopOpacity: 1 }} />
      </linearGradient>
      <filter id="shadowLight" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow
          dx="0"
          dy="4"
          stdDeviation="8"
          floodColor="#661AE6"
          floodOpacity="0.3"
        />
      </filter>
    </defs>

    <circle
      cx="40"
      cy="40"
      r="32"
      fill="url(#primaryGradientLight)"
      filter="url(#shadowLight)"
    />

    <g transform="translate(40, 40)">
      <rect x="-3" y="-16" width="6" height="32" fill="white" rx="3" />
      <rect x="-16" y="-3" width="32" height="6" fill="white" rx="3" />
    </g>

    <text
      x="90"
      y="35"
      fontFamily="Arial, sans-serif"
      fontSize="28"
      fontWeight="bold"
      fill="#1a1a1a"
    >
      Medi
    </text>
    <text
      x="90"
      y="60"
      fontFamily="Arial, sans-serif"
      fontSize="28"
      fontWeight="bold"
      fill="#661AE6"
    >
      Track
    </text>
  </svg>
);

// Dark theme logo (light text/elements)
const MediTrackLogoDark = ({ className = "h-14" }) => (
  <svg
    width="300"
    height="80"
    viewBox="0 0 300 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient
        id="primaryGradientDark"
        x1="0%"
        y1="0%"
        x2="100%"
        y2="100%"
      >
        <stop offset="0%" style={{ stopColor: "#8B5CF6", stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: "#A78BFA", stopOpacity: 1 }} />
      </linearGradient>
      <filter id="shadowDark" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow
          dx="0"
          dy="4"
          stdDeviation="8"
          floodColor="#8B5CF6"
          floodOpacity="0.5"
        />
      </filter>
    </defs>

    <circle
      cx="40"
      cy="40"
      r="32"
      fill="url(#primaryGradientDark)"
      filter="url(#shadowDark)"
    />

    <g transform="translate(40, 40)">
      <rect x="-3" y="-16" width="6" height="32" fill="white" rx="3" />
      <rect x="-16" y="-3" width="32" height="6" fill="white" rx="3" />
    </g>

    <text
      x="90"
      y="35"
      fontFamily="Arial, sans-serif"
      fontSize="28"
      fontWeight="bold"
      fill="#ffffff"
    >
      Medi
    </text>
    <text
      x="90"
      y="60"
      fontFamily="Arial, sans-serif"
      fontSize="28"
      fontWeight="bold"
      fill="#8B5CF6"
    >
      Track
    </text>
  </svg>
);

// Main component that switches based on theme
export default function ThemeAwareLogo({ className = "h-14" }) {
  const { theme } = useTheme();

  // Determine if we should use dark logo
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  return isDark ? (
    <MediTrackLogoDark className={className} />
  ) : (
    <MediTrackLogoLight className={className} />
  );
}
