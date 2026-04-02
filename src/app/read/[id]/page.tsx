"use client";

import { useState, useEffect, use } from "react";
import { decryptMessage } from "@/lib/crypto";

export default function ReadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [encryptedBlob, setEncryptedBlob] = useState<string | null>(null);
  const [decryptedMessage, setDecryptedMessage] = useState<string | null>(null);
  const [keyInput, setKeyInput] = useState("");
  const [status, setStatus] = useState<"loading" | "ready" | "decrypted" | "error" | "not-found">("loading");
  const [decrypting, setDecrypting] = useState(false);

  useEffect(() => {
    fetch(`/api/read/${id}`)
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Not found");
      })
      .then((data) => {
        setEncryptedBlob(data.encrypted_blob);
        setStatus("ready");
      })
      .catch(() => {
        setStatus("not-found");
      });
  }, [id]);

  async function handleDecrypt() {
    if (!encryptedBlob || !keyInput.trim()) return;

    setDecrypting(true);

    // Try to extract key from .key file content or raw input
    let key = keyInput.trim();
    const lines = key.split("\n").filter((l) => !l.startsWith("#") && l.trim());
    if (lines.length > 0) {
      key = lines[lines.length - 1].trim();
    }

    const result = await decryptMessage(encryptedBlob, key);
    if (result) {
      setDecryptedMessage(result);
      setStatus("decrypted");
    }
    // If result is null (wrong key), nothing happens — as specified
    setDecrypting(false);
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const content = reader.result as string;
      setKeyInput(content);
    };
    reader.readAsText(file);
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Last Message</h1>

        {status === "loading" && (
          <p className="text-sm text-gray-500">Loading...</p>
        )}

        {status === "not-found" && (
          <div className="border border-gray-300 bg-gray-50 rounded-md p-4 text-sm text-gray-700">
            <p className="font-semibold">Message not found.</p>
            <p className="mt-1">This message doesn&apos;t exist or hasn&apos;t been released yet.</p>
          </div>
        )}

        {status === "ready" && (
          <div className="space-y-4">
            <div className="border border-blue-200 bg-blue-50 rounded-md p-4 text-sm text-blue-900 space-y-2">
              <p className="font-semibold">Someone left you a message.</p>
              <p>
                Last Message is a dead man&apos;s switch. The person who wrote this
                set it to be delivered to you if they stopped checking in for 14
                days. They have not checked in. The message has been released.
              </p>
              <p>
                To read it, you need the encryption key — a <strong>.key file</strong>{" "}
                the sender kept. If you don&apos;t have it, the message cannot be
                decrypted.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Upload .key file or paste the encryption key
              </label>
              <div className="space-y-2">
                <input
                  type="file"
                  accept=".key,.txt"
                  onChange={handleFileUpload}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:border-gray-300 file:text-sm file:bg-white hover:file:bg-gray-50"
                />
                <textarea
                  rows={3}
                  className="w-full border border-gray-300 rounded-md p-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Or paste the encryption key here..."
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                />
              </div>
            </div>

            <button
              onClick={handleDecrypt}
              disabled={!keyInput.trim() || decrypting}
              className="w-full bg-black text-white py-3 rounded-md text-sm font-medium hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {decrypting ? "Decrypting..." : "Decrypt Message"}
            </button>
          </div>
        )}

        {status === "decrypted" && decryptedMessage && (
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-md p-6">
              <p className="text-sm text-gray-500 mb-3">The message reads:</p>
              <div className="whitespace-pre-wrap text-base leading-relaxed">
                {decryptedMessage}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
