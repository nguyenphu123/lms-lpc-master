import { Timer } from "lucide-react";
import { useEffect, useState } from "react";

export const Countdown = ({ time }: any) => {
  const [number, setNumber] = useState(time * 60); // Convert to seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setNumber((prev: number) => {
        if (prev === 0) {
          clearInterval(interval);

          return prev;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [number]);

  const minutes = Math.floor(number / 60);
  const seconds = number % 60;

  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;

  return (
    <div className="flex ml-auto rounded-full bg-blue-500 p-2 text-white">
      <Timer />
      <span className="mr-2"></span>
      {formattedTime}
    </div>
  );
};
