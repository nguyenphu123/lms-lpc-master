import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import shuffleArray from "@/lib/shuffle";

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
                answer: true,
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
    let questionUnShuffleList: any = [];
    let examMaxScore = 0;
    while (examMaxScore < 100) {
      for (let i = 0; i < questionsList.Category.length; i++) {
        let listQuestionByCategory: any = [];
        let finalListQuestionByCategory: any = [];
        let categoryMaxScore = 0;
        for (let j = 0; j < questionsList.Category[i].Exam.length; j++) {
          categoryMaxScore =
            categoryMaxScore +
            parseInt(questionsList.Category[i].Exam[j].score);

          questionsList.Category[i].Exam[j].answer = shuffleArray(
            questionsList.Category[i].Exam[j].answer
          );
          listQuestionByCategory = [
            ...listQuestionByCategory,
            questionsList.Category[i].Exam[j],
          ];
        }
        for (let x = 0; x < listQuestionByCategory.length; x++) {
          if (listQuestionByCategory[x].compulsory) {
            finalListQuestionByCategory = [
              ...finalListQuestionByCategory,
              listQuestionByCategory[x],
            ];
          }
        }
        while (
          finalListQuestionByCategory.length <
          questionsList.Category[i].numOfAppearance
        ) {
          const random = Math.floor(
            Math.random() * listQuestionByCategory.length
          );
          if (!listQuestionByCategory[random].compulsory) {
            finalListQuestionByCategory = [
              ...finalListQuestionByCategory,
              listQuestionByCategory[random],
            ];
          }
        }
        questionsList.Category[i]["categoryMaxScore"] = categoryMaxScore;
        questionUnShuffleList = Array.from(
          new Set([...questionUnShuffleList, ...finalListQuestionByCategory])
        );
        examMaxScore = examMaxScore + categoryMaxScore;
      }
    }

    const questions = {
      ...questionsList,
      examMaxScore,
      ExamList: shuffleArray(questionUnShuffleList),
    };
    // console.log(questions);
    return NextResponse.json(questions);
  } catch (error) {
    console.log("[CHAPTER_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
