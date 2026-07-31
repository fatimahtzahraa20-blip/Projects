import React from "react";

// Minimal Select component
export const Select = React.forwardRef(({ className = "", children, ...props }, ref) => {
  return (
    <select
      ref={ref}
      className={`w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      {...props}
    >
      {children}
    </select>
  );
});

Select.displayName = "Select";
