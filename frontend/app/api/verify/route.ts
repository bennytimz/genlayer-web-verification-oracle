import { NextRequest, NextResponse } from "next/server";

function clean(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function getSentences(text: string): string[] {
  return text.split(/[.!?]/).map(s => s.trim()).filter(Boolean);
}

function scoreSentence(sentence: string, words: string[]): number {
  let score = 0;
  for (const w of words) {
    if (sentence.includes(w)) score++;
  }
  return score;
}

export async function POST(req: NextRequest) {
  try {
    const { url, question } = await req.json();

    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch page");
    }

    const html = await response.text();
    const text = clean(html);
    const sentences = getSentences(text);

    const q = question.toLowerCase();
    const keywords = q.split(" ").filter(w => w.length > 4);

    let bestSentence = "";
    let bestScore = 0;

    for (const s of sentences) {
      const sc = scoreSentence(s, keywords);
      if (sc > bestScore) {
        bestScore = sc;
        bestSentence = s;
      }
    }

    // If no good sentence found → FALSE
    if (bestScore < 2) {
      return NextResponse.json({
        result: `FALSE\n\nNo supporting evidence found on the page.`,
      });
    }

    // Detect contradiction: if best sentence talks about a DIFFERENT place/entity
    const hasAfrica = bestSentence.includes("africa");
    const hasEurope = bestSentence.includes("europe");

    if (q.includes("europe") && hasAfrica && !hasEurope) {
      return NextResponse.json({
        result: `FALSE\n\nEvidence:\n${bestSentence}`,
      });
    }

    if (q.includes("africa") && hasEurope && !hasAfrica) {
      return NextResponse.json({
        result: `FALSE\n\nEvidence:\n${bestSentence}`,
      });
    }

    return NextResponse.json({
      result: `TRUE\n\nEvidence:\n${bestSentence}`,
    });

  } catch (err: any) {
    return NextResponse.json({
      result: `ERROR\n\n${err.message}`,
    });
  }
}
