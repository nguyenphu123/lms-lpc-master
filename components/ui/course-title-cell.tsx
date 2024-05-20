"use client";

import { useAuth } from "@clerk/nextjs";
import { useQuery } from "react-query";
import axios from "axios";
import { Accordion, AccordionItem } from "@nextui-org/react";

export const CourseTitleCell = ({ row }: any) => {
  const { id, title, status, Module } = row.original;

  const { userId }: any = useAuth();
  const fetchUserPermission = async () => {
    const { data } = await axios.get(`/api/user/${userId}/personalInfo`);

    return data;
  };

  const { data, error, isLoading } = useQuery(
    "userPermission",
    fetchUserPermission
  );
  // console.log(data);
  if (isLoading) {
    return <></>;
  } else {
    return <>{title}</>;
  }
};
