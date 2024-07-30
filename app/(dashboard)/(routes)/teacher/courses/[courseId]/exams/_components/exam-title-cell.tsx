"use client";

import { useAuth } from "@clerk/nextjs";
import { useQuery } from "react-query";
import axios from "axios";
import { Accordion, AccordionItem } from "@nextui-org/react";

export const ExamTitleCell = ({ row }: any) => {
  const { id, title, UserProgress } = row.original;

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
        <div
          key={item.id}
          // className="grid grid-cols-5 gap-4 p-4 bg-gray-100 rounded-md"
        >
          <div>{item.user.username}</div>
          <br />
          <hr />
          <br />
          {/* <div>
            <span className="font-semibold">Score:</span> {item.score}%
          </div>
          <div>
            <span className="font-semibold">Attempt:</span> {item.attempt}
          </div>
          <div>
            <span className="font-semibold">Last Attempt:</span>{" "}
            {new Date(item.endDate).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            {new Date(item.endDate).toLocaleDateString([], {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </div>

          <div
            className={`${
              item.status == "finished"
                ? "text-green-500"
                : item.status == "failed"
                ? "text-red-500"
                : "text-yellow-500"
            }`}
          >
            <span className="font-semibold">Status:</span> {item.status}
          </div> */}
        </div>
      );
    });
  }
};
