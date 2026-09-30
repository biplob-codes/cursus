// app/(app)/page.tsx
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getActivityData } from "@/lib/activity";
import { ActivityGraph } from "../activity-graph";

export default async function WelcomePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) redirect("/signin");

  const activity = await getActivityData(session.user.id);

  return (
    <div className="mx-auto w-full max-w-4xl space-y-10">
      <div>
        <h1 className="mb-1 text-2xl font-semibold tracking-tight text-foreground">
          Home
        </h1>
        <p className="text-sm text-muted-foreground">
          Your daily plan activity over the past year.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="px-0.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Activity
        </h2>
        <ActivityGraph data={activity} />
      </section>
    </div>
  );
}
