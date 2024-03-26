import { useEffect, useState } from "react";

export const countdown = (time: number, callback: () => void) => {
  const [number, setNumber] = useState(time * 60); // Convert to seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setNumber((prev: number) => {
        if (prev === 0) {
          clearInterval(interval);
          callback();
          return prev;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [callback]);

  const minutes = Math.floor(number / 60);
  const seconds = number % 60;

  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;

  return formattedTime;
};
