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
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      {/* Subtle square grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0
          bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)]
          bg-size-[48px_48px]
          [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]
          opacity-60 dark:opacity-40"
      />

      {/* Soft primary tint so the grid has a bit of color */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0
          bg-[radial-gradient(ellipse_at_top,oklch(0.511_0.262_276.966_/_0.08),transparent_60%)]
          dark:bg-[radial-gradient(ellipse_at_top,oklch(0.585_0.233_277.115_/_0.12),transparent_60%)]"
      />

      <div className="relative z-10 w-full max-w-sm">{children}</div>
    </main>
  );
}
