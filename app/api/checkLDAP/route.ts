import { NextResponse } from "next/server";
let ActiveDirectory = require("activedirectory2");

export async function POST(req: Request) {
  try {
    const { emailAddress } = await req.json();

    var config = {
      url: "ldap://LPCDC001.lp.local",
      baseDN: "DC=lp,DC=local",
      username: "phu.nguyen@lp.com.vn",
      password: "&Lkj11iop89*",
    };
    let ad = new ActiveDirectory.promiseWrapper(config);
    const userCheck = await ad.findUser(emailAddress);

    return NextResponse.json(userCheck);
  } catch (error) {
    console.log("AD Error:", error);
    return NextResponse.json(false);
  }
}
