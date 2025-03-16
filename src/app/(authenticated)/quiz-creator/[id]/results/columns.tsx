"use client";

import { ColumnDef } from "@tanstack/react-table";
import { type TParticipant } from "@/lib/types";
import { Check, X } from "lucide-react";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export const columns: ColumnDef<TParticipant>[] = [
  {
    accessorKey: "hasAnswered",
    header: "Status",
    cell: ({ row }) => {
      const value = row.getValue("hasAnswered");
      return (
        <div
          className={cn(
            "size-8 flex aspect-square items-center justify-center rounded-lg text-background",
            value ? "bg-green-400" : "bg-primary",
          )}
        >
          {value ? <Check className="size-4" /> : <X className="size-4" />}
        </div>
      );
    },
    enableResizing: false,
    size: 20,
  },
  {
    accessorKey: "avatar",
  },
  {
    accessorKey: "username",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Username
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const avatar = row.getValue("avatar");
      const username = row.getValue("username");
      return (
        <div className="flex flex-row items-center gap-4">
          <Avatar className="mb-2 h-10 w-10">
            <AvatarImage src={avatar} alt={username} />
            <AvatarFallback>
              {username.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <p className="text-lg">{username}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "score",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Score
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const value = row.getValue("score");
      return <p className="text-lg">{value}</p>;
    },
  },
];
