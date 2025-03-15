"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { api } from "@/trpc/react";
import { CheckCircle2, Clock, Trophy, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

export default function QuizPage() {
  const { id, userId } = useParams();
  const utils = api.useUtils();
  const { data, isLoading } = api.quiz.getByQuizId.useQuery(id as string);
  const { data: status } = api.published.getById.useQuery(id as string, {
    refetchInterval: 2000,
  });
  const { mutate: incrementScore } = api.published.incrementScore.useMutation({
    onSuccess: () => {
      utils.published.incrementScore.invalidate({
        quizId: id,
        userId: userId as string,
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const { mutate: hasAnswered } = api.published.hasAnswered.useMutation({
    onSuccess: () => {
      utils.published.hasAnswered.invalidate({
        quizId: id,
        userId: userId as string,
      });
    },
  });

  const { data: hasAnsweredObj } = api.published.getParticipant.useQuery({
    quizId: id as string,
    userId: userId as string,
  });

  // if (hasAnsweredObj?.hasAnswered) {
  //   redirect(`/join/${id}/lobby/${userId}/results`);
  // }

  // if (!status?.start_status) {
  //   redirect(`/join/${id}/lobby/${userId}`);
  // }

  // State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [userScore, setUserScore] = useState(0);
  const [userStreak, setUserStreak] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState<
    "correct" | "incorrect" | null
  >(null);

  // Current question
  const questions = useMemo(() => data?.questions ?? [], [data]);
  const currentQuestion = questions[currentQuestionIndex];

  // Timer countdown
  useEffect(() => {
    if (quizFinished || isAnswered || currentQuestion?.duration === 0) return;

    setTimeLeft(currentQuestion?.duration || 15);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestionIndex, isAnswered, quizFinished]);

  // Handle timeout (no answer selected)
  const handleTimeout = useCallback(() => {
    setIsAnswered(true);
    setFeedbackType("incorrect");
    setShowFeedback(true);
    setUserStreak(0);

    // Wait and move to next question
    setTimeout(() => {
      moveToNextQuestion();
    }, 2000);
  }, []);

  // Handle answer selection
  const handleSelectOption = (
    points: number,
    index: number,
    isAnswer: boolean,
  ) => {
    if (isAnswered) return;

    setSelectedOption(index);
    setIsAnswered(true);

    setFeedbackType(isAnswer ? "correct" : "incorrect");
    setShowFeedback(true);

    // Update user score and streak
    if (isAnswer) {
      const newStreak = userStreak + 1;

      incrementScore({
        quizId: id as string,
        userId: userId as string,
        score: points,
      });

      setUserScore((prev) => prev + points);
      setUserStreak(newStreak);
    } else {
      setUserStreak(0);
    }

    // Wait and move to next question
    setTimeout(() => {
      moveToNextQuestion();
    }, 2000);
  };

  // Move to next question
  const moveToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setTimeLeft(15);
      setShowFeedback(false);
      setFeedbackType(null);
    } else {
      // Quiz finished
      setQuizFinished(true);
      setShowFeedback(false);
      setFeedbackType(null);
      hasAnswered({
        quizId: id as string,
        userId: userId as string,
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative h-screen w-full p-4">
      <div className="mx-auto grid h-full w-full grid-cols-1 gap-4 lg:grid-cols-6">
        {/* Quiz section - takes up 2/3 on desktop */}
        <div className="w-full lg:col-span-5">
          {!quizFinished ? (
            <Card className="h-full w-full border shadow-none">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="px-3 py-1">
                    Question {currentQuestionIndex + 1}/{questions.length}
                  </Badge>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <Badge
                      variant={timeLeft < 5 ? "destructive" : "secondary"}
                      className="px-3 py-1"
                    >
                      {timeLeft}s
                    </Badge>
                  </div>
                </div>
                <Progress
                  value={(currentQuestionIndex / questions.length) * 100}
                  className="mt-2"
                />
              </CardHeader>

              <CardContent className="relative grid h-5/6 w-full grid-cols-1 grid-rows-2 gap-4">
                <div className="flex flex-col items-center justify-center gap-6 p-4">
                  <CardTitle className="text-3xl font-bold">
                    {currentQuestion?.title}
                  </CardTitle>
                  <CardDescription>
                    {currentQuestion?.description}
                  </CardDescription>
                </div>

                <div className="flex flex-wrap justify-center gap-4">
                  {currentQuestion?.choices.map((choice, index) => (
                    <Button
                      key={index}
                      variant={
                        selectedOption === index
                          ? isAnswered
                            ? choice.isAnswer
                              ? "default"
                              : "destructive"
                            : "default"
                          : isAnswered && choice.isAnswer
                            ? "outline"
                            : "outline"
                      }
                      className={`relative flex h-full w-[calc(50%-0.5rem)] shrink-0 justify-center md:w-[calc(25%-0.75rem)] ${
                        isAnswered && choice.isAnswer
                          ? "bg-green-500 ring-2 ring-green-500"
                          : ""
                      }`}
                      onClick={() =>
                        handleSelectOption(
                          currentQuestion.points,
                          index,
                          choice.isAnswer!,
                        )
                      }
                      disabled={isAnswered}
                    >
                      <p className="block whitespace-normal break-all text-center text-2xl">
                        {choice.title}
                      </p>
                    </Button>
                  ))}
                </div>
              </CardContent>

              <CardFooter className="sticky flex justify-between border-t pt-4">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="px-3 py-1">
                    Score: {userScore}
                  </Badge>
                  {userStreak > 1 && (
                    <Badge variant="secondary" className="px-3 py-1">
                      🔥 Streak: {userStreak}
                    </Badge>
                  )}
                </div>
              </CardFooter>
            </Card>
          ) : (
            <Card className="flex h-full flex-col items-center justify-center text-center shadow-lg">
              <CardContent className="flex h-full flex-col items-center justify-center pt-6">
                <CardHeader>
                  <CardTitle className="text-3xl">Quiz Completed!</CardTitle>
                </CardHeader>
                <div className="mb-6 flex justify-center">
                  <Trophy className="h-24 w-24 text-yellow-500" />
                </div>
                <h3 className="mb-2 text-2xl font-bold">
                  Your Score: {userScore}
                </h3>
                <p className="mb-6 text-muted-foreground">
                  You've completed all {questions.length} questions!
                </p>

                <div className="flex justify-center">
                  <Button
                    size="lg"
                    onClick={() => (window.location.href = "/join")}
                  >
                    Back to Lobby
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Feedback overlay */}
          <AnimatePresence>
            {showFeedback && (
              <motion.div
                className="fixed bottom-0 left-0 z-50 w-full"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className={`flex items-center justify-center gap-4 p-4 text-white ${
                    feedbackType === "correct" ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  {feedbackType === "correct" ? (
                    <>
                      <CheckCircle2 className="h-8 w-8" />
                      <span className="text-lg font-medium">Correct!</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-8 w-8" />
                      <span className="text-lg font-medium">Incorrect!</span>
                    </>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Leaderboard section - takes up 1/3 on desktop */}
        <Card className="flex h-full flex-col shadow-lg">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Leaderboard
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {/* {sortedPlayers.map((player, index) => ( */}
              {/*   <div */}
              {/*     key={player.id} */}
              {/*     className={`flex items-center rounded-lg p-3 ${ */}
              {/*       player.isCurrentUser */}
              {/*         ? "bg-primary/10 ring-1 ring-primary" */}
              {/*         : "" */}
              {/*     }`} */}
              {/*   > */}
              {/*     <div className="flex flex-1 items-center gap-3"> */}
              {/*       <div className="w-6 text-center font-bold"> */}
              {/*         {index + 1} */}
              {/*       </div> */}
              {/*       <Avatar className="h-10 w-10"> */}
              {/*         <AvatarImage src={player.avatar} alt={player.name} /> */}
              {/*         <AvatarFallback> */}
              {/*           {player.name.substring(0, 2).toUpperCase()} */}
              {/*         </AvatarFallback> */}
              {/*       </Avatar> */}
              {/*       <div> */}
              {/*         <div className="flex items-center font-medium"> */}
              {/*           {player.name} */}
              {/*           {player.isCurrentUser && ( */}
              {/*             <Badge variant="outline" className="ml-1 text-xs"> */}
              {/*               You */}
              {/*             </Badge> */}
              {/*           )} */}
              {/*         </div> */}
              {/*       </div> */}
              {/*     </div> */}
              {/*     <div className="text-lg font-bold">{player.score}</div> */}
              {/*   </div> */}
              {/* ))} */}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
