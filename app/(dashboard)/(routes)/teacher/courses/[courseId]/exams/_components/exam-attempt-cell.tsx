"use client";

import { useAuth } from "@clerk/nextjs";
import { useQuery } from "react-query";
import axios from "axios";
import { Accordion, AccordionItem } from "@nextui-org/react";

export const ExamAttemptCell = ({ row }: any) => {
  const { id, attempt, UserProgress } = row.original;

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
    return UserProgress.map((item: any) => {
      return (
        <div key={item.id}>
          <div>{item.attempt}</div>
          <br />
          <hr />
          <br />
        </div>
      );
    });
  }
};
