"use client";

import { useState } from "react";
import {
  generateEncryptionKey,
  generateCheckinToken,
  encryptMessage,
  downloadKeyFile,
} from "@/lib/crypto";
import { sha256 } from "@/lib/hash";

type Step = "compose" | "confirm" | "done";

export default function Home() {
  const [step, setStep] = useState<Step>("compose");
  const [message, setMessage] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [checkinUrl, setCheckinUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (!message.trim() || !senderEmail.trim() || !recipientEmail.trim()) {
      setError("Message, your email, and recipient email are required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 1. Generate encryption key and check-in token
      const ek = await generateEncryptionKey();
      const ct = generateCheckinToken();

      // 2. Encrypt message client-side
      const encryptedBlob = await encryptMessage(message, ek);

      // 3. Hash CT client-side before sending to server
      const ctHash = await sha256(ct);

      // 4. Send to backend
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          encrypted_blob: encryptedBlob,
          ct_hash: ctHash,
          sender_email: senderEmail,
          recipient_email: recipientEmail,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create message");
      }

      // 5. Force-download the encryption key
      downloadKeyFile(ek);

      // 6. Build check-in URL
      const baseUrl = window.location.origin;
      const url = `${baseUrl}/checkin?ct=${ct}`;
      setCheckinUrl(url);

      // 7. Done
      setStep("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Last Message</h1>
        <p className="text-sm text-gray-500">
          A dead man&apos;s switch for the words that matter.
        </p>

        {step === "compose" && (
          <div className="space-y-4">
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-1">
                Your message
              </label>
              <textarea
                id="message"
                rows={6}
                className="w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Write the message you want delivered..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="senderEmail" className="block text-sm font-medium mb-1">
                Your email (for check-in reminders)
              </label>
              <input
                id="senderEmail"
                type="email"
                className="w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="you@example.com"
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                We will use this only to send check-in reminders. If this email is incorrect or unavailable, reminders may not arrive and your message may be released.
              </p>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Recipient&apos;s email
              </label>
              <input
                id="email"
                type="email"
                className="w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="who@example.com"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
              />
            </div>

            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            <button
              onClick={() => setStep("confirm")}
              disabled={!message.trim() || !senderEmail.trim() || !recipientEmail.trim()}
              className="w-full bg-black text-white py-3 rounded-md text-sm font-medium hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Continue
            </button>
          </div>
        )}

        {step === "confirm" && (
          <div className="space-y-4">
            <div className="border border-amber-300 bg-amber-50 rounded-md p-4 text-sm text-amber-900 space-y-2">
              <p className="font-semibold">Before you submit, understand this:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Your message will be encrypted. Only the key can unlock it.</li>
                <li>A <strong>.key file</strong> will download automatically. <strong>If you lose it, your message is permanently unrecoverable.</strong></li>
                <li>You&apos;ll get a check-in URL. Bookmark it. Visit it at least once every 14 days.</li>
                <li>If you stop checking in, the message is released to your recipient. <strong>No undo.</strong></li>
                <li>Anyone with the read link and your encryption key can read the message. That responsibility is yours.</li>
              </ul>
              <p className="mt-3 text-xs font-medium">
                Email reminders are best-effort. Failure to receive reminders does not pause release. We rely on your check-ins, not email delivery.
              </p>
            </div>

            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setStep("compose")}
                className="flex-1 border border-gray-300 py-3 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Go back
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-black text-white py-3 rounded-md text-sm font-medium hover:bg-gray-800 disabled:opacity-40 transition-colors"
              >
                {loading ? "Encrypting..." : "Encrypt & Store"}
              </button>
            </div>
          </div>
        )}

        {step === "done" && (
          <div className="space-y-4">
            <div className="border border-green-300 bg-green-50 rounded-md p-4 text-sm text-green-900 space-y-2">
              <p className="font-semibold">Message stored successfully.</p>
              <p>Your encryption key (.key file) has been downloaded.</p>
              <p className="font-semibold text-red-700">
                If you lose that file, your message is permanently unrecoverable.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Your check-in URL (bookmark this)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={checkinUrl}
                  className="flex-1 border border-gray-300 rounded-md p-3 text-sm bg-gray-50 font-mono text-xs"
                />
                <button
                  onClick={() => navigator.clipboard.writeText(checkinUrl)}
                  className="border border-gray-300 px-4 rounded-md text-sm hover:bg-gray-50 transition-colors"
                >
                  Copy
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Visit this link at least once every 14 days to keep your message from being released.
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
