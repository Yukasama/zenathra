import { User } from "@/types/user";
import { Stock } from "@prisma/client";
import { Lock } from "react-feather";

interface Props {
  stock: Stock | null;
  user: User | null;
}

export default function Eye({ stock, user }: Props) {
  const value = stock?.eye || 78;
  const dashArray = 2 * Math.PI * 54;
  const dashOffset = (1 - value / 165) * dashArray;

  const score =
    value >= 1 && value < 30
      ? "Low Score"
      : value >= 30 && value < 60
      ? "Medium Score"
      : "Good Score";

  return (
    <div className="relative h-[150px] w-[150px] translate-y-5 rounded-full">
      <svg
        className="absolute left-0 top-0 h-full w-full rotate-[160deg]"
        viewBox="0 0 120 120">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8e17e8" />
            <stop offset="100%" stopColor="#0a74bf" />
          </linearGradient>
        </defs>
        <circle
          className="animate-appear-down fill-gray-100 dark:fill-moon-300"
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
        <p className="text-center text-[30px] font-medium">
          {user ? value : <Lock className="mb-1.5 h-6" />}
        </p>
        <p className="text-center text-[13px] font-light text-blue-500">
          {user ? score : "Locked"}
        </p>
      </div>
    </div>
  );
}
