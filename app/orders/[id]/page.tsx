import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { Order } from "@/models/Order";

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  const session = token ? verifyToken(token) : null;
  if (!session) return <div className="text-slate-400">Please login to view order.</div>;

  let order: any = null;
  try {
    order = await Order.findOne({ _id: params.id, userId: session.sub }).lean();
  } catch (e) {
    order = null;
  }

  if (!order) return <div className="text-slate-400">Order not found.</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Order #{String(order._id).slice(-6)}</h1>
      <div className="bg-slate-900 rounded-2xl p-4">
        <h2 className="font-semibold mb-2">Items</h2>
        <div className="space-y-2">
          {order.items.map((it: any, idx: number) => (
            <div key={idx} className="flex items-center justify-between text-sm">
              <div>
                <div className="font-medium">{it.title}</div>
                <div className="text-slate-400">Qty: {it.quantity}</div>
              </div>
              <div>₹{it.price}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-slate-900 rounded-2xl p-4">
        <h2 className="font-semibold mb-2">Delivery Address</h2>
        <div className="text-sm text-slate-300">
          <div>{order.address.fullName}</div>
          <div>{order.address.line1}</div>
          {order.address.line2 && <div>{order.address.line2}</div>}
          <div>
            {order.address.city}, {order.address.state} - {order.address.pincode}
          </div>
          <div>Phone: {order.address.phone}</div>
        </div>
      </div>
      <div className="bg-slate-900 rounded-2xl p-4 flex items-center justify-between">
        <span className="text-sm text-slate-400">Total</span>
        <span className="text-base font-semibold">₹{order.totalAmount}</span>
      </div>
    </div>
  );
}