// @ts-nocheck
"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Page() {


  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-4xl font-semi-bold tracking-tight">
            ¡Bienvenido/a 👋
          </h2>
        </div>

        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-1">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>
                <strong>Resumen</strong>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="flex items-center">
                lorem ipsum
              </p>
            </CardContent>
          </Card>
        </div>

      </div>
    </ScrollArea>
  );
}
