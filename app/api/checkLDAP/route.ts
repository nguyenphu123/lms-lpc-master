import { NextResponse } from "next/server";
var LdapClient = require("ldapjs-client");
export async function POST(req: Request) {
  try {
    const { emailAddress } = await req.json();
    let result: boolean = false;
    
    var client = new LdapClient({ url: "ldap://10.20.1.11:389" });
    try {
      await client.bind("trainconnect@lp.local", "Js46~p9@X3$Gu!");
    } catch (e) {
      console.log(e);
    }
    try {
      const options = {
        filter: `(mail=${emailAddress})`,
        scope: "sub",
        attributes: ["dn", "sn", "cn", "mail"],
      };

      const entries = await client.search("DC=lp,DC=local", options);
      result = entries[0].mail == emailAddress ? true : false;
    } catch (e) {
      console.log(e);
    }
    return NextResponse.json(result);
  } catch (error) {
    console.log("AD Error:", error);
    return NextResponse.json(false);
  }
}
