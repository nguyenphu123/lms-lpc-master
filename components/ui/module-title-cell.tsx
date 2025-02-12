"use client";

import { useAuth } from "@clerk/nextjs";
import { useQuery } from "react-query";
import axios from "axios";
import { Accordion, AccordionItem } from "@nextui-org/react";

export const ModuleTitleCell = ({ row }: any) => {
  const { id, title, status,  ModuleInCourse} = row.original;

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
    return data.userPermission
      .map((item: { permission: { title: any } }) => item.permission.title)
      .indexOf("Edit course permission") != -1 ? (
      <Accordion>
        <AccordionItem
          key="1"
          aria-label={title}
          title={title}
          className="dark:text-slate-50 justify-between w-3/5"
        >
          {ModuleInCourse.map((item: any) => {
            return <div key={item.course.id}>{item.course.title}</div>;
          })}
        </AccordionItem>
      </Accordion>
    ) : (
      <>{title}</>
    );
  }
};
