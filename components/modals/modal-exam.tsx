"use client";
 
import React from "react";
 
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  examDetails: {
    title: string;
    passedCount: number;
    totalUsers: number;
    passedUsers: string[];
    studyingUsers: { username: string; progress: number }[];
  }[];
}
 
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  examDetails,
}) => {
  if (!isOpen) return null;
 
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 ">
      <div
        className="fixed inset-0 bg-gray-900 bg-opacity-50"
        onClick={onClose}
      ></div>
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full mx-4 md:mx-0 z-50 dark:bg-slate-700">
        <div className="p-4 border-b relative">
          <h2 className="text-xl font-semibold">Exam Details</h2>
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <div className="p-4 max-h-80 overflow-y-auto">
          {examDetails.map((exam, index) => (
            <div key={index} className="mb-4">
              <h3 className="text-lg font-medium">
                {exam.title} ({exam.passedCount}/{exam.totalUsers})
              </h3>
              <div className="mb-2">
                <h4 className="font-medium">Passed:</h4>
                <ul className="space-y-2">
                  {exam.passedUsers.length === 0 ? (
                    <li className="italic text-gray-500">Nobody</li>
                  ) : (
                    exam.passedUsers.map((user, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <span className="text-gray-700">{index + 1}.</span>
                        <span className="text-gray-900">{user}</span>
                      </li>
                    ))
                  )}
                </ul>
              </div>
              <div>
                <h4 className="font-medium">Studying:</h4>
                <ul className="space-y-2">
                  {exam.studyingUsers.length === 0 ? (
                    <li className="italic text-gray-500">Nobody</li>
                  ) : (
                    exam.studyingUsers.map((user, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <span className="text-gray-700">{index + 1}.</span>
                        <span className="text-gray-900">
                          {user.username}{" "}
                          <span className="text-yellow-500 font-medium">
                            ({user.progress.toFixed(0)}%)
                          </span>
                        </span>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t text-right">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};