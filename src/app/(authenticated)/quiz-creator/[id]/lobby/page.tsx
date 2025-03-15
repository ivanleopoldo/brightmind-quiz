"use client";

import { Clock, Users, Play } from "lucide-react";
import { useParams } from "next/navigation";
import { api } from "@/trpc/react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function QuizLobby() {
  const { id } = useParams();
  const { data } = api.published.getById.useQuery(id as string, {
    refetchInterval: 1000,
  });
  const { mutate: startQuiz } = api.published.startQuiz.useMutation();

  if (data?.start_status) {
    console.log("started");
  }

  const getTimeSinceJoined = (joinedAt: Date) => {
    const seconds = Math.floor(
      (new Date().getTime() - joinedAt.getTime()) / 1000,
    );
    return `${seconds}s ago`;
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-secondary/20 p-4">
      <Card className="w-full max-w-3xl shadow-lg">
        <CardHeader className="border-b pb-6 text-center">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="px-3 py-1">
              <Users className="mr-1 h-4 w-4" />
              {data?.participants.length} Players
            </Badge>
            <CardTitle className="text-2xl font-bold">Lobby</CardTitle>
            <Badge variant="secondary" className="px-3 py-1">
              {id}
            </Badge>
          </div>
          <CardDescription className="mt-2 text-lg">
            Start the quiz when you're ready!
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {data?.participants.map((player) => (
              <div
                key={player._id.toString()}
                className={`flex flex-col items-center rounded-lg p-3 transition-all duration-300`}
              >
                <Avatar className="mb-2 h-16 w-16">
                  <AvatarImage
                    src={player.avatar ?? ""}
                    alt={player.username}
                  />
                  <AvatarFallback>
                    {player.username.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 font-medium">
                    {player.username}
                  </div>
                  <div className="mt-1 flex items-center text-xs text-muted-foreground">
                    <Clock className="mr-1 h-3 w-3" />
                    {getTimeSinceJoined(player.joinedAt)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>

        <CardFooter className="flex justify-between border-t pt-6">
          <div className="flex items-center text-sm text-muted-foreground">
            <span>Share this room code with friends: </span>
            <Badge variant="outline" className="ml-2">
              {id}
            </Badge>
          </div>
          <Button
            onClick={() => {
              startQuiz(id as string);
            }}
            variant="outline"
          >
            <Play /> Start Quiz...
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
