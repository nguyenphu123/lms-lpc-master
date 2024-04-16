"use client";
import { useAuth, useUser } from "@clerk/nextjs";

export const getAuth = () => {
  try {
    const { userId }: any = useAuth();

    return userId;
  } catch (error) {
    console.log("[GET_AUTH]", error);
    return 0;
  }
};
