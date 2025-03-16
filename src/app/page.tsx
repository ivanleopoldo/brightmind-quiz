"use client";

import AuthForm from "@/components/auth-form";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function Login() {
  const login = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    await authClient.signIn.email(
      {
        email,
        password,
      },
      {
        onRequest: () => {
          toast.info("Logging in...");
        },
        onSuccess: () => {
          console.log("Logged in");
          toast.success("Logged in");
          redirect("/dashboard");
        },
        onError: (error) => {
          console.error("Login error:", error);
          toast({
            variant: "desctructive",
            title: "Login Failed",
            description: "Invalid Password or Email",
          });
        },
      },
    );
  };

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden bg-muted lg:block">
        <img
          src="/login-left.jpg"
          alt="Image"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
      <div className="flex flex-col gap-4 bg-[url('/login-bg.svg')] bg-cover bg-center bg-no-repeat p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <div className="flex h-6 w-28 items-center justify-center rounded-md">
            <img
              src="https://cdn.prod.website-files.com/6003cddbd7fb71cb58f75e43/6003d75f4362233400ba87f8_MMIS%20Logo%20(Full).svg"
              alt="Image"
              className="pointer-events-none"
            />
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <AuthForm
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const email = form.elements[0] as HTMLInputElement;
                const password = form.elements[1] as HTMLInputElement;
                login({ email: email.value, password: password.value });
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
