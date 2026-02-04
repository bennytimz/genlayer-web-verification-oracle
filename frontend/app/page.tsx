import Link from "next/link";

export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "sans-serif",
        textAlign: "center",
        padding: "40px",
      }}
    >
      <h1 style={{ fontSize: "42px", marginBottom: "20px" }}>
        GenLayer Web Verification Oracle
      </h1>

      <p style={{ fontSize: "18px", maxWidth: "700px", marginBottom: "16px" }}>
        A lightweight oracle that determines whether a statement is
        <strong> TRUE or FALSE </strong>
        by analyzing the actual content of a webpage.
      </p>

      <p style={{ fontSize: "18px", maxWidth: "700px", marginBottom: "16px" }}>
        Built to work seamlessly with <strong>GenLayer Intelligent Contracts</strong>
        — without relying on paid APIs or external fact-checking services.
      </p>

      <p style={{ fontSize: "18px", maxWidth: "700px", marginBottom: "30px" }}>
        Simply provide a webpage and a question. The oracle scans the page,
        matches relevant keywords, and returns a verifiable TRUE or FALSE result
        with reasoning.
      </p>

      <Link href="/verify">
        <button
          style={{
            padding: "14px 28px",
            fontSize: "16px",
            cursor: "pointer",
            borderRadius: "8px",
            border: "none",
          }}
        >
          Start Verifying →
        </button>
      </Link>
    </main>
  );
}
