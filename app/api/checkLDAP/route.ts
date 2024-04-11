import { NextResponse } from "next/server";
var LdapClient = require("ldapjs-client");
export async function POST(req: Request) {
  try {
    const { emailAddress } = await req.json();
    let result: boolean = false;
    // const client = ldap.createClient({
    //   url: "ldap://LPCDC001.lp.local",
    //   reconnect: true,
    //   idleTimeout: 3000, // ALTERED - To make testing this easier
    // });
    // client.on("connectError", (err) => {
    //   // handle connection error
    //   console.log("LDAP Error 1:", err);
    //   return NextResponse.json(false);
    // });
    // client.bind(
    //   "CN=Train Connecting,CN=Services,DC=lp,DC=local",
    //   "Js46~p9@X3$Gu!",
    //   (err) => {
    //     console.log("LDAP Error 2:", err);
    //     return NextResponse.json(false);
    //   }
    // );
    // const opts: any = {
    //   filter: `(mail=${emailAddress})`,
    //   scope: "base",
    //   attributes: ["dn", "sn", "cn"],
    // };

    // client.search("DC=lp,DC=local", opts, (err, res) => {
    //   console.log("LDAP Error 3:", err);
    //   console.log("res: ", res);
    //   res.on("searchRequest", (searchRequest) => {
    //     console.log("searchRequest: ", searchRequest.messageId);
    //   });
    //   res.on("searchEntry", (entry) => {
    //     console.log("entry: " + JSON.stringify(entry.pojo));
    //   });
    //   res.on("searchReference", (referral) => {
    //     console.log("referral: " + referral.uris.join());
    //   });
    //   res.on("error", (err) => {
    //     console.error("error: " + err.message);
    //   });
    //   res.on("end", (result: any) => {
    //     console.log("status: " + result);
    //   });
    // });
    // var config = {
    //   url: "ldap://LPCDC001.lp.local",
    //   baseDN: "DC=lp,DC=local",
    //   username: "trainconnect@lp.local",
    //   password: "Js46~p9@X3$Gu!",
    // };
    // let ad = new ActiveDirectory.promiseWrapper(config);
    // const userCheck = await ad.findUser("trainconnect");
    // console.log("userCheck: ", userCheck);
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
