import Sidebar from "./sidebar";

export default function HomePage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 bg-background px-24 py-16">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-2 text-4xl font-bold tracking-tight">Cursus</h1>
          <p className="text-[15px] text-muted-foreground">
            A minimal workspace inspired by Notion.
          </p>
        </div>
      </main>
    </div>
  );
}
