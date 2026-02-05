import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-xl rounded-2xl p-10 max-w-xl w-full text-center">
        <h1 className="text-3xl font-bold mb-4">
          GenLayer Web Verification Oracle
        </h1>

        <p className="text-gray-600 mb-6">
          Verify whether a statement is true or false using the content of any
          live webpage. Designed for GenLayer intelligent contracts — no paid APIs.
        </p>

        <Link href="/verify">
          <button className="bg-black text-white px-6 py-3 rounded-lg hover:opacity-80 transition">
            Start Verification
          </button>
        </Link>
      </div>
    </main>
  );
}
