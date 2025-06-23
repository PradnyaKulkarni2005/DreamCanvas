'use client';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/libs/supabaseClient';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('token'); // optional, if you're storing custom tokens
    router.push('/login'); // or wherever you want to redirect
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
    >
      Logout
    </button>
  );
}
