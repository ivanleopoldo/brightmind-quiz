"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
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
import { Plus } from "lucide-react";

interface Question {
  title: string;
  description: string;
  choices: { title: string; isAnswer: boolean }[];
}

export default function Quiz() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = api.quiz.getOne.useQuery(id!);
  console.log(data);

  const [selected, setSelected] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);

  const questionRefs = useRef<(HTMLDivElement | null)[]>([]); // Stores refs to all question cards

  // Sync state when data is fetched
  useEffect(() => {
    if (data?.questions) {
      setQuestions(data.questions);
    }
  }, [data]);

  // Observe which card is snapped
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
        threshold: 0.75, // Fires when 75% of a card is visible
      },
    );

    questionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [questions]);

  if (isLoading || questions.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-[calc(100vh-6rem)] w-full overflow-hidden">
      {/* Left Side: Scrollable Questions List */}
      <div className="flex w-full flex-grow flex-col overflow-hidden p-6">
        <div className="flex snap-y snap-mandatory flex-col gap-6 overflow-y-auto">
          {questions.map((item, index) => (
            <Card
              key={index}
              ref={(el) => {
                questionRefs.current[index] = el;
              }}
              onClick={() => setSelected(index)}
              className={cn(
                selected === index && "border border-primary",
                "min-h-[100%] w-full flex-shrink-0 snap-start",
              )}
            >
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
                    >
                      <p className="block whitespace-normal break-all text-center">
                        {choice.title}
                      </p>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
          <Card className="min-h-[40rem] w-full flex-shrink-0 snap-start">
            <Plus />
            <h1>Add a new question</h1>
          </Card>
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
            <TabsTrigger className="w-full" value="settings">
              Settings
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
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
