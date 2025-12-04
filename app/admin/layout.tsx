import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  const session = token ? verifyToken(token) : null;

  if (!session || session.role !== "ADMIN") {
    redirect("/auth/login");
  }

  return (
    <div>
      {children}
    </div>
  );
}