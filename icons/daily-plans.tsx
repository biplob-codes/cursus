export function DailyPlansIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* binder tabs */}
      <rect x="7" y="2" width="2" height="4" rx="1" fill="#A5B4FC" />
      <rect x="15" y="2" width="2" height="4" rx="1" fill="#A5B4FC" />
      {/* card body */}
      <rect x="3" y="5" width="18" height="15" rx="3" fill="#4F46E5" />
      {/* header strip */}
      <rect x="3" y="5" width="18" height="4" rx="3" fill="#818CF8" />
      {/* checkmark */}
      <path
        d="M7.5 13.5 L10 16 L16.5 9.5"
        stroke="#FFFFFF"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
