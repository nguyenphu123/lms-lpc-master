import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import fs from "fs";
import { writeFile } from "fs/promises";
import path from "path";
export async function POST(
  req: any,
  { params }: { params: { courseId: string } }
) {
  try {
    const formData = await req.formData();

    const { courseId } = params;
    const file = await formData.get("file");
    if (!file) {
      return NextResponse.json(
        { error: "No files received." },
        { status: 400 }
      );
    }

    const folderName: any = `public/courses/${courseId}/courseImage`;
    const { userId }: any = auth();

    if (!fs.existsSync(folderName)) {
      fs.mkdirSync(folderName, { recursive: true });
    } else {
      fs.readdir(folderName, (err, files) => {
        // if (err) throw err;

        for (const file of files) {
          fs.unlink(path.join(folderName, file), (err) => {
            // if (err) throw err;
          });
        }
      });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = Date.now() + file.name.replaceAll(" ", "_");

    try {
      await writeFile(
        path.join(process.cwd(), folderName + "/" + filename),
        buffer
      );

      await db.course.update({
        where: {
          id: courseId,
          userId,
        },
        data: {
          imageUrl: folderName + "/" + filename,
        },
      });
      return NextResponse.json("OK");
    } catch (error) {
      console.log("Error occured ", error);
      return NextResponse.json({ Message: "Failed", status: 500 });
    }
  } catch (err) {
    console.error(err);
  }
}
