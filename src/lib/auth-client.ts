import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "http://mmis-brightmind.netlify.app",
});
