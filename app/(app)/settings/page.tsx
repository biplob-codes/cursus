import { SettingsForm } from "./settings-form";

export default function SettingsPage() {
  return (
    <main className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-2xl px-6 py-10">
        <SettingsForm />
      </div>
    </main>
  );
}
