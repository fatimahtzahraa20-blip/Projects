import React from "react";

// Minimal Form wrapper component
export function Form({ children, className = "", ...props }) {
  return (
    <form className={className} {...props}>
      {children}
    </form>
  );
}
