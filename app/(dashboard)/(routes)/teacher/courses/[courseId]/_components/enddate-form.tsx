"use client";
import { Asterisk } from "lucide-react";
import { useState, useEffect } from "react";

interface EndDateFormProps {
  courseId: string;
  initialEndDate: string | null;
}

export const EndDateForm: React.FC<EndDateFormProps> = ({ courseId, initialEndDate }) => {
  const [endDate, setEndDate] = useState<string | null>(initialEndDate);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (endDate) {
      const currentDate = new Date();
      const endDateObj = new Date(endDate);
      if (endDateObj < currentDate) {
        setIsExpired(true);
      } else {
        setIsExpired(false);
      }
    }
  }, [endDate]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.target.value);
  };

  const handleSubmit = async () => {
    // Call an API or update the database to save the end date for the course
  };

  return (
    <div className="relative mt-6 border bg-slate-100 rounded-md p-4 dark:bg-slate-950">
      <div className="font-medium flex items-center justify-between text-black dark:text-slate-50">
        <div className="flex items-center">
          Course End Date <Asterisk className="ml-2 text-red-500 size-4" />
        </div>
      </div>

      {/* Date Input */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-2">Select End Date</label>
        <input
          type="date"
          value={endDate || ""}
          onChange={handleDateChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Status */}
      <div className="mt-4">
        {isExpired ? (
          <div className="text-red-500">This course has expired.</div>
        ) : (
          <div className="text-green-500">This course is still active.</div>
        )}
      </div>

      {/* Save Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={isExpired}
        >
          Save End Date
        </button>
      </div>
    </div>
  );
};
