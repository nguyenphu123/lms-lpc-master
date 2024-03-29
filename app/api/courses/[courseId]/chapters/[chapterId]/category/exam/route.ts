import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import shuffleArray from "@/lib/shuffle";

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
        const { categoryId, title, numOfAppearance, score }: any = values[k];
        const category = await db.category.upsert({
          where: { id: categoryId },
          update: { title: title, numOfAppearance: parseInt(numOfAppearance) },
          create: {
            moduleId: chapter.id.toString(),
            title: title,
            numOfAppearance: parseInt(numOfAppearance),
            score: parseInt(score),
          },
        });
        for (let i = 0; i < values[k].question.length; i++) {
          const { id, question, type, score, anwser, compulsory }: any =
            values[k].question[i];
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
              categoryId: category.id,
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
    const questionsList: any = await db.module.findUnique({
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
    for (let i = 0; i < questionsList.Category.length; i++) {
      questionsList.Category[i]["question"] = questionsList.Category[i].Exam;
    }
    // console.log(questions);
    return NextResponse.json(questionsList);
  } catch (error) {
    console.log("[CHAPTER_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
