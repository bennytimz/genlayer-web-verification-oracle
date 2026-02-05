"use client";

import { useState } from "react";

export default function Verify() {
  const [url, setUrl] = useState("");
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const verify = async () => {
    if (!url || !question) return;

    setLoading(true);
    setResult("");

    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, question }),
      });

      const data = await res.json();
      setResult(data.result);
    } catch (err) {
      setResult("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resultColor =
    result === "TRUE"
      ? "text-green-600"
      : result === "FALSE"
      ? "text-red-600"
      : "text-gray-700";

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 px-4">
      <div className="bg-white shadow-2xl rounded-2xl p-10 max-w-xl w-full">
        <h1 className="text-3xl font-bold mb-2 text-center">
          Web Claim Verification
        </h1>
        <p className="text-center text-gray-500 mb-8">
          Check whether a statement is true or false based on webpage content.
        </p>

        <input
          type="text"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full border border-gray-300 focus:border-black focus:outline-none p-3 rounded-lg mb-4"
        />

        <input
          type="text"
          placeholder="Enter statement to verify"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full border border-gray-300 focus:border-black focus:outline-none p-3 rounded-lg mb-6"
        />

        <button
          onClick={verify}
          disabled={loading}
          className="w-full bg-black text-white p-3 rounded-lg hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Verify Claim"}
        </button>

        {result && (
          <div className={`mt-8 text-center text-2xl font-bold ${resultColor}`}>
            {result}
          </div>
        )}

        <p className="text-center text-xs text-gray-400 mt-10">
          Built by Bennytimz
        </p>
      </div>
    </main>
  );
}
