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
      <h1 className="text-4xl font-bold">{course.title}</h1>

      <div className="border border-blue-800 border-l-8 shadow-lg rounded-lg mt-8 mb-8">
        <h5 className="text-2xl font-bold p-5">Overview</h5>
        <div
          className="px-5 py-3 mb-3"
          dangerouslySetInnerHTML={{ __html: course.description }}
        ></div>
      </div>

      <div className="border border-blue-800 border-l-8 shadow-lg rounded-lg mt-8 mb-8">
        <h5 className="text-2xl font-bold p-5">Modules</h5>
        <ul className="list-disc ml-5 mr-5 mb-8">
          {course.Module.map((module: any) => (
            <li
              key={module.id}
              className="text-gray-700 text-base ml-3 dark:text-white mb-2"
            >
              {module.title}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CourseDescriptionPage;
