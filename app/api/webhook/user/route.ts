import { headers } from "next/headers";
import { Webhook } from "svix";

const webhookSecret = process.env.WEBHOOK_SECRET || "";

async function handler(request: Request) {
  const payload = await request.json();
  const headersList = headers();
  const heads = {
    "svix-id": headersList.get("svix-id"),
    "svix-timestamp": headersList.get("svix-id"),
    "svix-signature": headersList.get("svix-id"),
  };
  const wh = new Webhook(webhookSecret);
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
