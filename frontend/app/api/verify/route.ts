import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { url, question } = await req.json();

    // Fetch the webpage content
    const response = await fetch(url);
    const html = await response.text();

    // Remove HTML tags to get clean text
    const pageText = html.replace(/<[^>]*>/g, " ").toLowerCase();
    const cleanQuestion = question.toLowerCase();

    const words: string[] = cleanQuestion
      .split(" ")
      .filter((w: string) => w.length > 3);

    const matched = words.filter((w) => pageText.includes(w));

    const answer = matched.length > 2;

    return NextResponse.json({
      answer: answer ? "TRUE" : "FALSE",
      reasoning: `Matched keywords: ${matched.join(", ")}`,
    });
  } catch (err) {
    return NextResponse.json({
      answer: "ERROR",
      reasoning: "Could not verify the webpage.",
    });
  }
}
