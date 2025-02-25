import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { categoryId: string } }
) {
  try {
    const { userId }: any = auth();
    const { contents } = await req.json();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const updateCategory = await db.category.update({
      where: {
        id: params.categoryId,
      },
      data: {
        ...contents,
      },
    });

    return NextResponse.json(updateCategory);
  } catch (error) {
    console.log("[CHAPTER_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { categoryId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const category: any = await db.exam.findUnique({
      where: {
        id: params.categoryId,
      },
    });
    return NextResponse.json(category);
  } catch (error) {
    console.log("[CHAPTER_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
export async function POST(
  req: Request,
  { params }: { params: { categoryId: string } }
) {
  try {
    const { userId }: any = auth();
    const  contents  = await req.json();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    const createCategory = await db.category.create({
      data: {
        ...contents,
      },
    });
    for (let i = 0; i < contents.questionsList.length; i++) {
      const newQuestion = await db.question.create({
        data: {
          ...contents.questionsList[i],
        },
      });
    }

    return NextResponse.json(createCategory);
  } catch (error) {
    console.log("[CHAPTER_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
