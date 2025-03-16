export const dynamic = 'force-dynamic';

"use client";
import CreateNewCard from "@/components/create-new-card";
import QuizCard from "@/components/quiz-card";
import TutorialCard from "@/components/tutorial-card";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { ChevronsRight, ClipboardPenLine, FilePlus2, Plus } from "lucide-react";
import React from "react";
import { authClient } from "@/lib/auth-client";
import { api } from "@/trpc/react";
const { useSession } = authClient;
import { redirect } from "next/navigation";

export default function Dashboard() {
  const isMobile = useIsMobile();
  const { data: session } = useSession();
  const id = session?.user.id;

  const { data, isLoading } = api.quiz.getById.useQuery(id!, {
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });

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
      button={
        <Button onClick={() => redirect("/quiz-creator")} variant={"secondary"}>
          CREATE A QUIZ
        </Button>
      }
    />,
    <TutorialCard
      title="Host your quiz"
      icon={ClipboardPenLine}
      description="and share it with your friends!"
      button={
        <Button onClick={() => redirect("/quiz-creator")}>HOST A QUIZ</Button>
      }
    />,
  ];

  return (
    <div className="flex w-full flex-col gap-2 overflow-hidden px-4">
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
          <Button
            variant={"ghost"}
            className="mr-1 size-8"
            size="icon"
            onClick={() => redirect("/quiz-creator")}
          >
            <Plus strokeWidth={1.2} className="text-foreground" />
          </Button>
        </div>
        <div className="grid h-full w-full grid-flow-row-dense grid-cols-1 gap-2 sm:grid-cols-3">
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <>
              {data &&
                data.map((item, index) => {
                  {
                    /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
                  }
                  {
                    /* @ts-ignore */
                  }
                  return (
                    <QuizCard
                      onClick={() => redirect(`/quiz-creator/${item._id}`)}
                      key={index}
                      quizId={item._id.toString()}
                      data={item}
                    />
                  );
                })}
              <CreateNewCard onClick={() => redirect("/quiz-creator")} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

