import { NextResponse } from "next/server";
let ActiveDirectory = require("activedirectory2");

export async function POST(req: Request) {
  try {
    const { emailAddress } = await req.json();

    var config = {
      url: "ldap://LPCDC001.lp.local",
      baseDN: "DC=lp,DC=local",
      username: "trainconnect@lp.local",
      password: "Js46~p9@X3$Gu!",
    };
    let ad = new ActiveDirectory.promiseWrapper(config);
    const userCheck = await ad.findUser(emailAddress);

    return NextResponse.json(userCheck + " 1");
  } catch (error) {
    console.log("AD Error:", error);
    return NextResponse.json(error + " 2");
  }
}
