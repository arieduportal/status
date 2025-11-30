import type { CalendarDate } from "@internationalized/date";

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ConcurrentData {
  data?: Record<string, "Up" | "Down">;
}

export interface DailyRecord {
  date: string;
  status: "ok" | "warning" | "error";
  title: "Operational" | "Partial Outage" | "Major Outage";
  description: string;
  time_down: string;
}

export type DomainSummary = {
  [domain: string]: DailyRecord[];
};

