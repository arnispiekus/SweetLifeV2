import { createClient } from '@/lib/supabase/server';
import AdminNav from '@/components/admin/AdminNav';

export const metadata = {
  title: 'Menu Admin · Sweet Life',
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Login page renders without the admin chrome (middleware guarantees no user here).
  if (!user) return <>{children}</>;

  return (
    <div className="min-h-screen bg-warm-cream">
      <AdminNav email={user.email ?? ''} />
      <main className="container py-8">{children}</main>
    </div>
  );
}
