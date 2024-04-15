"use client";
import { auth, useAuth } from "@clerk/nextjs";

export default function getAuth() {
  try {
    const { userId }: any = useAuth();

    return userId;
  } catch (error) {
    console.log("[GET_AUTH]", error);
    return 0;
  }
}
