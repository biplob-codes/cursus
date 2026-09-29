export function NotesIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* page body */}
      <rect x="5" y="3" width="14" height="18" rx="2" fill="#0D9488" />

      {/* folded corner */}
      <path d="M15 3 L19 7 L15 7 Z" fill="#5EEAD4" />

      {/* lines */}
      <rect
        x="8"
        y="10"
        width="8"
        height="1.5"
        rx="0.75"
        fill="#FFFFFF"
        opacity="0.9"
      />

      <rect
        x="8"
        y="13.5"
        width="6"
        height="1.5"
        rx="0.75"
        fill="#FFFFFF"
        opacity="0.7"
      />

      <rect
        x="8"
        y="17"
        width="7"
        height="1.5"
        rx="0.75"
        fill="#FFFFFF"
        opacity="0.5"
      />
    </svg>
  );
}
