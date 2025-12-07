"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/app/components/ui/Input";
import { Button } from "@/app/components/ui/Button";
import { Card } from "@/app/components/ui/Card";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (!name || name.trim().length < 2) {
        throw new Error("Name must be at least 2 characters");
      }
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error("Enter a valid email");
      }
      if (!password || password.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Registration failed");
      }
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" flex items-center justify-center">
      <Card className="w-full max-w-sm p-5">
        <h1 className="text-xl font-semibold mb-3">Create Account</h1>
        <p className="text-xs text-slate-400 mb-4">Join BookSwipe</p>
        <form onSubmit={submit} className="space-y-3">
          <Input
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Doe"
          />
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
          <label className="block space-y-1">
            <span className="text-xs text-slate-400">Password</span>
            <div className="relative">
              <input
                className="w-full rounded-2xl bg-slate-900 border border-slate-700 px-4 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </label>
          {error && <div className="text-[11px] text-red-400">{error}</div>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Creating..." : "Register"}
          </Button>
          <div className="text-[11px] text-slate-400 text-center">
            Already have an account? <a href="/auth/login" className="text-indigo-400 hover:text-indigo-300">Login</a>
          </div>
        </form>
      </Card>
    </div>
  );
}
