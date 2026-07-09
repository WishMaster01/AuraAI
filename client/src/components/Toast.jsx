import React, { useEffect, useState } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

const Toast = ({ message, type = "info", duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-teal-200" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-200" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-amber-200" />;
      default:
        return <Info className="h-5 w-5 text-cyan-200" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case "success":
        return "border-teal-300/25 bg-teal-300/10";
      case "error":
        return "border-red-300/25 bg-red-400/10";
      case "warning":
        return "border-amber-300/25 bg-amber-300/10";
      default:
        return "border-cyan-300/25 bg-cyan-300/10";
    }
  };

  return (
    <div className={`fixed right-4 top-4 z-50 max-w-[calc(100vw-2rem)] transform transition-all duration-300 ease-in-out ${isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}`}>
      <div className={`flex items-center gap-3 rounded-lg border px-4 py-3 shadow-[0_18px_54px_rgba(0,0,0,0.32)] backdrop-blur-xl ${getBgColor()}`}>
        {getIcon()}
        <span className="text-sm font-semibold text-white">{message}</span>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="rounded-md p-1 text-white/70 transition hover:bg-white/10 hover:text-white"
          aria-label="Dismiss notification"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
