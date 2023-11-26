import { Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { User } from "next-auth";
import { Stock } from "@prisma/client";

interface Props {
  user: Pick<User, "id"> | undefined;
  stock: Pick<Stock, "eye">;
}

export default function StockEye({ user, stock }: Props) {
  const value = stock.eye || 78;
  const dashArray = 2 * Math.PI * 54;
  const dashOffset = (1 - value / 165) * dashArray;

  // 1 - 30: Low Score
  // 30 - 60: Medium Score
  // 60 - 100: Good Score
  const score =
    value >= 1 && value < 30
      ? "Low Score"
      : value >= 30 && value < 60
      ? "Medium Score"
      : "Good Score";

  const CATEGORIES = [
    {
      title: "Fundamental",
      value: 3.42,
    },
    {
      title: "Technical",
      value: 2.78,
    },
    {
      title: "Future Outlook",
      value: 1.24,
    },
  ];

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card className="px-6 gap-6 overflow-hidden flex items-center">
            {/* Visualization */}
            <div className="relative h-[150px] px-auto w-[150px] translate-y-2.5 rounded-full">
              <svg
                className="absolute left-0 top-0 h-full w-full rotate-[160deg]"
                viewBox="0 0 120 120">
                <defs>
                  <linearGradient
                    id="gradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%">
                    <stop offset="0%" stopColor="#fda37a" />
                    <stop offset="100%" stopColor="#ffcc5e" />
                  </linearGradient>
                </defs>
                <circle
                  className="fill-transparent"
                  cx="60"
                  cy="60"
                  r="54"
                  strokeWidth={8}
                  stroke="url(#gradient)"
                  strokeDasharray={dashArray}
                  strokeDashoffset={dashOffset}
                  strokeLinecap="round"
                />
              </svg>
              <div className="f-box relative h-[90%] w-full flex-col">
                <p className="text-center text-[27px] font-thin">
                  {user ? value : <Lock className="mb-1.5 h-6" />}
                </p>
                <p className="text-center text-[13px] font-light text-primary">
                  {user ? score : "Locked"}
                </p>
              </div>
            </div>

            {/* Categories */}
            <div className="f-col items-center gap-3">
              {CATEGORIES.map((category) => (
                <div key={category.title} className="flex items-end">
                  <p className="w-28 text-sm text-zinc-400">{category.title}</p>
                  <p
                    className={`${
                      category.value < 2
                        ? "text-red-500"
                        : category.value < 3
                        ? "text-yellow-500"
                        : "text-green-500"
                    } font-semibold`}>
                    {category.value}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </TooltipTrigger>

        <TooltipContent side="bottom">
          EYE offers a rough estimate of a company&apos;s overall health.
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
