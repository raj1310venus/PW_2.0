"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";

export default function SignInPage() {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"idle" | "code_sent">("idle");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const sendCode = async () => {
    setMsg(null);
    if (!phone.trim()) {
      setMsg("Enter phone number including country code, e.g. +14165551234");
      return;
    }
    try {
      setBusy(true);
      const res = await fetch("/api/auth/phone/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send code");
      setStep("code_sent");
      setMsg("Code sent. Check your SMS.");
    } catch (e: any) {
      setMsg(e.message || "Failed to send code");
    } finally {
      setBusy(false);
    }
  };

  const verifyCode = async () => {
    setMsg(null);
    if (!phone.trim() || !code.trim()) {
      setMsg("Enter phone and the code you received");
      return;
    }
    try {
      setBusy(true);
      const res = await signIn("credentials", {
        phone: phone.trim(),
        code: code.trim(),
        redirect: false,
      });
      if (res?.error) throw new Error(res.error);
      setMsg("Signed in successfully");
      // Optionally refresh or redirect
      window.location.href = "/";
    } catch (e: any) {
      setMsg(e.message || "Invalid code");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-10">
      <h1 className="text-2xl font-semibold mb-6">Sign in</h1>
      {loading ? (
        <div className="text-white/70">Loading...</div>
      ) : session ? (
        <div className="space-y-4">
          <div className="text-white/80">Signed in as {session.user?.email || session.user?.name}</div>
          <button
            onClick={() => signOut()}
            className="w-full py-2 rounded bg-red-600 hover:bg-red-500 transition"
          >
            Sign out
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="space-y-3">
            <button
              onClick={() => signIn("google")}
              className="w-full py-2 rounded bg-white text-black hover:bg-white/90 transition"
            >
              Continue with Google
            </button>
            <button
              onClick={() => signIn("facebook")}
              className="w-full py-2 rounded bg-[#1877F2] hover:bg-[#1b66c9] transition"
            >
              Continue with Facebook
            </button>
          </div>

          <div className="border-t border-white/10 pt-6">
            <div className="font-medium mb-2">Or sign in with phone</div>
            <div className="space-y-3">
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone (e.g. +14165551234)"
                className="w-full px-3 py-2 rounded bg-white/10 border border-white/10 outline-none"
              />
              {step === "code_sent" && (
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Code"
                  className="w-full px-3 py-2 rounded bg-white/10 border border-white/10 outline-none"
                />
              )}
              <div className="flex gap-2">
                {step === "idle" ? (
                  <button onClick={sendCode} disabled={busy} className="flex-1 py-2 rounded bg-white/10 border border-white/10 hover:bg-white/20 transition disabled:opacity-60">
                    {busy ? "Sending..." : "Send code"}
                  </button>
                ) : (
                  <button onClick={verifyCode} disabled={busy} className="flex-1 py-2 rounded bg-white/10 border border-white/10 hover:bg-white/20 transition disabled:opacity-60">
                    {busy ? "Verifying..." : "Verify & sign in"}
                  </button>
                )}
              </div>
              {msg && <div className="text-sm text-white/70">{msg}</div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
