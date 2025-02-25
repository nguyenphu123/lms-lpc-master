import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { moduleId: string } }
) {
  try {
    const { userId }: any = auth();
    const { title, contents, departmentId, } = await req.json();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const updateModule = await db.module.update({
      where: {
        id: params.moduleId,
      },
      data: {
        title,
        ...contents,
        departmentId,
      },
    });

    return NextResponse.json(updateModule);
  } catch (error) {
    console.log("[MODULE_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { moduleId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const module: any = await db.module.findUnique({
      where: {
        id: params.moduleId,
      },
    });
    return NextResponse.json(module);
  } catch (error) {
    console.log("[MODULE_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { moduleId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Delete the module by its ID
    const deletedModule = await db.module.delete({
      where: {
        id: params.moduleId,
      },
    });

    // Return a success response
    return NextResponse.json({ message: "Module deleted successfully", deletedModule });
  } catch (error) {
    console.log("[MODULE_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}