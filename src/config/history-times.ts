import { TimeFrame } from "@/types/stock";

export const historyTimes: Record<TimeFrame, [string, number]> = {
  "1D": ["min1", 391],
  "5D": ["min5", 420],
  "1M": ["min30", 420],
  "6M": ["day1", 155],
  "1Y": ["day1", 310],
  "5Y": ["day1", 1550],
  ALL: ["day1", 1550],
};
