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

  console.log(quiz);

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
          <Button onClick={() => redirect(`/quiz-creator/${id}`)}>Edit Quiz</Button>
          {quiz?.start_status ? (
            <Button onClick={() => stopQuiz(id as string)}>Stop Quiz</Button>
          ) : (
            <Button onClick={() => startQuiz(id as string)}>Start Quiz</Button>
          )}
          <Button className="bg-green-700">Export</Button>
        </div>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}

export default Results;
