"use client";

import React, { useState } from "react";
import { useParams, useRouter, redirect } from "next/navigation";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Brain, RefreshCw } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function Page() {
  const { id } = useParams();
  const [username, setUsername] = useState("");
  const [avatarSeed, setAvatarSeed] = useState(() =>
    Math.random().toString(36).substring(7),
  );
  const [loading, setLoading] = useState(false);

  if (id) {
    const { data, error } = api.published.getById.useQuery(id as string);
    if (error) {
      toast.error("Error");
      redirect("/join");
    }
  }

  const { mutateAsync: addParticipant } =
    api.published.addParticipant.useMutation();
  const router = useRouter();

  const { data: existingParticipants } =
    api.published.getAllParticipants.useQuery(id as string);

  // Function to randomize avatar
  const randomizeAvatar = () => {
    setAvatarSeed(Math.random().toString(36).substring(7));
  };

  return (
    <div className="relative flex h-screen flex-col">
      <div className="sticky flex h-16 items-center justify-between px-4">
        <Button asChild className="p-6" variant="ghost">
          <div className="flex flex-row items-center gap-2">
            <div className="flex aspect-square size-8 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
              <Brain className="size-4" />
            </div>
            <div className="font-semibold">Brightmind</div>
          </div>
        </Button>
        <div className="rounded-lg bg-foreground/10 p-6 px-2 py-1">{id}</div>
      </div>

      <div className="flex h-full w-full flex-col items-center justify-center gap-8">
        <h1 className="text-4xl font-bold">Identify yourself!</h1>
        <Card className="w-[40rem]">
          <CardContent className="flex flex-row items-center gap-6 pt-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center gap-2">
              <Avatar className="size-24 border">
                <AvatarImage
                  src={(() => {
                    try {
                      const storedUser = sessionStorage.getItem("user");
                      const parsedUser = storedUser
                        ? JSON.parse(storedUser)
                        : null;
                      return (
                        parsedUser?.imageLink ??
                        `https://api.dicebear.com/9.x/avataaars/svg?seed=${avatarSeed}&backgroundColor=d1d4f9,ffdfbf,ffd5dc,b6e3f4,c0aede`
                      );
                    } catch (error) {
                      console.error("Error parsing user data:", error);
                      return `https://api.dicebear.com/9.x/avataaars/svg?seed=${avatarSeed}&backgroundColor=d1d4f9,ffdfbf,ffd5dc,b6e3f4,c0aede`;
                    }
                  })()}
                  alt="User Avatar"
                />
                <AvatarFallback>?</AvatarFallback>
              </Avatar>
              <Button
                variant="outline"
                className="mt-2 flex items-center gap-2"
                onClick={randomizeAvatar}
                disabled={!sessionStorage.getItem("user")}
              >
                <RefreshCw className="size-4" />
                Randomize Avatar
              </Button>
            </div>

            <div className="flex w-full flex-col gap-8">
              {/* Username Input */}
              <Input
                id="username"
                className="h-14 w-full text-lg"
                type="text"
                value={username}
                placeholder="Enter your username"
                onChange={(e) => setUsername(e.target.value)}
              />

              {/* Enter Game Button */}
              <Button
                className="h-14 w-full text-xl font-semibold"
                onClick={async () => {
                  if (loading) return; // Prevent multiple clicks if already loading
                  try {
                    setLoading(true);
                    if (id) {
                      const isParticipantExists = existingParticipants?.some(
                        (p) => p.username === username,
                      );
                      if (isParticipantExists) {
                        toast.error("Participant already exists!");
                        return; // Don't proceed if the participant already exists
                      }
                      const user = await addParticipant({
                        quizId: id as string,
                        username: username,
                        avatar: `https://api.dicebear.com/9.x/avataaars/svg?seed=${avatarSeed}&backgroundColor=d1d4f9,ffdfbf,ffd5dc,b6e3f4,c0aede`,
                      });
                      router.push(`/join/${id}/lobby/${user?._id.toString()}`);
                    }
                  } catch (err) {
                    console.log(err);
                    toast.error("Something went wrong!");
                  }
                }}
                disabled={loading} // Disable button when loading
              >
                {loading ? "Entering..." : "Enter Game"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
