import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { getChapter } from "@/actions/get-chapter";
import { Banner } from "@/components/banner";
import { Preview } from "@/components/preview";
import { db } from "@/lib/db";

const CourseDescriptionPage = async ({
  params,
}: {
  params: { courseId: string };
}) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }
  const course: any = await db.course.findUnique({
    where: {
      id: params.courseId,
    },
    include: {
      Module: {
        where: {
          isPublished: true,
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  if (!course) {
    return redirect("/");
  }

  return (
    <div className="p-10">
      <h1 className="text-5xl">{course.title}</h1>

      <div className="border border-l-8 border-blue-800 shadow rounded-lg mt-8 mb-8">
        <h5 className="text-3xl font-bold m-5">What is this course about?</h5>
        <p className="text-gray-700 text-sm ml-5 mr-5 mb-8 dark:text-white">
          {course.description}
        </p>
      </div>
      <div className="border border-l-8 border-blue-800 shadow rounded-lg mt-8 mb-8">
        <h5 className="text-3xl font-bold m-5">Course content:</h5>
        <p className="text-gray-700 text-sm ml-5 mr-5 mb-8 dark:text-white">
          <ul className="list-disc">
            {course.Module.map((module: any) => (
              <li key={module.id}>{module.title}</li>
            ))}
          </ul>
        </p>
      </div>
    </div>
  );
};

export default CourseDescriptionPage;
