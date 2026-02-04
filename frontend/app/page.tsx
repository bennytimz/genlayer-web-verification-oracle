import Link from "next/link";

export default function Home() {
  return (
    <main style={{ padding: 40, fontFamily: "sans-serif" }}>
      <h1>GenLayer Web Verification Oracle</h1>

      <p>
        This oracle verifies whether a statement is true or false based on the
        content of a given webpage.
      </p>

      <p>
        It is designed to work with GenLayer intelligent contracts without
        requiring paid APIs.
      </p>

      <Link href="/verify">
        <button style={{ marginTop: 20, padding: 10 }}>
          Go to Verification Page
        </button>
      </Link>
    </main>
  );
}
