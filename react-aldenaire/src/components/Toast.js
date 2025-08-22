import React, { useEffect } from 'react';
import './Toast.css';

const Toast = ({ message, show, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className={`toast ${show ? 'show' : ''}`}>
      {message}
    </div>
  );
};

export default Toast; 