import { NextRequest, NextResponse } from "next/server";

function cleanText(text: string) {
  return text
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function splitIntoSentences(text: string) {
  return text.split(/[.!?]/).map(s => s.trim());
}

export async function POST(req: NextRequest) {
  try {
    const { url, question } = await req.json();

    // ✅ REQUIRED for Vercel to allow external fetch
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch page");
    }

    const html = await response.text();
    const pageText = cleanText(html);
    const sentences = splitIntoSentences(pageText);

    const qWords = question
      .toLowerCase()
      .split(" ")
      .filter((w: string) => w.length > 4);

    let bestMatchScore = 0;
    let bestSentence = "";

    for (const sentence of sentences) {
      let score = 0;

      for (const word of qWords) {
        if (sentence.includes(word)) {
          score++;
        }
      }

      if (score > bestMatchScore) {
        bestMatchScore = score;
        bestSentence = sentence;
      }
    }

    const answer = bestMatchScore >= Math.ceil(qWords.length * 0.7);

    return NextResponse.json({
      answer: answer ? "TRUE" : "FALSE",
      reasoning: bestSentence || "No supporting sentence found",
    });
  } catch (err: any) {
    return NextResponse.json({
      answer: "ERROR",
      reasoning: err.message,
    });
  }
}
