import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { db } from "@/lib/db";

import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import axios from "axios";

const ReportPage = async ({ params }: { params: { programId: string } }) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }
  const userProgress: any = await db.program.findUnique({
    where: {
      id: params.programId,
    },
    include: {
      courseWithProgram: {
        include: {
          course: {
            include: {
              ClassSessionRecord: {
                include: {
                  user: {
                    include: {
                      Department: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
  const numberOfFinishedCourses = async (userId: any) => {
    let count: number = 0;
    let progress: any = await db.classSessionRecord.findMany({
      where: {
        userId: userId,
      },
    });
    for (let i = 0; i < progress.length; i++) {
      count = count + parseInt(progress[i].progress?.replace("%", "")) / 100;
    }
    return count;
  };
  let data: any = [];
  for (let i = 0; i < userProgress.courseWithProgram.length; i++) {
    for (
      let j = 0;
      j < userProgress.courseWithProgram[i].course.ClassSessionRecord.length;
      j++
    ) {
      let item = {
        imageUrl:
          userProgress.courseWithProgram[i].course.ClassSessionRecord[j].user
            .imageUrl,
        username:
          userProgress.courseWithProgram[i].course.ClassSessionRecord[j].user
            .username,
        email:
          userProgress.courseWithProgram[i].course.ClassSessionRecord[j].user
            .email,
        department:
          userProgress.courseWithProgram[i].course.ClassSessionRecord[j].user
            .Department.title,
        status:
          (await numberOfFinishedCourses(
            userProgress.courseWithProgram[i].course.ClassSessionRecord[j].user
              .id
          )) == userProgress.courseWithProgram.length
            ? "finished"
            : "studying",
        progress:
          ((await numberOfFinishedCourses(
            userProgress.courseWithProgram[i].course.ClassSessionRecord[j].user
              .id
          )) /
            userProgress.courseWithProgram.length) *
            100 +
          "%",
        // endDate: userProgress.ClassSessionRecord[i].endDate,
      };

      if (
        data.length < 0 ||
        data.map((item: any) => item.username).indexOf(item.username) == -1
      ) {
        data.push(item);
      }
    }

    // let item = {};
  }

  return (
    <div className="p-6">
      <Link
        href="javascript:history.back()"
        className="flex items-center text-sm hover:opacity-75 transition mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to program setup
      </Link>
      <DataTable columns={columns} data={data} title={userProgress.title} />
    </div>
  );
};

export default ReportPage;
