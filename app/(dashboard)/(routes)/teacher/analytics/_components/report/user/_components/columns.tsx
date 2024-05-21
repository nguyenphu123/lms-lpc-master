// @refresh reset
"use client";
import { User } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";

import { Accordion, AccordionItem } from "@nextui-org/react";

import {
  ReactElement,
  JSXElementConstructor,
  ReactNode,
  ReactPortal,
  PromiseLikeOfReactNode,
} from "react";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "username",
    header: () => {
      return <div>Name</div>;
    },
    cell: ({ row }) => {
      const { username }: any = row.original;

      return (
        <div className="flex items-center">
          <div>{username}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <span className="flex items-center cursor-pointer">
          <span className="mr-2">Email</span>
        </span>
      );
    },
  },

  {
    accessorKey: "department",
    header: ({ column }) => {
      return (
        <span className="flex items-center cursor-pointer">
          <span className="mr-2">Department</span>
        </span>
      );
    },
    cell: ({ row }) => {
      const { Department }: any = row.original;

      return (
        <div className="flex items-center">
          <div>{Department.title}</div>
        </div>
      );
    },
  },

  {
    accessorKey: "star",
    header: ({ column }) => {
      return (
        <span className="flex items-center cursor-pointer">
          <span className="mr-2">Star</span>
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <span className="flex items-center cursor-pointer">
          <span className="mr-2">Status</span>
        </span>
      );
    },
  },
  {
    accessorKey: "ClassSessionRecord",
    header: ({ column }) => {
      return (
        <span className="flex items-center cursor-pointer">
          <span className="mr-2">User course record</span>
        </span>
      );
    },
    cell: ({ row }) => {
      const { id, ClassSessionRecord }: any = row.original;

      return (
        <div className="flex items-center">
          <div>
            {ClassSessionRecord.map(
              (item: {
                id: any | null | undefined;
                course: {
                  Module: any;
                  title:
                    | string
                    | number
                    | boolean
                    | ReactElement<any, string | JSXElementConstructor<any>>
                    | Iterable<ReactNode>
                    | ReactPortal
                    | PromiseLikeOfReactNode
                    | null
                    | undefined;
                };
                progress:
                  | string
                  | number
                  | boolean
                  | ReactElement<any, string | JSXElementConstructor<any>>
                  | Iterable<ReactNode>
                  | ReactPortal
                  | PromiseLikeOfReactNode
                  | null
                  | undefined;
                status:
                  | string
                  | number
                  | boolean
                  | ReactElement<any, string | JSXElementConstructor<any>>
                  | Iterable<ReactNode>
                  | PromiseLikeOfReactNode
                  | null
                  | undefined;
              }) => {
                return (
                  <div key={item.id}>
                    <Accordion key="1">
                      <AccordionItem
                        startContent={
                          <div>
                            {item.course.title}:{item.progress}(
                            <span
                              className={`${
                                item.status == "finished"
                                  ? "text-green-500"
                                  : item.status == "studying"
                                  ? "text-yellow-500"
                                  : "text-red-500"
                              }`}
                            >
                              {item.status}
                            </span>
                            )
                          </div>
                        }
                      >
                        {item.course.Module.filter(
                          (item: { type: string }) => item.type == "Exam"
                        ).map((item: any) => {
                          return item.UserProgress.filter(
                            (item: any) => item.userId == id
                          ).length < 1 ? (
                            <>No exam result</>
                          ) : (
                            <div key={item.id}>
                              All course exam result:
                              {item.UserProgress.filter(
                                (item: any) => item.userId == id
                              ).map((item: any) => {
                                return (
                                  <div key={item.id}>
                                    {item.module.title}
                                    <span
                                      className={`${
                                        item.status == "finished"
                                          ? "text-green-500"
                                          : item.status == "studying"
                                          ? "text-yellow-500"
                                          : "text-red-500"
                                      }`}
                                    >
                                      {item.status}
                                    </span>
                                    ({item.score}%) on{" "}
                                    {new Date(item.endDate).toLocaleTimeString(
                                      [],
                                      {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      }
                                    )}{" "}
                                    {new Date(item.endDate).toLocaleDateString(
                                      "vi-VN",
                                      {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                      }
                                    )}{" "}
                                  </div>
                                );
                              })}
                            </div>
                          );
                        })}
                      </AccordionItem>
                    </Accordion>
                  </div>
                );
              }
            )}
          </div>
        </div>
      );
    },
  },
];
