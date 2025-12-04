import { NextResponse } from "next/server";
import { User } from "@/models/User";
import { scryptHash } from "@/lib/auth";

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
    return NextResponse.json({ id: user._id, email: user.email, name: user.name });
  } catch (e) {
    return NextResponse.json({ message: "Database not available" }, { status: 503 });
  }
}