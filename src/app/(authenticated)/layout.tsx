import React, { PropsWithChildren } from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { api } from "@/trpc/server";

export default async function Protected({ children }: PropsWithChildren) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/login");
  }
  return <React.Fragment>{children}</React.Fragment>;
}
