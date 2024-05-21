"use client";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { useQuery } from "react-query";

import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import axios from "axios";

const ReportPageCourse = () => {
  const fetchAllCourses = async () => {
    const { data } = await axios.get(`/api/courses`);

    return data;
  };

  const { data, error, isLoading } = useQuery("allCourse", fetchAllCourses);
  console.log(data);
  // const { userId } = auth();

  // if (!userId) {
  //   return redirect("/");
  // }

  // let data: any = [];
  // for (let i = 0; i < userProgress.length; i++) {
  //   for (let j = 0; j < userProgress[i].ClassSessionRecord.length; j++) {
  //     let item = {
  //       imageUrl: userProgress[i].ClassSessionRecord[j].user.imageUrl,
  //       username: userProgress[i].ClassSessionRecord[j].user.username,
  //       email: userProgress[i].ClassSessionRecord[j].user.email,
  //       department: userProgress[i].ClassSessionRecord[j].user.Department.title,
  //       status: userProgress[i].ClassSessionRecord[j].status,
  //       progress: userProgress[i].ClassSessionRecord[j].progress,
  //       // endDate: userProgress.ClassSessionRecord[i].endDate,
  //     };
  //     data.push(item);
  //   }
  // }
  if (isLoading) {
    return <></>;
  } else {
    return (
      <div className="p-6">
        <DataTable columns={columns} data={data} />
      </div>
    );
  }
};

export default ReportPageCourse;
