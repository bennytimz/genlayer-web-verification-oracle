"use client";

import { useState } from "react";

export default function Verify() {
  const [url, setUrl] = useState("");
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState("");

  const verify = async () => {
    setResult("Checking...");

    const res = await fetch("/api/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, question }),
    });

    const data = await res.json();
    setResult(data.result);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-xl rounded-2xl p-10 max-w-xl w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Verify a Web Claim
        </h1>

        <input
          type="text"
          placeholder="Enter webpage URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full border p-3 rounded-lg mb-4"
        />

        <input
          type="text"
          placeholder="Enter statement to verify"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full border p-3 rounded-lg mb-4"
        />

        <button
          onClick={verify}
          className="w-full bg-black text-white p-3 rounded-lg hover:opacity-80 transition"
        >
          Verify
        </button>

        {result && (
          <div className="mt-6 text-center text-xl font-semibold">
            Result: {result}
          </div>
        )}
      </div>
    </main>
  );
}
