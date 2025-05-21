
import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminGuard } from '@/components/admin/AdminGuard';
import { DashboardCards } from '@/components/admin/dashboard/DashboardCards';
import { ClickUpFormUrlConfig } from '@/components/admin/dashboard/ClickUpFormUrlConfig';
import { AdminUserManagement } from '@/components/admin/dashboard/AdminUserManagement';
import { InstructionsCard } from '@/components/admin/dashboard/InstructionsCard';
// Removed: import { useUnsavedChanges } from '@/context/UnsavedChangesContext';
// Removed: import { useAdminGuard } from '@/components/admin/AdminGuard'; (if only for setUnsavedChanges)

const AdminDashboard = () => {
  // Removed: const { setUnsavedChanges } = useAdminGuard();
  // Removed: const unsavedChangesContext = useUnsavedChanges();
  
  // Removed: handleUnsavedChanges function

  return (
    <AdminGuard>
      <AdminLayout active="dashboard">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
          <p className="text-gray-500">Bem-vindo ao painel administrativo do Mais Delivery</p>
        </div>
        
        <DashboardCards />
        <ClickUpFormUrlConfig /> {/* Prop removed */}
        <AdminUserManagement />
        <InstructionsCard />
      </AdminLayout>
    </AdminGuard>
  );
};

export default AdminDashboard;

