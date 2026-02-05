import { NextRequest, NextResponse } from "next/server";

function cleanText(text: string) {
  return text
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function splitSentences(text: string) {
  return text.split(/[.!?]/).map(s => s.trim());
}

export async function POST(req: NextRequest) {
  try {
    const { url, question } = await req.json();

    const response = await fetch(url);
    const html = await response.text();
    const pageText = cleanText(html);

    const sentences = splitSentences(pageText);

    const keywords = question
      .toLowerCase()
      .split(" ")
      .filter((w: string) => w.length > 3);

    let bestMatchScore = 0;

    for (const sentence of sentences) {
      let score = 0;

      for (const word of keywords) {
        if (sentence.includes(word)) {
          score++;
        }
      }

      if (score > bestMatchScore) {
        bestMatchScore = score;
      }
    }

    const threshold = Math.ceil(keywords.length * 0.6);
    const answer = bestMatchScore >= threshold;

    return NextResponse.json({
      result: answer ? "TRUE" : "FALSE",
      details: `Best sentence matched ${bestMatchScore}/${keywords.length} keywords`,
    });
  } catch (err) {
    return NextResponse.json({
      result: "ERROR",
      details: "Could not verify the webpage.",
    });
  }
}
