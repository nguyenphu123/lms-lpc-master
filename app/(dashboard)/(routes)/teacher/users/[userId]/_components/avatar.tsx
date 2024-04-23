"use client";
import Image from "next/image";

const Avatar = ({ imageUrl }: any) => {
  return (
    <Image
      width={130}
      height={130}
      className="inline object-cover mr-2 rounded-full"
      src={imageUrl === null ? "/figure_605.png" : imageUrl}
      alt="Profile image"
    />
  );
};

export default Avatar;
