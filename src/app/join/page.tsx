"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Brain } from "lucide-react";
import { redirect } from "next/navigation";
import { api } from "@/trpc/react";
import { toast } from "sonner";

export default function Page() {
  const [joinCode, setJoinCode] = React.useState("");
  const [input, setInput] = React.useState("");
  const { data } = api.published.getById.useQuery(joinCode, {
    enabled: !!joinCode,
  });

  return (
    <div className="flex min-h-svh w-full flex-col items-center justify-center gap-8">
      <header className="flex flex-row items-center gap-4">
        <div className="flex aspect-square size-16 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
          <Brain className="size-12" />
        </div>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <h1 className="text-6xl font-bold">Brightmind</h1>
        </div>
      </header>
      <Card className="w-96">
        <div className="flex flex-row gap-2 p-4">
          <Input
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter code"
            type="text"
          />
          <Button
            onClick={() => {
              setJoinCode(input);
              if (!data) {
                toast.error("Code is invalid!");
                setInput("");
                return;
              }
              redirect(`/join/${joinCode}`);
            }}
          >
            Join
          </Button>
        </div>
      </Card>
    </div>
  );
}
