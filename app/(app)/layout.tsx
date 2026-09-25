import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Home from "../home";
import Sidebar from "../sidebar";

const AppLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) return <Home />;
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 bg-background px-24 py-16">{children}</main>
    </div>
  );
};

export default AppLayout;
