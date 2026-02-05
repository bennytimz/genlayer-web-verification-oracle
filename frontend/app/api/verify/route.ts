import { NextRequest, NextResponse } from "next/server";

function cleanText(text: string) {
  return text
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .toLowerCase();
}

export async function POST(req: NextRequest) {
  try {
    const { url, question } = await req.json();

    if (!url || !question) {
      return NextResponse.json({
        result: "ERROR",
        reasoning: "Missing URL or question.",
      });
    }

    // Some sites block default fetch headers → mimic a browser
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json({
        result: "ERROR",
        reasoning: `Failed to fetch page. Status: ${response.status}`,
      });
    }

    const html = await response.text();
    const pageText = cleanText(html);

    const keywords = question
      .toLowerCase()
      .split(/\W+/)
      .filter((w: string) => w.length > 4);

    let score = 0;

    for (const word of keywords) {
      if (pageText.includes(word)) {
        score++;
      }
    }

    const isTrue = score >= Math.max(2, Math.floor(keywords.length / 3));

    return NextResponse.json({
      result: isTrue ? "TRUE" : "FALSE",
      reasoning: `Matched ${score} keyword(s): ${keywords.join(", ")}`,
    });
  } catch (err) {
    return NextResponse.json({
      result: "ERROR",
      reasoning: "Could not verify the webpage.",
    });
  }
}
