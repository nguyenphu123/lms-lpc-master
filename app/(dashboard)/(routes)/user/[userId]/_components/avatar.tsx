"use client";
import Image from "next/image";
const Avatar = ({ imageUrl }: any) => {
  return (
    <Image
      src={imageUrl}
      height={32}
      width={32}
      className="w-8 h-8 rounded-full mr-2"
      alt={""}
    />
  );
};

export default Avatar;
