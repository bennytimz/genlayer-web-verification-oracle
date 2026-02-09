import { NextRequest, NextResponse } from "next/server";

function clean(text: string) {
  return text
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function sentences(text: string) {
  return text.split(/[.!?]/).map(s => s.trim());
}

export async function POST(req: NextRequest) {
  try {
    const { url, question } = await req.json();

    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    const html = await res.text();
    const text = clean(html);
    const sents = sentences(text);

    const q = question.toLowerCase();

    let best = "";
    let bestScore = 0;

    for (const s of sents) {
      let score = 0;

      // direct phrase match is strongest signal
      if (s.includes(q)) score += 5;

      // check key words
      const words = q.split(" ").filter(w => w.length > 4);
      for (const w of words) {
        if (s.includes(w)) score++;
      }

      if (score > bestScore) {
        bestScore = score;
        best = s;
      }
    }

    // CRITICAL: check for negation
    const hasNegation =
      best.includes("not") ||
      best.includes("never") ||
      best.includes("no ") ||
      best.includes("none");

    let answer = "FALSE";

    if (bestScore > 3 && !hasNegation) {
      answer = "TRUE";
    }

    return NextResponse.json({
      result: `${answer}\n\nEvidence:\n${best}`,
    });
  } catch (e: any) {
    return NextResponse.json({
      result: "ERROR\n\nCould not verify page.",
    });
  }
}
