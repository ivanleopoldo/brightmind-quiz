import { getAuth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export async function POST(req: Request) {
  const auth = await getAuth();
  const handler = toNextJsHandler(auth);
  return handler.POST(req);
}

export async function GET(req: Request) {
  const auth = await getAuth();
  const handler = toNextJsHandler(auth);
  return handler.GET(req);
}
