import { db } from "@/lib/db";

interface GetExamProps {
  userId: string;
  courseId: string;
  examId: string;
}

export const getExam = async ({
  userId,
  examId,
  courseId,
}: GetExamProps) => {
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
        ExamInCourse: {
          include: {
            exam: {},
          },
          where: {
            courseId: courseId,
          },
        },
      },
    });

    const exam: any = await db.examInCourse.findUnique({
      where: {
        courseId_examId: {
          examId: examId,
          courseId: courseId,
        },
      },
      include: {
        exam: {},
      },
    });

    if (!exam || !course) {
      throw new Error("Exam not found");
    }

    return {
      exam,
      course,
    };
  } catch (error) {
    console.log("[GET_EXAM]", error);
    return {
      exam: null,
      course: null,
    };
  }
};
