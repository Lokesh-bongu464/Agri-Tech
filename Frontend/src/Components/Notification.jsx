import React, { useState, useEffect } from "react";

const Notification = ({ message, type = "info", duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose]);

  if (!isVisible || !message) return null;

  let bgColorClass = "bg-blue-500"; // info
  if (type === "success") bgColorClass = "bg-green-500";
  if (type === "error") bgColorClass = "bg-red-500";
  if (type === "warning") bgColorClass = "bg-yellow-500";

  return (
    <div
      className={`fixed top-24 left-1/2 transform -translate-x-1/2 p-4 rounded-lg shadow-lg text-white ${bgColorClass} z-50 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      role="alert"
    >
      <p>{message}</p>
      <button
        onClick={() => {
          setIsVisible(false);
          if (onClose) onClose();
        }}
        className="absolute top-1 right-2 text-white text-lg font-bold"
        tabIndex={0}
        aria-label="Dismiss notification"
      >
        &times;
      </button>
    </div>
  );
};

export default Notification;
