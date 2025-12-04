"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/app/components/ui/Input";
import { Button } from "@/app/components/ui/Button";
import { Card } from "@/app/components/ui/Card";

export default function CheckoutPage() {
  const router = useRouter();
  const [address, setAddress] = useState({
    fullName: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Placeholder cart items until cart state is wired
  const items = [] as any[];

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, address, paymentMethod: "COD" }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Order failed");
      }
      router.push("/orders");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Checkout</h1>
      <Card className="p-4">
        <form onSubmit={submit} className="space-y-3">
          <Input label="Full Name" value={address.fullName} onChange={(e) => setAddress({ ...address, fullName: e.target.value })} />
          <Input label="Address Line 1" value={address.line1} onChange={(e) => setAddress({ ...address, line1: e.target.value })} />
          <Input label="Address Line 2" value={address.line2} onChange={(e) => setAddress({ ...address, line2: e.target.value })} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="City" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
            <Input label="State" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Pincode" value={address.pincode} onChange={(e) => setAddress({ ...address, pincode: e.target.value })} />
            <Input label="Phone" value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} />
          </div>
          {error && <div className="text-sm text-red-400">{error}</div>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Placing order..." : "Place Order (COD)"}
          </Button>
        </form>
      </Card>
    </div>
  );
}