"use client";

import CreateNewCard from "@/components/create-new-card";
import QuizCard from "@/components/quiz-card";
import TutorialCard from "@/components/tutorial-card";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { ChevronsRight, ClipboardPenLine, FilePlus2, Plus } from "lucide-react";
import React from "react";

export default function Dashboard() {
  const isMobile = useIsMobile();
  const tutorials = [
    <TutorialCard
      title="Try the Experience"
      description="and see how it feels!"
      button={<Button variant={"secondary"}>PLAY THE DEMO QUIZ</Button>}
    />,
    <TutorialCard
      title="Create your own"
      description="in less than 5 minutes"
      icon={FilePlus2}
      button={<Button variant={"secondary"}>CREATE A QUIZ</Button>}
    />,
    <TutorialCard
      title="Host your quiz"
      icon={ClipboardPenLine}
      description="and share it with your friends!"
      button={<Button>HOST A QUIZ</Button>}
    />,
  ];
  return (
    <div className="flex w-full flex-col gap-2 overflow-hidden">
      <div className="flex w-full flex-col gap-4 pb-4 pt-8 sm:px-8 sm:pt-8">
        <div className="flex flex-col items-center justify-center align-middle md:items-start md:justify-start">
          <h1 className="text-2xl font-bold md:text-5xl">
            Welcome to Brightmind!
          </h1>
          <h4>What's on your mind today?</h4>
        </div>
        <div
          className={cn("flex grow flex-col items-center gap-2 md:flex-row")}
        >
          {tutorials.map((card, index) => {
            return (
              <React.Fragment key={index}>
                {React.cloneElement(card, { key: index, number: index + 1 })}
                {index < tutorials.length - 1 && !isMobile && (
                  <div className="flex aspect-square size-8 justify-center">
                    <ChevronsRight className="size-8 text-foreground" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
      <div className="flex h-full flex-col gap-4 p-4">
        <div className="flex w-full flex-row items-end justify-between">
          <h1 className="text-4xl font-bold">Recent quizzes</h1>
          <Button variant={"ghost"} className="mr-1 size-8" size="icon" asChild>
            <Plus strokeWidth={1.2} className="text-foreground" />
          </Button>
        </div>
        <div className="grid h-full w-full grid-flow-row-dense grid-cols-1 gap-2 sm:grid-cols-3">
          <QuizCard />
          <QuizCard />
          <QuizCard />
          <QuizCard />
          <CreateNewCard />
        </div>
      </div>
    </div>
  );
}
