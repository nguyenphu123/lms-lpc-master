import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { clerkClient } from "@clerk/nextjs";
const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");
export async function POST(req: Request) {
  try {
    const { createdUserId, department, emailAddress, username } =
      await req.json();

    let user = await clerkClient.users.updateUserMetadata(createdUserId, {
      publicMetadata: {
        role: "STAFF",
        department: department,
      },
    });
    let creatUser = await db.user.create({
      data: {
        id: createdUserId,
        role: "STAFF",
        email: emailAddress,
        status: "pending",
        username: username,
        star: 0,
      },
    });
    await db.department.upsert({
      where: {
        title: department,
      },
      create: {
        title: department,
        User: {
          connect: {
            id: createdUserId,
          },
        },
      },
      update: {
        User: {
          connect: {
            id: createdUserId,
          },
        },
      },
    });
    const adminList = await db.user.findMany({
      where: {
        role: "ADMIN",
      },
    });
    const adminEmail = adminList.map((item) => item.email);
    const mess = {
      from: "Webmaster@lp.com.vn",
      to: adminEmail.toString(),
      cc: adminEmail.toString(),
      subject: `${emailAddress} have requested to be approved into the system`,
      text: `<p dir="ltr">&nbsp;</p>
      Please check and approved this user into the system.<br/>
      <p dir="ltr">username: 
      ${username} 
      <br/>email: 
      ${emailAddress} `,
      html: `<p dir="ltr">&nbsp;</p>
      Please check and approved this user into the system.<br/>
      <p dir="ltr">username: 
      ${username} 
      <br/>email: 
      ${emailAddress} `,
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
    return NextResponse.json(creatUser);
  } catch (error) {
    console.log("create user: ", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
