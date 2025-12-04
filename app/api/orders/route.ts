import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { Order } from "@/models/Order";

async function getUserFromCookie() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function GET() {
  const session = await getUserFromCookie();
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const orders = await Order.find({ userId: session.sub }).sort({ createdAt: -1 }).lean();
    return NextResponse.json(orders);
  } catch (e) {
    return NextResponse.json({ message: "Database not available" }, { status: 503 });
  }
}

export async function POST(req: Request) {
  const session = await getUserFromCookie();
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { items, address, paymentMethod } = body || {};
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ message: "Items required" }, { status: 400 });
    }
    if (!address) {
      return NextResponse.json({ message: "Address required" }, { status: 400 });
    }

    const totalAmount = items.reduce((sum: number, it: any) => sum + it.price * it.quantity, 0);

    const order = await Order.create({
      userId: session.sub,
      items,
      totalAmount,
      address,
      paymentMethod: paymentMethod || "COD",
      paymentStatus: "PENDING",
      orderStatus: "PLACED",
    });

    return NextResponse.json(order, { status: 201 });
  } catch (e) {
    return NextResponse.json({ message: "Database not available" }, { status: 503 });
  }
}