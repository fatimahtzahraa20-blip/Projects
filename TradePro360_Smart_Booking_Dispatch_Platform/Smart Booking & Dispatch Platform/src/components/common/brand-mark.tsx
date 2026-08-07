import type { SVGProps } from "react";

export function BrandMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" {...props}>
      <path
        d="M5 8.5 10.5 24 16 13l5.5 11L27 8.5"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M5 8.5 16 5l11 3.5M10.5 24h11" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" opacity=".65" />
      <circle cx="5" cy="8.5" r="2.25" fill="currentColor" />
      <circle cx="16" cy="5" r="2.25" fill="currentColor" />
      <circle cx="27" cy="8.5" r="2.25" fill="currentColor" />
    </svg>
  );
}
