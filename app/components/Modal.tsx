// components/Modal.tsx

import React from "react";

interface ModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, title, message, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-start justify-center z-50">
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      <div className="bg-green-200 rounded-lg p-6 z-10 w-full max-w-md mx-4 mt-20">
        <p className="mt-4 text-green-800  border-l-4 border-green-600 rounded-lg p-4 shadow-md transition-all duration-300 transform hover:scale-105">
          {message}
        </p>
        <div className="mt-6 flex justify-center">
          <button
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
