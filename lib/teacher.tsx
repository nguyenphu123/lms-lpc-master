"use client";
import { Button } from "@/components/ui/button";
import axios from "axios";
import Link from "next/link";
import { useQuery } from "react-query";

export const IsTeacher = ({ userId }: any) => {
  const fetchUserRole = async () => {
    const { data } = await axios.get(`/api/user/${userId}`);
    return data;
  };
  const { data, error, isLoading } = useQuery("userRole", fetchUserRole);

  if (isLoading) {
    return <></>;
  } else {
    return data.role == "ADMIN" || data.role == "MANAGER" ? (
      <Link href="/teacher/programs">
        <Button size="sm" variant="ghost">
          Teacher mode
        </Button>
      </Link>
    ) : (
      <></>
    );
  }
};
