import { ProfileForm } from "./profile-form";

export default function ProfilePage() {
  return (
    <main className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-2xl px-6 py-10">
        <ProfileForm />
      </div>
    </main>
  );
}
