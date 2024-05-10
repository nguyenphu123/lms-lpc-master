"use client";
import { Button } from "@/components/ui/button";
import axios from "axios";
import Link from "next/link";
import { useQuery } from "react-query";

export const IsTeacher = ({ userId }: any) => {
  const fetchUserPermission = async () => {
    const { data } = await axios.get(`/api/user/${userId}`);
    return data;
  };
  const { data, error, isLoading } = useQuery(
    "userPermission",
    fetchUserPermission
  );

  if (error) {
    return <></>;
  }
  if (isLoading) {
    return <></>;
  } else {
    return data.userPermission.length <= 3 &&
      data.userPermission
        .map((item: { permission: { title: any } }) => item.permission.title)
        .indexOf("Create personal report") != -1 &&
      data.userPermission
        .map((item: { permission: { title: any } }) => item.permission.title)
        .indexOf("User personal management permission") != -1 &&
      data.userPermission
        .map((item: { permission: { title: any } }) => item.permission.title)
        .indexOf("Study permission") != -1 ? (
      <></>
    ) : (
      <Link href="/teacher/programs">
        <Button size="sm" variant="ghost">
          Teacher mode
        </Button>
      </Link>
    );
  }
};
