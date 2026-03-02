"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";

function CheckinContent() {
  const searchParams = useSearchParams();
  const ct = searchParams.get("ct");
  const [status, setStatus] = useState<"loading" | "success" | "error" | "missing">(
    ct ? "loading" : "missing"
  );

  useEffect(() => {
    if (!ct) return;

    fetch(`/api/checkin?ct=${encodeURIComponent(ct)}`)
      .then((res) => {
        if (res.ok) {
          setStatus("success");
        } else {
          setStatus("error");
        }
      })
      .catch(() => {
        setStatus("error");
      });
  }, [ct]);

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Last Message</h1>

        {status === "loading" && (
          <p className="text-sm text-gray-500">Checking in...</p>
        )}

        {status === "success" && (
          <div className="border border-green-300 bg-green-50 rounded-md p-4 text-sm text-green-900">
            <p className="font-semibold">Check-in confirmed.</p>
            <p className="mt-1">Your timer has been reset. See you in 30 days (or sooner).</p>
          </div>
        )}

        {status === "error" && (
          <div className="border border-red-300 bg-red-50 rounded-md p-4 text-sm text-red-900">
            <p className="font-semibold">Check-in failed.</p>
            <p className="mt-1">This token is invalid or the message has already been released.</p>
          </div>
        )}

        {status === "missing" && (
          <div className="border border-gray-300 bg-gray-50 rounded-md p-4 text-sm text-gray-700">
            <p>No check-in token provided.</p>
            <p className="mt-1">Use the check-in URL you received when you created your message.</p>
          </div>
        )}
      </div>
    </main>
  );
}

export default function CheckinPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center p-4">
          <p className="text-sm text-gray-500">Loading...</p>
        </main>
      }
    >
      <CheckinContent />
    </Suspense>
  );
}
