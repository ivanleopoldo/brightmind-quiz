import { createAuthClient } from "better-auth/react";
import dbConnect from "./db";

await dbConnect();

export const authClient = createAuthClient();
