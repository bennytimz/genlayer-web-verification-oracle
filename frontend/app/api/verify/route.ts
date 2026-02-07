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
  return text
    .split(/[.!?]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 40); // ignore tiny junk
}

function extractKeywords(question: string) {
  const stopWords = new Set([
    "what","when","where","which","there","their","about","would","could",
    "should","these","those","whose","while","shall","will","from","have",
    "has","had","been","being","into","onto","than","then","that","this",
    "with","were","was","are","and","the","for","not","but","you","your",
    "his","her","its","our","out","who","why","how","can"
  ]);

  return question
    .toLowerCase()
    .split(/\W+/)
    .filter((w) => w.length > 4 && !stopWords.has(w));
}

export async function POST(req: NextRequest) {
  try {
    const { url, question } = await req.json();

    if (!url || !question) {
      throw new Error("Missing url or question");
    }

    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch page");
    }

    const html = await response.text();
    const pageText = cleanText(html);
    const sentences = splitIntoSentences(pageText);
    const keywords = extractKeywords(question);

    let bestScore = 0;
    let bestSentence = "";

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

    // Require strong evidence, not loose matches
    const requiredScore = Math.max(2, Math.ceil(keywords.length * 0.8));
    const answer = bestScore >= requiredScore;

    return NextResponse.json({
      answer: answer ? "TRUE" : "FALSE",
      reasoning: bestSentence || "No strong supporting sentence found",
    });
  } catch (err: any) {
    return NextResponse.json({
      answer: "ERROR",
      reasoning: err.message || "Verification failed",
    });
  }
}
