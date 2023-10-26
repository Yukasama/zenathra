"use client";

import { Button } from "@/components/ui/button";
import { RotateCw } from "lucide-react";

interface Props {
  reset: () => void;
}

export const runtime = "edge";

export default function GlobalError({ reset }: Props) {
  return (
    <html>
      <body>
        <div className="f-box mt-[360px]">
          <div className="f-col gap-2.5">
            <h2 className="text-zinc-600 dark:text-zinc-400 text-lg">
              Internal Server Error
            </h2>
            <p className="text-slate-400 dark:text-slate-200 text-sm">
              There was an error on our end.
            </p>
            <Button variant="subtle" onClick={() => reset()}>
              <RotateCw className="h-4 w-4" />
              Try again
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
