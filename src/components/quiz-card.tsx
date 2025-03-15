"use client";

import React, { PropsWithChildren } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Separator } from "./ui/separator";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { TQuiz } from "@/lib/types";
import { ClipboardList, Edit, EllipsisVertical, Trash } from "lucide-react";
import { Button } from "./ui/button";
import { redirect } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/trpc/react";

type SmallTextProps = {
  className?: string;
} & PropsWithChildren;

function SmallText({ className, children }: SmallTextProps) {
  return (
    <p className={cn("text-xs font-light text-muted-foreground", className)}>
      {children}
    </p>
  );
}

export default function QuizCard({
  data,
  quizId,
  ...props
}: { data: TQuiz; quizId: string } & React.HTMLAttributes<HTMLDivElement>) {
  const utils = api.useUtils();
  const { mutate: deleteQuiz } = api.quiz.deleteQuiz.useMutation({
    onSuccess: () => {
      utils.quiz.invalidate();
    },
  });

  return (
    <Card
      {...props}
      className="relative h-72 flex-wrap overflow-hidden border-2 border-primary/20 pb-6 shadow-none"
    >
      <CardHeader className="relative h-3/5 w-full p-0">
        <Image src={"/bg-quiz.png"} alt="photo" fill />
      </CardHeader>
      <Separator className="mb-4 border border-primary/20 shadow-none" />
      <CardContent className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg">{data.title}</CardTitle>
          <CardDescription>{data.description}</CardDescription>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <EllipsisVertical />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                redirect(`/quiz-creator/${quizId}/results`);
              }}
            >
              <ClipboardList />
              See Results
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                deleteQuiz(quizId);
              }}
            >
              <Trash />
              Delete Quiz
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardContent>
      <CardFooter className="flex flex-row items-center gap-4">
        <SmallText>
          {data.questions ? data.questions.length : 0} questions
        </SmallText>
        <SmallText className="text-2xl">•</SmallText>
        <SmallText>
          {data.questions.reduce((sum, q) => sum + (q.points || 0), 0)} points
        </SmallText>
      </CardFooter>
    </Card>
  );
}
