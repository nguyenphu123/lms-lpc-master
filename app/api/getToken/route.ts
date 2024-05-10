import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

import axios from "axios";
export async function GET(req: Request) {
  const { userId }: any = auth();
  try {
    let userInfo: any = await db.user.findUnique({
      where: { id: userId, status: "approved" },
    });

    let getToken = await axios.post(
      process.env.VNG_URL + "",
      JSON.stringify({
        auth: {
          identity: {
            methods: ["password"],
            password: {
              user: {
                domain: {
                  name: "default",
                },
                name: process.env.USERNAME_VNG,
                password: process.env.PASSWORD,
              },
            },
          },
          scope: {
            project: {
              domain: {
                name: "default",
              },
              id: process.env.ID,
            },
          },
        },
      }),
      {
        headers: {
          "Content-Type": "application/json",

          "Access-Control-Allow-Origin": "*",
        },
      }
    );

    return NextResponse.json(getToken.headers);
  } catch (error) {
    console.log("TOKEN ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
