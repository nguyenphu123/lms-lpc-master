import Ably from "ably/promises";

export async function GET() {
  try {
    const client: any = new Ably.Realtime(
      "n-gD0A.W4KQCg:GyPm6YTLBQsr4KhgPj1dLCwr0eg4y7OVFrBuyztiiWg"
    );
    const tokenRequestData = await client.auth.createTokenRequest({
      clientId: "ably-nextjs-demo",
    });
    return Response.json(tokenRequestData);
  } catch (e) {
    console.log(e);
  }
}
