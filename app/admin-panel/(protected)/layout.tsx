import { AdminDataProvider } from "../../../components/admin/AdminDataProvider";
import AuthGuard from "../../../components/admin/AuthGuard";
import Sidebar from "../../../components/admin/Sidebar";

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGuard>
      <AdminDataProvider>
        <div className="flex min-h-screen flex-col lg:flex-row">
          <Sidebar />
          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
            {children}
          </main>
        </div>
      </AdminDataProvider>
    </AuthGuard>
  );
}