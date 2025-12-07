import { NextResponse } from "next/server";
import { User } from "@/models/User";
import { scryptHash, signToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ message: "Email and password required" }, { status: 400 });
    }
    const exists = await User.findOne({ email }).lean();
    if (exists) {
      return NextResponse.json({ message: "Email already registered" }, { status: 409 });
    }

    const passwordHash = await scryptHash(password);
    const user = await User.create({ name, email, passwordHash });
    const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7;
    const token = signToken({ sub: String(user._id), role: user.role as any, exp });
    const res = NextResponse.json({ id: user._id, email: user.email, name: user.name, role: user.role });
    res.cookies.set("session", token, { httpOnly: true, sameSite: "lax", path: "/" });
    return res;
  } catch (e) {
    return NextResponse.json({ message: "Database not available" }, { status: 503 });
  }
}
