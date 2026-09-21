import React from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminAuthGuard } from '@/components/admin/AdminAuthGuard';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-[#F8F7FC] flex flex-col lg:flex-row">
        <AdminSidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </AdminAuthGuard>
  );
}

