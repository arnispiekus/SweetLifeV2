'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { LogOut, FileDown, ExternalLink } from 'lucide-react';

export default function AdminNav({ email }: { email: string }) {
  const router = useRouter();

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
      <div className="container flex items-center justify-between h-16">
        <div className="flex items-center gap-3">
          <span className="font-display text-xl font-bold text-charcoal">Menu Admin</span>
          <span className="text-xs text-rich-brown/50 hidden sm:inline">{email}</span>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/menu.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm btn-outline inline-flex items-center"
          >
            <FileDown size={16} className="mr-2" />
            PDF
          </a>
          <a
            href="/menu"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm btn-outline inline-flex items-center"
          >
            <ExternalLink size={16} className="mr-2" />
            View site
          </a>
          <button onClick={signOut} className="btn btn-sm btn-primary inline-flex items-center">
            <LogOut size={16} className="mr-2" />
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
