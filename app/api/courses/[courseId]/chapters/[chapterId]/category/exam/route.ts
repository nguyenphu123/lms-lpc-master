import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const ownCourse = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });

    if (!ownCourse) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const chapter = await db.module.findUnique({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
    });

    if (!chapter || !chapter.title) {
      return new NextResponse("Missing required fields", { status: 400 });
    }
    const data = await Promise.all(await req.json()).then(async function (
      values: any
    ) {
      for (let k = 0; k < values.length; k++) {
        const { categoryId, categoryTitle, numOfAppearance }: any = values[k];
        const category = await db.category.upsert({
          where: { id: categoryId },
          update: { title: categoryTitle, numOfAppearance },
          create: {
            moduleId: chapter.id.toString(),
            title: categoryTitle,
            numOfAppearance,
          },
        });
        for (let i = 0; i < values[k].questionList.length; i++) {
          const { id, question, type, score, anwser, compulsory }: any =
            values[k].questionList[i];
          let anwserList = [...anwser];
          for (let j = 0; j < anwserList.length; j++) {
            delete anwserList[j]["id"];
            delete anwserList[j]["examId"];
          }

          const createExam = await db.exam.upsert({
            where: {
              id: id.toString() || "",
            },
            update: {
              question,
              type,

              anwser: {
                deleteMany: { examId: id.toString() || "" },
                createMany: { data: [...anwserList] },
              },
            },
            create: {
              categoryId: categoryId,
              score,
              compulsory,
              question,
              type,

              anwser: {
                createMany: { data: [...anwserList] },
              },
            },
          });
        }
      }
    });

    return NextResponse.json("success");
  } catch (error) {
    console.log("[CHAPTER_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const questions = await db.module.findUnique({
      where: {
        id: params.chapterId,
      },
      include: {
        Category: {
          include: {
            Exam: {
              include: {
                anwser: true,
              },
            },
          },
        },

        UserProgress: {
          where: {
            userId: userId,
          },
        },
      },
    });
    // console.log(questions);
    return NextResponse.json(questions);
  } catch (error) {
    console.log("[CHAPTER_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
