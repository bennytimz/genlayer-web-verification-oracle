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
  return text
    .split(/[.!?]/)
    .map((s: string) => s.trim())
    .filter(Boolean);
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w: string) => w.length > 3);
}

function scoreSentence(sentence: string, words: string[]): number {
  let score = 0;
  for (const w of words) {
    if (sentence.includes(w)) score++;
  }
  return score;
}

function hasNegation(sentence: string): boolean {
  return (
    sentence.includes(" not ") ||
    sentence.includes(" no ") ||
    sentence.includes(" never ") ||
    sentence.includes(" neither ")
  );
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

    const keywords = tokenize(question);

    let bestSentence = "";
    let bestScore = 0;

    for (const s of sentences) {
      const sc = scoreSentence(s, keywords);
      if (sc > bestScore) {
        bestScore = sc;
        bestSentence = s;
      }
    }

    // No meaningful match
    if (bestScore < Math.max(2, Math.ceil(keywords.length * 0.4))) {
      return NextResponse.json({
        result: `FALSE\n\nNo supporting evidence found on the page.`,
      });
    }

    const q = question.toLowerCase();
    const s = bestSentence.toLowerCase();

    // Basic contradiction checks
    const places = ["africa", "europe", "asia", "america", "australia"];

    for (const place of places) {
      if (q.includes(place) && !s.includes(place)) {
        // If question claims a place but sentence talks about another
        for (const other of places) {
          if (other !== place && s.includes(other)) {
            return NextResponse.json({
              result: `FALSE\n\nEvidence:\n${bestSentence}`,
            });
          }
        }
      }
    }

    // Negation detection (e.g., "Nigeria is NOT in Europe")
    if (hasNegation(s)) {
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
