"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { authClient } from "@/lib/auth-client";
import { api } from "@/trpc/react";
import { redirect } from "next/navigation";
const { useSession } = authClient;

export default function CreateQuiz() {
  const { data: session } = useSession();
  const id = session?.user.id;

  const utils = api.useUtils();

  const { mutateAsync: addQuiz } = api.quiz.addQuiz.useMutation({
    onSuccess: () => {
      utils.quiz.getById.invalidate(id);
    },
    onError: (error) => {
      console.error("Error adding quiz:", error);
    },
  });

  const [formData, setFormData] = React.useState({
    title: "",
    description: "",
  });
  const { title, description } = formData;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newQuiz = await addQuiz({ userId: id!, title, description });
    console.log(newQuiz);
    redirect(`/quiz-creator/${newQuiz._id}`);
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <Card className="flex w-2/3 flex-col">
        <CardHeader>
          <CardTitle className="text-4xl font-bold">
            Create your Quiz!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid w-full gap-6" onSubmit={(e) => onSubmit(e)}>
            <div className="grid gap-2">
              <Label htmlFor="title">Quiz Name</Label>
              <Input
                name="title"
                id="title"
                placeholder="i love apples"
                type="text"
                onChange={onChange}
              />
            </div>
            <div className="grid w-full gap-2">
              <div className="flex w-full justify-between">
                <Label htmlFor="description">Description</Label>
                <Label
                  className="text-[0.70rem] font-light"
                  htmlFor="description"
                >
                  OPTIONAL
                </Label>
              </div>
              <Input
                id="description"
                placeholder="describe your quiz!!"
                type="text"
                name="description"
                onChange={onChange}
              />
            </div>
            <Button type="submit">Create</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
