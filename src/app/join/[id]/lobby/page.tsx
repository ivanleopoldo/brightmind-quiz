"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Clock, Play, Users } from "lucide-react";
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

interface Player {
  id: string;
  name: string;
  avatar: string;
  isHost: boolean;
  joinedAt: Date;
}

export default function QuizLobby() {
  const { id } = useParams();
  const userId = sessionStorage.getItem("user");
  const router = useRouter();
  const [players, setPlayers] = useState<Player[]>([]);
  const [username, setUsername] = useState("");
  const [isJoined, setIsJoined] = useState(false);
  const [isHost, setIsHost] = useState(false);

  const userSeed = Math.random().toString(36).substring(2, 8);

  useEffect(() => {
    if (isJoined) return;

    const storedName =
      localStorage.getItem("quizUsername") ||
      `Player${Math.floor(Math.random() * 1000)}`;
    setUsername(storedName);
    localStorage.setItem("quizUsername", storedName);

    const currentPlayer = {
      id: userSeed,
      name: storedName,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userSeed}`,
      isHost: players.length === 0,
      joinedAt: new Date(),
    };

    setIsHost(players.length === 0);
    setPlayers((prev) => [...prev, currentPlayer]);
    setIsJoined(true);

    const playerNames = [
      "Alex",
      "Jordan",
      "Taylor",
      "Casey",
      "Riley",
      "Morgan",
    ];

    const joinInterval = setInterval(() => {
      if (players.length < 6) {
        const randomSeed = Math.random().toString(36).substring(2, 8);
        const randomName =
          playerNames[Math.floor(Math.random() * playerNames.length)];

        setPlayers((prev) => [
          ...prev,
          {
            id: randomSeed,
            name: `${randomName}${Math.floor(Math.random() * 100)}`,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${randomSeed}`,
            isHost: false,
            joinedAt: new Date(),
          },
        ]);
      } else {
        clearInterval(joinInterval);
      }
    }, 2000);

    return () => clearInterval(joinInterval);
  }, [isJoined, players.length]);

  const getTimeSinceJoined = (joinedAt: Date) => {
    const seconds = Math.floor(
      (new Date().getTime() - joinedAt.getTime()) / 1000,
    );
    return `${seconds}s ago`;
  };

  const startQuiz = () => {
    alert("Starting the quiz!");
    // router.push("/quiz")
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-secondary/20 p-4">
      <Card className="w-full max-w-3xl shadow-lg">
        <CardHeader className="border-b pb-6 text-center">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="px-3 py-1">
              <Users className="mr-1 h-4 w-4" />
              {players.length} Players
            </Badge>
            <CardTitle className="text-2xl font-bold">Quiz Lobby</CardTitle>
            <Badge variant="secondary" className="px-3 py-1">
              {id}
            </Badge>
          </div>
          <CardDescription className="mt-2 text-lg">
            Waiting for the host to start the quiz...
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {players.map((player) => (
              <div
                key={player.id}
                className={`flex flex-col items-center rounded-lg p-3 transition-all duration-300 ${
                  player.id === userSeed
                    ? "bg-primary/10 ring-1 ring-primary"
                    : "hover:bg-secondary"
                }`}
              >
                <Avatar className="mb-2 h-16 w-16">
                  <AvatarImage src={player.avatar} alt={player.name} />
                  <AvatarFallback>
                    {player.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 font-medium">
                    {player.name}
                    {player.isHost && (
                      <Badge variant="default" className="ml-1 text-xs">
                        Host
                      </Badge>
                    )}
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
          {isHost ? (
            <Button onClick={startQuiz} disabled={players.length < 2}>
              <Play className="mr-2 h-4 w-4" />
              Start Quiz
            </Button>
          ) : (
            <Button variant="outline" disabled>
              Waiting for host...
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
