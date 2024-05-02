import { getProgress } from "@/actions/get-progress";
import { CoursesListInProgram } from "@/components/courses-list-in-program";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
const ProgramIdPage = async ({ params }: { params: { programId: string } }) => {
  const { sessionClaims }: any = auth();
  const program: any = await db.program.findUnique({
    where: {
      id: params.programId,
      // courseWithProgram: {
      //   some: {
      //     programId: params.programId,
      //   },
      // },
    },
    include: {
      courseWithProgram: {
        include: {
          course: {
            include: {
              ClassSessionRecord: true,
              Module: true,
              BookMark: true,
            },
          },
        },
      },
    },
  });
  if (program != null) {
    return (
      <div className="container mx-auto p-8">
        <Link
          href={`/search`}
          className="flex items-center text-sm hover:opacity-75 transition mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
        <h1 className="font-bold text-3xl text-blue-700 mb-4 text-center">
          {program.title}
        </h1>
        <p className="text-black dark:text-white mb-8">{program.description}</p>
        No Course available.
      </div>
    );
  }
  const courses = program?.courseWithProgram?.map((item: any) => item.course);
  const coursesWithProgress: any = await Promise.all(
    courses?.map(async (course: { id: any }) => {
      const progressPercentage = await getProgress(
        sessionClaims.userId,
        course.id
      );

      return {
        ...course,
        progress: progressPercentage,
      };
    })
  );
  return (
    <div className="container mx-auto p-8">
      <Link
        href={`/search`}
        className="flex items-center text-sm hover:opacity-75 transition mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Home
      </Link>
      <h1 className="font-bold text-3xl text-blue-700 mb-4 text-center">
        {program.title}
      </h1>
      <p className="text-black dark:text-white mb-8">{program.description}</p>

      <CoursesListInProgram items={coursesWithProgress} />
    </div>
  );
};

export default ProgramIdPage;
