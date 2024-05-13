import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");
export async function PATCH(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId }: any = auth();
    const values = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await db.user.update({
      where: { id: params.userId },
      data: {
        status: values.status,
      },
    });
    const mess = {
      from: "Webmaster@lp.com.vn",
      to: user.email,
      cc: "",
      subject: `you have been ${values.status} the system`,
      text: `
      you have been ${values.status} the system
      `,
      html: `
        <p>you have been ${values.status} the system.</p>
        
      `,
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
      const res = await transporter.sendMail(mess);

      // return res.status(200).json({ success: true });
    } catch (err) {
      console.log("Mail send: ", err);
    }
    return NextResponse.json(user);
  } catch (error) {
    console.log("[PROGRAMS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId }: any = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: params.userId },
      include: {
        ClassSessionRecord: {
          where: {
            userId: params.userId,
          },
        },
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.log("[PROGRAMS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
