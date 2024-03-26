"use client";
import { useTheme } from "next-themes";
import Image from "next/image";
const Logo = () => {
  const { theme } = useTheme();
  return (
    <Image
      height={130}
      width={130}
      alt="logo"
      src={theme == "dark" ? "/LPC_Logo_black.png" : "/LPC_Logo_white.png"}
    />
  );
};
export default Logo;
