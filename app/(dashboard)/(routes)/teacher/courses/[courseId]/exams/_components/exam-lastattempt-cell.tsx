"use client";

import { useAuth } from "@clerk/nextjs";
import { useQuery } from "react-query";
import axios from "axios";
import { Accordion, AccordionItem } from "@nextui-org/react";

export const ExamLastAttemptCell = ({ row }: any) => {
  const { id, lastattempt, UserProgress } = row.original;

  const { userId }: any = useAuth();
  const fetchUserPermission = async () => {
    const { data } = await axios.get(`/api/user/${userId}/personalInfo`);

    return data;
  };

  const { data, error, isLoading } = useQuery(
    "userPermission",
    fetchUserPermission
  );

  if (isLoading) {
    return <></>;
  } else {
    return UserProgress.map((item: any) => {
      return (
        <div key={item.id}>
          <div>
            {new Date(item.endDate).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            {new Date(item.endDate).toLocaleDateString("vi-VN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </div>
          <br />
          <hr />
          <br />
        </div>
      );
    });
  }
};
