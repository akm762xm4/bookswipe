import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { Order } from "@/models/Order";
import Link from "next/link";
import { Badge } from "@/app/components/ui/Badge";

export default async function OrdersPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  const session = token ? verifyToken(token) : null;
  if (!session) return <div className="text-slate-400">Please login to view orders.</div>;

  let orders: any[] = [];
  try {
    orders = await Order.find({ userId: session.sub }).sort({ createdAt: -1 }).lean();
  } catch (e) {
    orders = [];
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Your Orders</h1>
      <div className="space-y-3">
        {orders.map((o) => (
          <Link key={o._id} href={`/orders/${o._id}`} className="block bg-slate-900 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold">Order #{String(o._id).slice(-6)}</div>
                <div className="text-xs text-slate-400">{new Date(o.createdAt).toLocaleString()}</div>
              </div>
              <Badge color={o.orderStatus === "DELIVERED" ? "success" : o.orderStatus === "CANCELLED" ? "error" : "default"}>{o.orderStatus}</Badge>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}