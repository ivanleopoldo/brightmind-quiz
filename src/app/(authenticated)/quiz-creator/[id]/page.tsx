"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams, redirect } from "next/navigation";
import { api } from "@/trpc/react";
import {
  Card,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { Plus, Trash2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface Question {
  quizId: string;
  _id: string;
  title: string;
  duration: number;
  points: number;
  description: string;
  choices: { title: string; isAnswer: boolean }[];
}

export default function Quiz() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = api.quiz.getOne.useQuery(id!);
  const { data: isPublished, refetch } = api.published.getById.useQuery(id!, {
    refetchOnWindowFocus: false,
  });
  console.log(isPublished);
  const utils = api.useUtils();
  const { mutate: updateQuestion } = api.quiz.updateQuestion.useMutation();
  const { mutate: addQuestion } = api.quiz.addQuestion.useMutation({
    onSuccess: () => {
      utils.quiz.getOne.invalidate(id);
    },
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
  const { mutate: deleteQuestion } = api.quiz.deleteQuestion.useMutation({
    onSuccess: () => {
      utils.quiz.getOne.invalidate(id);
    },
  });

  const [selected, setSelected] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const questionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const autosaveRef = useRef<NodeJS.Timeout | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (data?.questions) {
      setQuestions(data.questions);
      console.log(data.questions);
    }
  }, [data]);

  useEffect(() => {
    if (autosaveRef.current) clearTimeout(autosaveRef.current);
    autosaveRef.current = setTimeout(() => handleSave(), 5000);

    return () => {
      if (autosaveRef.current) clearTimeout(autosaveRef.current);
    };
  }, [questions]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries.find((entry) => entry.isIntersecting);
        if (visibleEntry) {
          const index = questionRefs.current.findIndex(
            (ref) => ref === visibleEntry.target,
          );
          if (index !== -1) {
            setSelected(index);
          }
        }
      },
      {
        root: null,
        threshold: 0.75,
      },
    );

    questionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [questions]);

  useEffect(() => {
    if (!questions[selected]) return; // Ensure question exists
    const correctIndex = questions[selected]?.choices.findIndex(
      (c) => c.isAnswer,
    );
    setSelectedAnswer(correctIndex !== -1 ? correctIndex.toString() : null);
  }, [selected, questions]);

  const handleUpdateLocal = (index: number, updatedQuestion: Question) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === index ? updatedQuestion : q)),
    );
  };

  const handleRadioChange = (value: string) => {
    setSelectedAnswer(value);
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === selected
          ? {
              ...q,
              choices: q.choices.map((choice, idx) => ({
                ...choice,
                isAnswer: idx.toString() === value,
              })),
            }
          : q,
      ),
    );
  };

  const handleAddQuestion = () => {
    addQuestion({
      quizId: data?._id,
      title: "New Question",
      description: "This is a sample question",
    });
  };

  const handleSave = () => {
    if (isSaving) return;
    setIsSaving(true);

    updateQuestion(
      {
        quizId: data?._id,
        title: questions[selected]!.title,
        questionId: questions[selected]!._id,
        description: questions[selected]!.description,
        choices: questions[selected]!.choices,
        duration: questions[selected]!.duration, // Include duration
        points: questions[selected]!.points,
      },
      {
        onSuccess: () => {
          setIsSaving(false);
        },
      },
    );
  };

  const handlePublish = () => {};

  if (isLoading || questions.length === 0) {
    return <div>Loading...</div>;
  }

  if (isLoading || questions.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative flex h-[calc(100vh-6rem)] w-full overflow-hidden">
      {/* Left Side: Scrollable Questions List */}
      <div className="absolute bottom-2 right-8">
        <p className="text-foreground/20">{isSaving ? "Saving..." : "Saved"}</p>
      </div>
      <div className="flex w-full flex-col overflow-hidden p-6">
        <div className="flex h-full snap-y snap-mandatory flex-col gap-6 overflow-y-auto">
          {questions.map((item, index) => (
            <Card
              key={index}
              ref={(el) => {
                questionRefs.current[index] = el;
              }}
              onClick={() => setSelected(index)}
              className={cn(
                selected === index && "border border-primary",
                "relative min-h-full w-full flex-shrink-0 snap-start",
              )}
            >
              {/* Delete Icon */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 z-10 rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteQuestion({ quizId: data?._id, questionId: item._id });
                }} // Call handleDeleteQuestion
              >
                <Trash2 className="h-4 w-4" />

                <span className="sr-only">Delete</span>
              </Button>
              <CardContent className="relative grid h-full w-full grid-cols-1 grid-rows-2 gap-4">
                <div className="flex flex-col items-center justify-center gap-6 p-4">
                  <CardTitle className="text-3xl font-bold">
                    {item.title}
                  </CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </div>
                <div className="flex flex-wrap justify-center gap-4">
                  {item.choices.map((choice, idx) => (
                    <Button
                      key={idx}
                      variant={choice.isAnswer ? "secondary" : "default"}
                      className="flex h-full w-[calc(50%-0.5rem)] shrink-0 justify-center md:w-[calc(25%-0.75rem)]"
                      onClick={() => {
                        setQuestions((prev) =>
                          prev.map((q, i) =>
                            i === index
                              ? {
                                  ...q,
                                  choices: q.choices.map((c, j) => ({
                                    ...c,
                                    isAnswer: j === idx, // Corrected logic here
                                  })),
                                }
                              : q,
                          ),
                        );
                      }}
                    >
                      <p className="block whitespace-normal break-all text-center text-2xl">
                        {choice.title}
                      </p>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
          <Button className="snap-start" onClick={handleAddQuestion}>
            <Plus />
            Add Question!
          </Button>
        </div>
      </div>

      <Separator orientation="vertical" />

      {/* Right Side: Question Settings */}
      <Tabs defaultValue="questions" className="h-full w-2/5 overflow-hidden">
        <div className="m-2">
          <TabsList className="w-full bg-foreground/5">
            <TabsTrigger className="w-full" value="questions">
              Questions
            </TabsTrigger>
            <TabsTrigger className="w-full" value="project">
              Project Settings
            </TabsTrigger>
          </TabsList>
        </div>
        <Separator />

        <TabsContent className="m-4" value="questions">
          {questions[selected] && (
            <div className="grid gap-6">
              {/* Question Title */}
              <div className="grid gap-2">
                <Label htmlFor="title">QUESTION</Label>
                <Input
                  type="text"
                  id="title"
                  name="title"
                  value={questions[selected].title}
                  onChange={(e) =>
                    setQuestions((prev) =>
                      prev.map((q, i) =>
                        i === selected ? { ...q, title: e.target.value } : q,
                      ),
                    )
                  }
                />
              </div>

              {/* Question Description */}
              <div className="grid gap-2">
                <div className="flex flex-row justify-between">
                  <Label htmlFor="description">DESCRIPTION</Label>
                  <Label className="text-[0.7rem]" htmlFor="description">
                    OPTIONAL
                  </Label>
                </div>
                <Input
                  type="text"
                  id="description"
                  name="description"
                  value={questions[selected].description}
                  onChange={(e) =>
                    setQuestions((prev) =>
                      prev.map((q, i) =>
                        i === selected
                          ? { ...q, description: e.target.value }
                          : q,
                      ),
                    )
                  }
                />
              </div>

              {/* Answer Choices */}
              <div>
                <Label>ANSWERS</Label>
                <RadioGroup
                  value={
                    questions[selected].choices
                      .findIndex((choice) => choice.isAnswer)
                      .toString() ?? "0"
                  }
                  onValueChange={handleRadioChange}
                >
                  {questions[selected].choices.map((choice, idx) => (
                    <div key={idx} className="mt-2 flex items-center gap-2">
                      <RadioGroupItem value={idx.toString()} />
                      <Input
                        type="text"
                        value={choice.title}
                        onChange={(e) => {
                          const newChoices = [...questions[selected].choices];
                          newChoices[idx] = {
                            ...newChoices[idx],
                            title: e.target.value,
                          };
                          setQuestions((prev) =>
                            prev.map((q, i) =>
                              i === selected
                                ? { ...q, choices: newChoices }
                                : q,
                            ),
                          );
                        }}
                      />
                    </div>
                  ))}
                </RadioGroup>
                <div className="mt-4">
                  <Label htmlFor="duration">Duration (seconds)</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      type="number"
                      id="duration"
                      name="duration"
                      value={questions[selected]?.duration || ""}
                      onChange={(e) => {
                        const duration = parseInt(e.target.value, 10);
                        setQuestions((prev) =>
                          prev.map((q, i) =>
                            i === selected
                              ? {
                                  ...q,
                                  duration: isNaN(duration) ? 0 : duration,
                                }
                              : q,
                          ),
                        );
                      }}
                    />
                    <Slider
                      defaultValue={[questions[selected]?.duration || 0]}
                      min={0}
                      max={300}
                      step={5}
                      onValueChange={(e) => {
                        const duration = parseInt(e[0] ?? 0, 10);
                        setQuestions((prev) =>
                          prev.map((q, i) =>
                            i === selected ? { ...q, duration } : q,
                          ),
                        );
                      }}
                    />
                  </div>
                </div>

                {/* Points Input */}
                <div className="mt-4">
                  <Label htmlFor="points">Points</Label>
                  <Input
                    type="number"
                    id="points"
                    name="points"
                    value={questions[selected]?.points}
                    onChange={(e) => {
                      const points = parseInt(e.target.value, 10);
                      setQuestions((prev) =>
                        prev.map((q, i) =>
                          i === selected
                            ? { ...q, points: isNaN(points) ? 0 : points }
                            : q,
                        ),
                      );
                    }}
                  />
                </div>
              </div>
              <Button onClick={() => handleSave()}>Save</Button>
            </div>
          )}
        </TabsContent>
        <TabsContent className="m-4" value="project">
          <div className="flex w-full flex-col gap-4">
            <div className="flex w-full flex-col gap-4">
              <p>Join Code</p>
              <div
                className={cn(
                  isPublished ? "" : "bg-foreground/20 text-muted-foreground",
                  "flex w-full flex-col rounded-md border p-2",
                )}
              >
                <p>{id}</p>
              </div>
              <div className="flex w-full justify-center">
                <p className="font-extralight text-muted-foreground">OR</p>
              </div>
              <p>Link</p>
              <div
                className={cn(
                  isPublished ? "" : "bg-foreground/20 text-muted-foreground",
                  "flex w-full flex-col overflow-hidden text-ellipsis rounded-md border p-2",
                )}
              >
                <p>https://brightmind-quiz.vercel.app/join/{id}</p>
              </div>
            </div>
            {!isPublished ? (
              <Button
                className="w-full"
                onClick={() => {
                  handleSave();
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
            <Button
              disabled={!isPublished}
              onClick={() => redirect(`/quiz-creator/${id}/results`)}
            >
              Go to Leaderboard
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
