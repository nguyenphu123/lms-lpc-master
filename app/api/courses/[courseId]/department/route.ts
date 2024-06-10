import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");
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
    const deleteAllLink = await db.courseOnDepartment.deleteMany({
      where: {
        courseId: params.courseId,
      },
    });
    const date = new Date();
    for (let i = 0; i < departmentList.length; i++) {
      if (departmentList[i].isEnrolled) {
        const updateCourse = await db.courseOnDepartment.create({
          data: {
            courseId: params.courseId,
            departmentId: departmentList[i].id,
          },
        });
      } else {
      }
    }
    for (let i = 0; i < assignList.length; i++) {
      if (assignList[i].isEnrolled) {
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
        } else {
          const mess = {
            from: "Webmaster@lp.com.vn",
            to: assignList[i].email,
            cc: "",
            subject: `${assignList[i].email} has been assigned to course ${course.title}.`,
            text: `
              You have been assigned to course ${course.title}.`,
            html: `
              <p>You have been assigned to course ${course.title}</p>`,
          };
          let transporter = nodemailer.createTransport(
            smtpTransport({
              host: "smtp-mail.outlook.com",
              secureConnection: false, // TLS requires secureConnection to be false
              port: 587, // port for secure SMTP
              auth: {
                user: "Webmaster@lp.com.vn",
                pass: "Lpc@236238$",
              },
              tls: {
                ciphers: "SSLv3",
              },
            })
          );

          try {
            //send email
            // const res = await transporter.sendMail(mess);

            // return res.status(200).json({ success: true });
          } catch (err) {
            console.log("Mail send: ", err);
          }
        }
        await db.classSessionRecord.createMany({
          data: {
            userId: assignList[i].id,
            courseId: params.courseId,
            progress: "0%",
            status: "studying",
            startDate: date,
          },
          skipDuplicates: true,
        });
      }
    }

    return NextResponse.json("");
  } catch (error) {
    console.log("DEPARTMENT_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
