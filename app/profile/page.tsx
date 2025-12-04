"use client";
import { useEffect, useState } from "react";
import { Button } from "@/app/components/ui/Button";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch (_) {}
      setLoading(false);
    })();
  }, []);

  const confirmLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Profile</h1>

      {loading && <div className="text-slate-400">Loading...</div>}

      {!loading && user && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-white/70">Name</div>
              <div className="text-base font-medium">{user.name || "—"}</div>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs border ${user.role === "ADMIN" ? "bg-emerald-700/30 border-emerald-600/50" : "bg-white/10 border-white/20"}`}>
              {user.role}
            </div>
          </div>
          <div className="mt-3">
            <div className="text-sm text-white/70">Email</div>
            <div className="text-base font-medium">{user.email || "—"}</div>
          </div>
        </div>
      )}

      {!loading && !user && (
        <div className="text-slate-400 mb-4">You are not logged in.</div>
      )}

      <Button onClick={() => setShowLogoutModal(true)} variant="secondary">Logout</Button>

      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowLogoutModal(false)} />
          <div className="relative rounded-2xl bg-slate-900 border border-slate-800 p-6 w-[90%] max-w-sm">
            <h2 className="text-lg font-semibold mb-2">Confirm Logout</h2>
            <p className="text-sm text-white/70 mb-4">Are you sure you want to logout?</p>
            <div className="flex gap-2 justify-end">
              <Button onClick={() => setShowLogoutModal(false)} variant="secondary">Cancel</Button>
              <Button onClick={confirmLogout} variant="primary">Logout</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}