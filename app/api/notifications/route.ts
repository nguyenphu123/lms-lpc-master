import Ably from "ably/promises";

export async function GET() {
  const client: any = new Ably.Realtime(process.env.ABLY_API_KEY + "");
  const tokenRequestData = await client.auth.createTokenRequest({
    clientId: "ably-nextjs-demo",
  });
  return Response.json(tokenRequestData);
}
