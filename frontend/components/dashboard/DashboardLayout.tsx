import TopBar from "./TopBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 font-sans text-slate-900 flex flex-col">
      <TopBar />

      <main className="flex-1 w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="space-y-6">{children}</div>
      </main>
    </div>
  );
}
