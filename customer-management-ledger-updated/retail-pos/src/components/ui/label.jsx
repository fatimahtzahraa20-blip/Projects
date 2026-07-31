import React from "react";

// Minimal Label component
export const Label = ({ className = "", ...props }) => {
  return (
    <label className={`block text-sm font-medium text-slate-700 ${className}`} {...props} />
  );
};
