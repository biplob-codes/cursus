import { requireUser } from "@/lib/session";
import { ProfileForm } from "./profile-form";

export default async function ProfilePage() {
  await requireUser();

  return (
    <div className="mx-auto w-full max-w-4xl space-y-10">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        Profile
      </h1>
      <ProfileForm />
    </div>
  );
}
