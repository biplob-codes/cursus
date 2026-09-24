import { forwardRef, type SVGProps } from "react";

/**
 * GitHub mark, hand-rolled to match lucide-react's icon API
 * (ref-forwarding, size/className/stroke props) since lucide
 * doesn't ship one. Drop this in as e.g. components/icons/github.tsx
 * and import { GithubIcon } wherever you'd otherwise import
 * a lucide icon.
 */
export interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const GithubIcon = forwardRef<SVGSVGElement, IconProps>(
  ({ size = 24, className, ...props }, ref) => (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      className={className}
      {...props}
    >
      <path d="M12 .5C5.73.5.75 5.48.75 11.75c0 5.02 3.26 9.28 7.78 10.78.57.1.78-.25.78-.55 0-.27-.01-1.16-.02-2.1-3.16.69-3.83-1.34-3.83-1.34-.52-1.31-1.26-1.66-1.26-1.66-1.03-.7.08-.69.08-.69 1.14.08 1.74 1.17 1.74 1.17 1.01 1.73 2.65 1.23 3.3.94.1-.73.4-1.23.72-1.51-2.52-.29-5.17-1.26-5.17-5.62 0-1.24.44-2.26 1.17-3.06-.12-.29-.51-1.45.11-3.02 0 0 .96-.31 3.13 1.17a10.9 10.9 0 0 1 5.7 0c2.17-1.48 3.12-1.17 3.12-1.17.63 1.57.24 2.73.12 3.02.73.8 1.17 1.82 1.17 3.06 0 4.37-2.66 5.33-5.19 5.62.41.35.77 1.05.77 2.11 0 1.53-.01 2.76-.01 3.13 0 .3.2.66.79.55A11.26 11.26 0 0 0 23.25 11.75C23.25 5.48 18.27.5 12 .5Z" />
    </svg>
  ),
);
GithubIcon.displayName = "GithubIcon";
