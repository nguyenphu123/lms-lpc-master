import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function DELETE(
  req: Request,
  { params }: { params: { programId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const program = await db.program.findUnique({
      where: {
        id: params.programId,
        userId: userId,
      },
    });

    if (!program) {
      return new NextResponse("Not found", { status: 404 });
    }

    const deletedProgram = await db.program.delete({
      where: {
        id: params.programId,
      },
    });

    return NextResponse.json(deletedProgram);
  } catch (error) {
    console.log("[PROGRAM_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { programId: string } }
) {
  try {
    const { userId } = auth();
    const { programId } = params;
    const values = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const program = await db.program.update({
      where: {
        id: programId,
        userId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(program);
  } catch (error) {
    console.log("[PROGRAM_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
export async function GET(
  req: Request,
  { params }: { params: { programId: string } }
) {
  try {
    const { userId } = auth();
    const { programId } = params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const program = await db.program.findUnique({
      where: {
        id: programId,
      },
    });

    return NextResponse.json(program);
  } catch (error) {
    console.log("[PROGRAM_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
