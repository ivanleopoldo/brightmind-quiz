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

export default function QuizCard() {
  return (
    <Card className="h-72 flex-wrap overflow-hidden border-2 border-primary/20 pb-6 shadow-none">
      <CardHeader className="relative h-3/5 w-full p-0">
        <Image src={"https://picsum.photos/1000/600"} alt="photo" fill />
      </CardHeader>
      <Separator className="mb-4 border border-primary/20 shadow-none" />
      <CardContent className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg">Math Quiz 2</CardTitle>
          <CardDescription>Math Quiz</CardDescription>
        </div>
      </CardContent>
      <CardFooter className="flex flex-row items-center gap-4">
        <SmallText>50 questions</SmallText>
        <SmallText className="text-2xl">•</SmallText>
        <SmallText>50 points</SmallText>
      </CardFooter>
    </Card>
  );
}
