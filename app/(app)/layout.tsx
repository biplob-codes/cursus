import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Home from "../home";
import { AppShell } from "../app-shell";

const AppLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) return <Home />;
  return <AppShell>{children}</AppShell>;
};

export default AppLayout;
