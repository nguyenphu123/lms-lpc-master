"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
interface SlideProps {
  id: string;
  title: string;
  imageUrl: string;
}

export const Slide = ({ id, title, imageUrl }: SlideProps) => {
  return (
    <div className="group relative">
      <div className="group hover:shadow-sm transition overflow-hidden border rounded-lg h-full relative">
        <div className="relative rounded-md overflow-hidden aspect-video h-60 w-full">
          <Link href={`/programs/${id}`}>
            <Image
              fill
              className="object-cover"
              alt={title}
              src={imageUrl != null ? imageUrl.replace("public", "") : ""}
            />
          </Link>

          {/* <Link
            href={`/programs/${id}`}
            className="absolute bottom-8 left-10 bg-transparent text-white px-2 py-1 rounded-full border border-white m-2 transition  hover:text-blue-500"
          >
            Join Now
          </Link> */}
        </div>
      </div>
    </div>
  );
};
