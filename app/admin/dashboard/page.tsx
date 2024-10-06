// app/admin/dashboard/page.tsx
'use client'
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import UsersServer from '@/app/components/UsersServer';

const AdminDashboard: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn !== 'true') {
      router.push('/admin'); // Redirect to admin login page
    }
  }, [router]);

  return (
    <div>
      <UsersServer />  
    </div>
  );
};

export default AdminDashboard;
