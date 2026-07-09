import React from "react";

const LoadingSpinner = ({ size = "medium", color = "blue" }) => {
  const sizeClasses = {
    small: "h-4 w-4",
    medium: "h-8 w-8",
    large: "h-12 w-12",
  };

  const colorClasses = {
    blue: "border-cyan-200/30 border-t-cyan-200",
    white: "border-white/30 border-t-white",
    purple: "border-teal-200/30 border-t-teal-200",
  };

  return (
    <div
      className={`animate-spin rounded-full border-2 ${sizeClasses[size]} ${colorClasses[color]}`}
      aria-label="Loading"
      role="status"
    />
  );
};

export default LoadingSpinner;
