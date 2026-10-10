export function CoursesIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* back book */}
      <rect x="4" y="5" width="13" height="15" rx="2" fill="#DB2777" />
      {/* front book */}
      <rect x="7" y="3" width="13" height="15" rx="2" fill="#EC4899" />
      {/* spine highlight */}
      <rect x="7" y="3" width="2.5" height="15" rx="1" fill="#F9A8D4" />
      {/* lines */}
      <rect
        x="12"
        y="7"
        width="5.5"
        height="1.4"
        rx="0.7"
        fill="#FFFFFF"
        opacity="0.95"
      />
      <rect
        x="12"
        y="10.5"
        width="4"
        height="1.4"
        rx="0.7"
        fill="#FFFFFF"
        opacity="0.7"
      />
      <rect
        x="12"
        y="14"
        width="5"
        height="1.4"
        rx="0.7"
        fill="#FFFFFF"
        opacity="0.5"
      />
    </svg>
  );
}
