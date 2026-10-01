import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (session?.user) redirect("/");

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      {children}
    </main>
  );
}
