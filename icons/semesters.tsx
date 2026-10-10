export function SemestersIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* calendar body */}
      <rect x="3" y="4" width="18" height="16" rx="3" fill="#7C3AED" />
      {/* top bar */}
      <rect x="3" y="4" width="18" height="5" rx="3" fill="#A78BFA" />
      {/* binding rings */}
      <rect x="7" y="2" width="2" height="4" rx="1" fill="#C4B5FD" />
      <rect x="15" y="2" width="2" height="4" rx="1" fill="#C4B5FD" />
      {/* small book / course mark */}
      <rect
        x="7"
        y="12"
        width="4"
        height="5"
        rx="0.8"
        fill="#FFFFFF"
        opacity="0.95"
      />
      <rect
        x="8"
        y="13"
        width="2"
        height="0.9"
        rx="0.4"
        fill="#7C3AED"
        opacity="0.7"
      />
      <rect
        x="8"
        y="14.5"
        width="2"
        height="0.9"
        rx="0.4"
        fill="#7C3AED"
        opacity="0.5"
      />
      {/* date dots / schedule marks */}
      <circle cx="14.5" cy="13.5" r="1.1" fill="#FFFFFF" opacity="0.9" />
      <circle cx="17.5" cy="13.5" r="1.1" fill="#FFFFFF" opacity="0.7" />
      <circle cx="14.5" cy="16.5" r="1.1" fill="#FFFFFF" opacity="0.7" />
      <circle cx="17.5" cy="16.5" r="1.1" fill="#FFFFFF" opacity="0.5" />
    </svg>
  );
}
