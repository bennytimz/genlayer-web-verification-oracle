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

function containsNegation(sentence: string) {
  return /\b(not|never|no|none|neither|nor|without)\b/.test(sentence);
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

    let bestSentence = "";
    let bestScore = 0;

    for (const sentence of sentences) {
      let score = 0;

      for (const word of keywords) {
        if (sentence.includes(word)) {
          score++;
        }
      }

      if (score > bestScore) {
        bestScore = score;
        bestSentence = sentence;
      }
    }

    const threshold = Math.ceil(keywords.length * 0.6);

    let result = "FALSE";

    if (bestScore >= threshold) {
      // If sentence matches but contains negation → FALSE
      if (containsNegation(bestSentence)) {
        result = "FALSE";
      } else {
        result = "TRUE";
      }
    }

    return NextResponse.json({
      result,
      details: `Matched sentence: "${bestSentence.slice(0, 120)}..."`,
    });
  } catch (err) {
    return NextResponse.json({
      result: "ERROR",
      details: "Could not verify the webpage.",
    });
  }
}
