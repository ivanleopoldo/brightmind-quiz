import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "https://mmis-brightmind.onrender.app",
  fetchOptions: {},
});
