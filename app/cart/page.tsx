"use client";
import { Button } from "@/app/components/ui/Button";
import { Card } from "@/app/components/ui/Card";

export default function CartPage() {
  // Placeholder cart UI; will be wired to state later
  const items = [] as any[];
  const subtotal = 0;

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Your Cart</h1>
      {items.length === 0 ? (
        <div className="text-slate-400">Your cart is empty.</div>
      ) : (
        <div className="space-y-3">
          {items.map((item, idx) => (
            <Card key={idx} className="p-3 flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold">{item.title}</div>
                <div className="text-xs text-slate-400">Qty: {item.quantity}</div>
              </div>
              <div className="text-sm">₹{item.price}</div>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Subtotal</span>
            <span className="text-base font-semibold">₹{subtotal}</span>
          </div>
          <Button className="w-full mt-3">Checkout</Button>
        </Card>
      </div>
    </div>
  );
}