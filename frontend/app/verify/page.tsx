"use client";

import { useState } from "react";

export default function VerifyPage() {
  const [pageText, setPageText] = useState("");
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState<string | null>(null);

  const handleVerify = async () => {
    const res = await fetch("/api/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pageText, question }),
    });

    const data = await res.json();
    setResult(data.result);
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Web Verification Oracle</h1>

      <textarea
        placeholder="Paste text copied from the webpage here"
        value={pageText}
        onChange={(e) => setPageText(e.target.value)}
        className="border p-2 mb-2 w-full h-40"
      />

      <input
        type="text"
        placeholder="Enter your question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        className="border p-2 mb-2 w-full"
      />

      <button
        onClick={handleVerify}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Verify
      </button>

      {result && (
        <div className="border p-4 mt-2 whitespace-pre-wrap">
          {result}
        </div>
      )}
    </div>
  );
}
