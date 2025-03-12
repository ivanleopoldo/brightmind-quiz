import { Plus } from "lucide-react";
import { Card } from "./ui/card";
import { PropsWithoutRef } from "react";

export default function CreateNewCard() {
  return (
    <Card className="relative flex h-72 flex-col items-center justify-center overflow-hidden border-2 border-dashed border-primary/20 shadow-none">
      <Plus className="text-primary/20" />
      <h1 className="font-mono text-primary/20">CREATE A NEW QUIZ!</h1>
    </Card>
  );
}
