"use client";

import React from "react";
import { api } from "@/trpc/react";
import { useParams } from "next/navigation";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Results() {
  const { id, userId } = useParams();
  const { data: participants, isLoading: isParticipantsLoading } =
    api.published.getAllParticipants.useQuery(id as string, {
      refetchInterval: 1000,
    });
  if (isParticipantsLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="flex h-screen w-full items-center justify-center p-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Results</CardTitle>
        </CardHeader>
        <CardContent className="">
          <div className="max-h-[calc(100vh-10rem)] overflow-y-auto">
            {participants
              ?.sort((a, b) => b.score - a.score)
              .map((player, index) => (
                <div
                  key={player._id.toString()}
                  className={`flex items-center rounded-lg p-3 ${
                    player._id.toString() === userId
                      ? "bg-primary/10 ring-1 ring-primary"
                      : ""
                  }`}
                >
                  <div className="flex flex-1 items-center gap-3">
                    <div className="w-6 text-center font-bold">{index + 1}</div>
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={player.avatar ?? ""}
                        alt={player.username}
                      />
                      <AvatarFallback>
                        {player.username.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex w-full flex-row justify-between">
                      <div className="flex items-center gap-12 font-medium">
                        {player.username}
                        {player._id.toString() === userId && (
                          <Badge className="ml-1 text-xs">You</Badge>
                        )}
                      </div>
                      <div className="flex items-center font-medium">
                        {player.score} pts.
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
