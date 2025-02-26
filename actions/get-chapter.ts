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
        ClassSessionRecord: {
          where: {
            userId,
            courseId,
          },
        },

        ModuleInCourse: {
          include: {
            module: {

            }
          },
          where: {
            courseId: courseId,
            module: {
              isPublished: true
            }
          },
          orderBy: {
            position: "asc",
          },
        },
      },
    });

    const chapter: any = await db.moduleInCourse.findUnique({
      where: {
        courseId_moduleId: {
          moduleId: moduleId,
          courseId: courseId,
        },
        module:{
          isPublished: true
        }

      },
      include: {
        module: {}


        // Exam: {
        //   where: {
        //     moduleId: moduleId,
        //   },
        // },
      },
    });
    const currentChapterPos = course.ModuleInCourse.map(
      (item: { id: any }) => item.id
    ).indexOf(moduleId);
    const nextChapter = course.ModuleInCourse.map((item: { id: any }) => item.id)[
      currentChapterPos + 1
    ];
    const preChapter: any = course.ModuleInCourse.map((item: { id: any }) => item.id)[
      currentChapterPos > 0 ? currentChapterPos - 1 : -1
    ];
    if (!chapter || !course) {
      throw new Error("Chapter or course not found");
    }



    return {
      chapter,
      course,
      nextChapter,

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

      purchase: null,
    };
  }
};
