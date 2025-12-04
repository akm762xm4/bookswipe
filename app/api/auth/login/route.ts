import { NextResponse } from "next/server";
import { User } from "@/models/User";
import { scryptVerify, signToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ message: "Email and password required" }, { status: 400 });
    }

    const user = await User.findOne({ email }).lean();
    if (!user) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const ok = await scryptVerify(password, user.passwordHash);
    if (!ok) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7; // 7 days
    const token = signToken({ sub: String(user._id), role: user.role as any, exp });

    const res = NextResponse.json({ id: user._id, email: user.email, name: user.name });
    res.cookies.set("session", token, { httpOnly: true, sameSite: "lax", path: "/" });
    return res;
  } catch (e) {
    return NextResponse.json({ message: "Database not available" }, { status: 503 });
  }
}