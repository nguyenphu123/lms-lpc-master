import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    const { departmentList, assignList }: any = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course: any = await db.course.findUnique({
      where: {
        id: params.courseId,
      },
    });

    // Delete existing links between course and departments
    const deleteAllLink = await db.courseOnDepartment.deleteMany({
      where: {
        courseId: params.courseId,
      },
    });

    const date = new Date();
    // Handle department assignments
    for (let i = 0; i < departmentList.length; i++) {
      if (departmentList[i].isEnrolled && departmentList[i].canUndo) {
        await db.courseOnDepartment.create({
          data: {
            courseId: params.courseId,
            departmentId: departmentList[i].id,
          },
        });
      }
    }

    // Handle class session records for users
    for (let i = 0; i < assignList.length; i++) {
      if (assignList[i].isEnrolled && assignList[i].canUndo) {
        // Check if a session record already exists for the user
        let checkIfExist = await db.classSessionRecord.findFirst({
          where: {
            userId: assignList[i].id,
            courseId: params.courseId,
          },
        });

        if (
          checkIfExist?.status == "studying" ||
          checkIfExist?.status == "finished"
        ) {
          // If the user is already assigned to the course and their status is "studying" or "finished", skip
        } else {
          // Create or update the class session record, including the endDate
          await db.classSessionRecord.createMany({
            data: {
              userId: assignList[i].id,
              courseId: params.courseId,
              progress: "0%",
              status: "studying",
              startDate: date,
              endDate: assignList[i].endDate ? new Date(assignList[i].endDate) : null, // Update with endDate if provided
              maxAttempt: assignList[i].maxAttempt || 1,
            },
            skipDuplicates: true,
          });
        }
      }
    }

    // Fetch updated class session records to return
    const updatedRecords = await db.classSessionRecord.findMany({
      where: {
        courseId: params.courseId,
      },
      include: {
        user: true, // Include user information if needed
      },
    });

    return NextResponse.json({ success: true, updatedRecords });
  } catch (error) {
    console.log("DEPARTMENT_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
