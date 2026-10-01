import { AppShell } from "@/components/app-shell";
import Home from "../home";

import { getSession } from "@/lib/session";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session?.user) return <Home />;
  return <AppShell>{children}</AppShell>;
}
