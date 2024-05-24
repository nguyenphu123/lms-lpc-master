"use client";

import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  items: string[];
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  items,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-lg max-w-lg w-full">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <ul>
          {items.map((item, index) => (
            <li key={index} className="py-1">
              {item}
            </li>
          ))}
        </ul>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};
