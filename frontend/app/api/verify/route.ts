import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { pageText, question }: { pageText: string; question: string } =
    await req.json();

  try {
    const cleanText: string = pageText.toLowerCase();
    const cleanQuestion: string = question.toLowerCase();

    const words: string[] = cleanQuestion
      .split(" ")
      .filter((w: string) => w.length > 3);

    const matched: string[] = words.filter((w: string) =>
      cleanText.includes(w)
    );

    const answer: boolean = matched.length > 2;

    return NextResponse.json({
      result: `
Answer: ${answer ? "TRUE" : "FALSE"}

Reasoning:
Found matching keywords from the question inside the webpage text:
${matched.join(", ")}
`,
    });
  } catch (err) {
    return NextResponse.json({
      result: "Error verifying the webpage.",
    });
  }
}
