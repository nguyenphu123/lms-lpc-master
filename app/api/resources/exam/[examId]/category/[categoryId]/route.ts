import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { categoryId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const categoryList: any = await db.category.findMany({});
    return NextResponse.json(categoryList);
  } catch (error) {
    console.log("[EXAM_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
export async function PATCH(
  req: Request,
  { params }: { params: { categoryId: string; questionId: string } }
) {
  try {
    const { userId, category }: any = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const updatecategory = await db.category.update({
      where:{
        id: params.categoryId,
      },
      data: {
        ...category,
      },
    });

    return NextResponse.json(updatecategory);
  } catch (error) {
    console.log("[CHAPTER_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}