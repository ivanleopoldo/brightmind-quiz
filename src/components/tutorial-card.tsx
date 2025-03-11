import { Button } from "./ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Dices, LucideIcon } from "lucide-react";

export type TTutorialCard = {
  title?: string;
  icon?: LucideIcon;
  description?: string;
  number?: number;
  button?: React.ReactNode;
};

export default function TutorialCard({
  title = "Add a title",
  description = "Add a description",
  icon: Icon = Dices,
  number = 1,
  button = <Button>Click me!</Button>,
}: TTutorialCard) {
  return (
    <Card className="relative flex w-full items-center border-2 p-3 shadow-none sm:h-52">
      <CardHeader className="flex flex-col gap-2">
        <div className="flex flex-row gap-4">
          <Icon className="h-12 w-12 text-primary" />
          <div>
            <CardTitle className="text-xl sm:text-2xl">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
        {button}
        <div className="absolute right-8 top-4 text-5xl font-black text-primary opacity-10">
          {number}
        </div>
      </CardHeader>
    </Card>
  );
}
