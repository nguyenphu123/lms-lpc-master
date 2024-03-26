import { NextResponse } from "next/server";
var ActiveDirectory = require("activedirectory2");

export async function POST(req: Request) {
  try {
    const { emailAddress, password } = await req.json();

    var config = {
      url: "ldap://LPCDC001.lp.local",
      baseDN: "DC=lp,DC=local",
      username: emailAddress,
      password: password,
    };
    var ad = new ActiveDirectory.promiseWrapper(config);
    const userCheck = await ad.authenticate(
      emailAddress,
      password
      // function (err: any, auth: any) {
      //   console.log(err)
      //   console.log(auth)
      //   return auth;
      // }
    );

    return NextResponse.json(userCheck);
  } catch (error) {
    console.log("[PROGRAMS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
