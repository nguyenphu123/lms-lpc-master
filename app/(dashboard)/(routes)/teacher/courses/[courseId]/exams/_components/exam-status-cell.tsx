"use client";

import { useAuth } from "@clerk/nextjs";
import { useQuery } from "react-query";
import axios from "axios";
import { Accordion, AccordionItem } from "@nextui-org/react";

export const ExamStatusCell = ({ row }: any) => {
  const { id, status, UserProgress } = row.original;

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
          <div
            className={`${
              item.status == "finished"
                ? "text-green-500"
                : item.status == "failed"
                ? "text-red-500"
                : "text-yellow-500"
            }`}
          >
            {item.status}
          </div>
          <br />
          <hr />
          <br />
        </div>
      );
    });
  }
};
