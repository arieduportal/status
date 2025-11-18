import { json } from "@sveltejs/kit";
import { API_KEY, DOMAINS } from "$env/static/private";
import { PUBLIC_API_V1_URL } from "$env/static/public";
import type { RequestHandler } from "./$types";
import type { ConcurrentData, ApiResponse } from "$lib/types";

export const GET: RequestHandler = async () => {
  try {
    const response = await fetch(`${PUBLIC_API_V1_URL}/concurrent/status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({ domains: DOMAINS }),
    });

    if (!response.ok) {
      throw new Error("Failed to load current systems status.");
    }

    const data: ApiResponse<ConcurrentData> = await response.json();

    return json(data, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return json(
      { message: "Failed to load current systems status.", success: false },
      { status: 500 },
    );
  }
};
