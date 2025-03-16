"use client";

import React from "react";
import { api } from "@/trpc/react";
import { useParams, redirect } from "next/navigation";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function Results() {
  const { id } = useParams();

  const utils = api.useUtils();

  const { data: quiz, isLoading: isQuizLoading } =
    api.published.getById.useQuery(id as string);

  const { data, isLoading } = api.published.getAllParticipants.useQuery(
    id as string,
    {
      refetchInterval: quiz?.start_status ? 1000 : 0,
    },
  );

  const { data: quizInfo, isLoading: isQuizInfoLoading } =
    api.quiz.getByQuizId.useQuery(id as string);

  const { mutate: stopQuiz } = api.published.stopQuiz.useMutation({
    onSuccess: () => {
      utils.published.invalidate();
    },
  });

  const { mutate: startQuiz } = api.published.startQuiz.useMutation({
    onSuccess: () => {
      utils.published.invalidate();
    },
  });

  const { data: isPublished, refetch } = api.published.getById.useQuery(id!, {
    refetchOnWindowFocus: false,
  });

  const { mutate: publishQuiz } = api.published.publishQuiz.useMutation({
    onSuccess: () => {
      utils.published.publishQuiz.invalidate(id);
      refetch();
    },
  });
  const { mutate: unpublishQuiz } = api.published.unpublishQuiz.useMutation({
    onSuccess: () => {
      utils.published.unpublishQuiz.invalidate(id);
      refetch();
    },
  });

  if (isLoading || isQuizLoading || isQuizInfoLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid gap-2 p-8">
      <div className="flex flex-row items-center justify-between rounded-md border p-4">
        <p>{quizInfo?.title}</p>
        <Badge variant={"secondary"} className="p-2 text-sm text-foreground">
          {id}
        </Badge>
        <div className="flex flex-row gap-2">
          <Button onClick={() => redirect(`/quiz-creator/${id}`)}>
            Edit Quiz
          </Button>
          {quiz?.start_status ? (
            <Button
              disabled={!isPublished}
              onClick={() => stopQuiz(id as string)}
            >
              Stop Quiz
            </Button>
          ) : (
            <Button
              disabled={!isPublished}
              onClick={() => startQuiz(id as string)}
            >
              Start Quiz
            </Button>
          )}
          {!isPublished ? (
            <Button
              className="w-full"
              onClick={() => {
                publishQuiz(id);
              }}
            >
              Publish
            </Button>
          ) : (
            <Button className="w-full" onClick={() => unpublishQuiz(id)}>
              Unpublish
            </Button>
          )}
        </div>
      </div>
      <DataTable
        columns={columns}
        data={data ?? []}
        emptyMessage={!isPublished ? "Publish quiz!" : "No results."}
      />
    </div>
  );
}

export default Results;
