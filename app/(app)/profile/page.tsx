import { ProfileForm } from "./profile-form";

export default function ProfilePage() {
  return (
    <main className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-4xl">
        <ProfileForm />
      </div>
    </main>
  );
}
