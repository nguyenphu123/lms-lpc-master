import { db } from "@/lib/db";

export const getProgress = async (
  userId: string,
  courseId: string
): Promise<number> => {
  try {
    const publishedChapters = await db.module.findMany({
      where: {
        courseId: courseId,
        isPublished: true,
      },
      select: {
        id: true,
      },
    });

    const publishedChapterIds = publishedChapters.map((module) => module.id);

    const validCompletedChapters = await db.userProgress.count({
      where: {
        userId: userId,
        moduleId: {
          in: publishedChapterIds,
        },
        status: "finished",
      },
    });

    const progressPercentage =
      (validCompletedChapters / publishedChapterIds.length || 0) * 100;

    return progressPercentage;
  } catch (error) {
    console.log("[GET_PROGRESS]", error);
    return 0;
  }
};
