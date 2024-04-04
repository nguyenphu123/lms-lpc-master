"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { getFromStorage, saveToStorage } from "./current-theme";

import { Moon, Sun } from "lucide-react";
export function ModeToggle() {
  const { setTheme, systemTheme } = useTheme();
  const [currentTheme, setCurrentTheme] = useState("light");
  useEffect(() => {
    setCurrentTheme(getFromStorage("theme") as string);
  }, []);
  const onChange = (e: any) => {
    e.preventDefault();
    if (currentTheme != "dark") {
      setTheme("dark");
      setCurrentTheme("dark");
      saveToStorage("theme", "dark");
    } else {
      setTheme("light");
      setCurrentTheme("light");
      saveToStorage("theme", "light");
    }
  };
  return currentTheme == "dark" ? (
    <div onClick={(e) => onChange(e)} className="inline-flex cursor-pointer">
      <Moon />
    </div>
  ) : (
    <div onClick={(e) => onChange(e)} className="inline-flex cursor-pointer">
      <Sun />
    </div>
  );
}
