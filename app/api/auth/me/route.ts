import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { User } from "@/models/User";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  const session = token ? verifyToken(token) : null;
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const user = await User.findById(session.sub).lean();
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ id: user._id, email: user.email, name: user.name, role: user.role });
  } catch (e) {
    return NextResponse.json({ message: "Database not available" }, { status: 503 });
  }
}