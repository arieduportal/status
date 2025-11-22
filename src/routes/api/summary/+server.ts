import { json } from "@sveltejs/kit";
import { API_KEY, DOMAINS } from "$env/static/private";
import { PUBLIC_API_V1_URL } from "$env/static/public";
import type { RequestHandler } from "./$types";
import type { DomainSummary, ApiResponse } from "$lib/types";

export const GET: RequestHandler = async ({ cookies }) => {
  const cache = cookies.get("cached");
  const cacheExpired = !cache;

  const domainList = (DOMAINS ?? "")
    .split(",")
    .map((d) => d.trim())
    .filter(Boolean);

  try {
    const response = await fetch(`${PUBLIC_API_V1_URL}/reports/query/summary`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        domains: domainList,
        days: 60,
        useCache: cacheExpired,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to load current systems status.");
    }

    const data: ApiResponse<DomainSummary> = await response.json();

    if (cacheExpired) {
      cookies.set("cached", "yes", {
        path: "/",
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7,
        secure: true,
        sameSite: "strict" as const,
      });
    }

    return json(data, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return json(
      { message: "Failed to load current systems status.", success: false },
      { status: 500 },
    );
  }
};
