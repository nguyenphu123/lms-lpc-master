import { db } from "@/lib/db";

interface GetChapterProps {
  userId: string;
  courseId: string;
  moduleId: string;
}

export const getChapter = async ({
  userId,

  moduleId,
  courseId,
}: GetChapterProps) => {
  try {
    const course: any = await db.course.findUnique({
      where: {
        isPublished: true,
        id: courseId,
      },
      include: {
        Module: {
          where: {
            courseId: courseId,
            isPublished: true,
          },
          orderBy: {
            position: "asc",
          },
        },
      },
    });

    const chapter: any = await db.module.findUnique({
      where: {
        id: moduleId,
        courseId: courseId,
        isPublished: true,
      },
      include: {
        Slide: {
          where: {
            moduleId: moduleId,
          },
          orderBy: {
            position: "asc",
          },
        },
        Category: {
          where: {
            moduleId: moduleId,
          },
          include: {
            Exam: true,
          },
        },
        Resource: true,
        // Exam: {
        //   where: {
        //     moduleId: moduleId,
        //   },
        // },
      },
    });
    const currentChapterPos = course.Module.map(
      (item: { id: any }) => item.id
    ).indexOf(moduleId);
    const nextChapter = course.Module.map((item: { id: any }) => item.id)[
      currentChapterPos + 1
    ];
    const preChapter = course.Module.map((item: { id: any }) => item.id)[
      currentChapterPos > 0 ? currentChapterPos - 1 : -1
    ];
    if (!chapter || !course) {
      throw new Error("Chapter or course not found");
    }

    const userProgress = await db.userProgress.findUnique({
      where: {
        moduleId_userId: {
          userId,
          moduleId,
        },
      },
    });

    return {
      chapter,
      course,
      nextChapter,
      userProgress,
      preChapter,
    };
  } catch (error) {
    console.log("[GET_CHAPTER]", error);
    return {
      chapter: null,
      course: null,
      preChapter: null,
      attachments: [],
      nextChapter: null,
      userProgress: null,
      purchase: null,
    };
  }
};
