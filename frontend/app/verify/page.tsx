"use client";

import { useState } from "react";

export default function VerifyPage() {
  const [url, setUrl] = useState("");
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState("");

  const handleVerify = async () => {
    setResult("Verifying...");

    const res = await fetch("/api/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, question }),
    });

    const data = await res.json();

    setResult(`
Answer: ${data.answer}

Reasoning:
${data.reasoning}
`);
  };

  return (
    <main style={{ padding: 40, fontFamily: "sans-serif" }}>
      <h1>Web Verification Oracle</h1>

      <input
        type="text"
        placeholder="Paste webpage URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 10 }}
      />

      <textarea
        placeholder="Ask your question about the page"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        style={{ width: "100%", padding: 10, height: 100 }}
      />

      <button
        onClick={handleVerify}
        style={{ marginTop: 10, padding: 10 }}
      >
        Verify
      </button>

      <pre style={{ marginTop: 20, whiteSpace: "pre-wrap" }}>
        {result}
      </pre>
    </main>
  );
}
