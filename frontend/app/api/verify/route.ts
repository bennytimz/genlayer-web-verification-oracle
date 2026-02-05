import { NextRequest, NextResponse } from "next/server";

function cleanText(text: string) {
  return text
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .toLowerCase();
}

export async function POST(req: NextRequest) {
  try {
    const { url, question } = await req.json();

    const response = await fetch(url);
    const html = await response.text();
    const pageText = cleanText(html);

    const keywords = question
      .toLowerCase()
      .split(" ")
      .filter((w: string) => w.length > 4); // only strong words

    let score = 0;

    for (const word of keywords) {
      if (pageText.includes(word)) {
        score++;
      }
    }

    const answer = score >= 2;

    return NextResponse.json({
      answer: answer ? "TRUE" : "FALSE",
      reasoning: `Matched ${score} keyword(s): ${keywords.join(", ")}`,
    });
  } catch (err) {
    return NextResponse.json({
      answer: "ERROR",
      reasoning: "Could not verify the webpage.",
    });
  }
}
