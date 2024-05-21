"use client";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import axios from "axios";
import { useQuery } from "react-query";

const ReportPageProgram = () => {
  const fetchAllPrograms = async () => {
    const { data } = await axios.get(`/api/users`);

    return data;
  };

  const { data, error, isLoading } = useQuery("allPrograms", fetchAllPrograms);

  // const { userId } = auth();

  // if (!userId) {
  //   return redirect("/");
  // }

  // const numberOfFinishedCourses = async (userId: any) => {
  //   let count: number = 0;
  //   let progress: any = await db.classSessionRecord.findMany({
  //     where: {
  //       userId: userId,
  //     },
  //   });
  //   for (let i = 0; i < progress.length; i++) {
  //     count = count + parseInt(progress[i].progress?.replace("%", "")) / 100;
  //   }
  //   return count;
  // };
  // let data: any = [];
  // for (let i = 0; i < userProgress.courseWithProgram.length; i++) {
  //   for (
  //     let j = 0;
  //     j < userProgress.courseWithProgram[i].course.ClassSessionRecord.length;
  //     j++
  //   ) {
  //     let item = {
  //       imageUrl:
  //         userProgress.courseWithProgram[i].course.ClassSessionRecord[j].user
  //           .imageUrl,
  //       username:
  //         userProgress.courseWithProgram[i].course.ClassSessionRecord[j].user
  //           .username,
  //       email:
  //         userProgress.courseWithProgram[i].course.ClassSessionRecord[j].user
  //           .email,
  //       department:
  //         userProgress.courseWithProgram[i].course.ClassSessionRecord[j].user
  //           .Department.title,
  //       status:
  //         (await numberOfFinishedCourses(
  //           userProgress.courseWithProgram[i].course.ClassSessionRecord[j].user
  //             .id
  //         )) == userProgress.courseWithProgram.length
  //           ? "finished"
  //           : "studying",
  //       progress:
  //         ((await numberOfFinishedCourses(
  //           userProgress.courseWithProgram[i].course.ClassSessionRecord[j].user
  //             .id
  //         )) /
  //           userProgress.courseWithProgram.length) *
  //           100 +
  //         "%",

  //     };

  //     if (
  //       data.length < 0 ||
  //       data.map((item: any) => item.username).indexOf(item.username) == -1
  //     ) {
  //       data.push(item);
  //     }
  //   }

  //   // let item = {};
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

export default ReportPageProgram;
