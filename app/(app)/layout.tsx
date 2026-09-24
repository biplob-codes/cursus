import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "../sidebar";
import { headers } from "next/headers";

const AppLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth.api.getSession({ headers: await headers() });
  console.log("app", session);

  if (!session?.user) redirect("/signup");
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 bg-background px-24 py-16">{children}</main>
    </div>
  );
};

export default AppLayout;
