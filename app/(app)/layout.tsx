import { AppShell } from "@/components/app-shell";
import { getSession } from "@/lib/session";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // Only wrap with the app shell when the user is logged in.
  // Unauthenticated users just get the children (the root page will show marketing).
  if (!session?.user) {
    return <>{children}</>;
  }

  return <AppShell>{children}</AppShell>;
}
