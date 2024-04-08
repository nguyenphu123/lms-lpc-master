import { db } from "@/lib/db";
import { NextResponse } from "next/server";
let ActiveDirectory = require("activedirectory2");
var CryptoJS = require("crypto-js");
export async function POST(req: Request) {
  try {
    const { emailAddress, password } = await req.json();

    var config = {
      url: "ldap://LPCDC001.lp.local",
      baseDN: "DC=lp,DC=local",
      username: "trainconnect@lp.local",
      password: "Js46~p9@X3$Gu!",
    };
    var bytes = CryptoJS.AES.decrypt(password, "1");
    var originalpassword = bytes.toString(CryptoJS.enc.Utf8);
    let ad = new ActiveDirectory.promiseWrapper(config);
    const userCheck = await ad.authenticate(emailAddress, originalpassword);
    const userCheck2 = await db.user.count({
      where: {
        email: emailAddress,
      },
    });

    return NextResponse.json(userCheck && userCheck2 > 0 ? true : false);
  } catch (error) {
    console.log("[PROGRAMS]", error);
    return NextResponse.json(false);
  }
}
