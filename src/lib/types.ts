export type Report = {
  timestamp: string;
  environment: string;
  uptime_percent: number;
  average_latency_ms: number;
  uptime_count: number;
  downtime_count: number;
  degraded_count: number;
};

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

export interface DashboardData {
  data: Report[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export interface GeneratedKey {
  id: string;
  api_key: string;
  name: string;
  key_prefix: string;
  created_at: string;
  warning: string;
}

export interface Stats {
  avgUptime: number;
  avgLatency: number;
  totalReports: number;
  incidents: number;
}
