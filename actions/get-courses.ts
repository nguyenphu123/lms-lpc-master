import { Program, Course } from "@prisma/client";

import { getProgress } from "@/actions/get-progress";
import { db } from "@/lib/db";

type CourseWithProgressWithProgram = Course & {
  program: Program | null;
  module: { id: string }[];
  progress: number | null;
};

type GetCourses = {
  userId: string;
  title?: string;
  programId?: string;
};

export const getCourses = async ({
  userId,
  title,
  programId,
}: GetCourses): Promise<CourseWithProgressWithProgram[]> => {
  try {
    const courses = await db.course.findMany({
      where: {
        isPublished: true,
        title: {
          contains: title,
        },
      },
      include: {
        courseWithProgram: true,
        BookMark: true,
        ClassSessionRecord: true,
        Module: {
          where: {
            isPublished: true,
          },
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        startDate: "desc",
      },
    });

    const coursesWithProgress: any = await Promise.all(
      courses.map(async (course) => {
        const progressPercentage = await getProgress(userId, course.id);

        return {
          ...course,
          progress: progressPercentage,
        };
      })
    );

    return coursesWithProgress;
  } catch (error) {
    console.log("[GET_COURSES]", error);
    return [];
  }
};
