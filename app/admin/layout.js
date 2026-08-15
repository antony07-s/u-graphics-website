import AuthProvider from "@/components/providers/AuthProvider";
import AdminShell from "@/components/admin/AdminShell";

export const metadata = {
  title: "Admin | U Graphics",
  robots: { index: false, follow: false }, // keep admin out of search engines
};

export default function AdminLayout({ children }) {
  return (
    <AuthProvider>
      <AdminShell>{children}</AdminShell>
    </AuthProvider>
  );
}