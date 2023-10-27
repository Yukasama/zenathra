import { Lock } from "lucide-react";
import { Card } from "../../../components/ui/card";
import type { KindeUser } from "@kinde-oss/kinde-auth-nextjs/server";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Props {
  user: KindeUser | null;
  eye: number | null;
}

export default function StockEye({ user, eye }: Props) {
  const value = eye || 78;
  const dashArray = 2 * Math.PI * 54;
  const dashOffset = (1 - value / 165) * dashArray;

  const score =
    value >= 1 && value < 30
      ? "Low Score"
      : value >= 30 && value < 60
      ? "Medium Score"
      : "Good Score";

  const categories = [
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
                    <stop offset="0%" stopColor="#8e17e8" />
                    <stop offset="100%" stopColor="#0a74bf" />
                  </linearGradient>
                </defs>
                <circle
                  className="animate-appear-down fill-white dark:fill-slate-950"
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
                <p className="text-center text-[13px] font-light text-blue-500">
                  {user ? score : "Locked"}
                </p>
              </div>
            </div>
            <div className="f-col items-center gap-3">
              {categories.map((category) => (
                <div key={category.title} className="flex items-end">
                  <p className="w-28 text-sm text-slate-400">
                    {category.title}
                  </p>
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
          EYE gives an approximate indication of how well a company is
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
