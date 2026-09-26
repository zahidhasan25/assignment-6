import { NextResponse } from "next/server";

const API_URL = "https://api.abcz.workers.dev/api/fitlog";

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWorkoutData() {
  let lastError = null;

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        next: {
          revalidate: 3600,
        },
      });

      // API rate limit
      if (response.status === 429) {
        const retryAfter = response.headers.get("retry-after");

        let waitTime = 1500 * (attempt + 1);

        if (retryAfter) {
          const retrySeconds = Number(retryAfter);

          if (Number.isFinite(retrySeconds)) {
            waitTime = Math.min(retrySeconds * 1000, 5000);
          }
        }

        lastError = new Error(
          `API rate limited. Retry attempt ${attempt + 1}.`
        );

        if (attempt < 2) {
          await sleep(waitTime);
          continue;
        }

        throw lastError;
      }

      if (!response.ok) {
        throw new Error(
          `FitLog API returned status ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      lastError = error;

      if (attempt < 2) {
        await sleep(1000 * (attempt + 1));
      }
    }
  }

  throw lastError || new Error("Unable to fetch workout data.");
}

export async function GET() {
  try {
    const data = await fetchWorkoutData();

    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Cache-Control":
          "s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("FITLOG API ERROR:", error);

    return NextResponse.json(
      {
        error: "Unable to load workout data.",
        message:
          "The workout API is temporarily unavailable. Please try again shortly.",
      },
      {
        status: 503,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  }
}