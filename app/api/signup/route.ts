import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { clerkClient } from "@clerk/nextjs";
const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");
export async function POST(req: Request) {
  try {
    const { createdUserId, department, emailAddress, username } =
      await req.json();

    let createUser = await db.user.create({
      data: {
        id: createdUserId,

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

    const mess = {
      from: "Webmaster@lp.com.vn",
      to: "phu.nguyen@lp.com.vn, khoa.nguyen@lp.com.vn",
      cc: "",
      subject: `${emailAddress} has requested approval to access the system`,
      text: `
        Please review and approve this user's request to access the system.
   
        Username: ${username}
        Email: ${emailAddress}
      `,
      html: `
        <p>Please review and approve this user's request to access the system.</p>
        <p><strong>Username:</strong> ${username}</p>
        <p><strong>Email:</strong> ${emailAddress}</p>
        <a href='http://lms.lp.local/teacher/users?email=${emailAddress}&task=approved' >
        <button style="background-color: green; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">
        Approve
    </button>
    </a>
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
    return NextResponse.json(createUser);
  } catch (error) {
    console.log("create user: ", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
