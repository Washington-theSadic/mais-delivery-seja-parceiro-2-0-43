
import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminGuard } from '@/components/admin/AdminGuard';
import { DashboardCards } from '@/components/admin/dashboard/DashboardCards';
import { ClickUpFormUrlConfig } from '@/components/admin/dashboard/ClickUpFormUrlConfig';
import { AdminUserManagement } from '@/components/admin/dashboard/AdminUserManagement';
import { InstructionsCard } from '@/components/admin/dashboard/InstructionsCard';
import { useAdmin } from '@/context/AdminContext';
import { Loader2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from 'react';

const AdminDashboard = () => {
  const { isLoading, refreshData } = useAdmin();
  const { toast } = useToast();
  
  // Forçar uma atualização dos dados ao carregar o dashboard
  useEffect(() => {
    const loadData = async () => {
      try {
        await refreshData();
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast({
          title: "Erro ao sincronizar dados",
          description: "Não foi possível atualizar os dados do banco de dados.",
          variant: "destructive"
        });
      }
    };
    
    loadData();
  }, [refreshData, toast]);
  
  return (
    <AdminGuard>
      <AdminLayout active="dashboard">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
          <p className="text-gray-500">Bem-vindo ao painel administrativo do Mais Delivery</p>
        </div>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-12 h-12 text-[#A21C1C] animate-spin mb-4" />
            <p className="text-gray-500">Carregando dados do banco de dados...</p>
          </div>
        ) : (
          <>
            <DashboardCards />
            <ClickUpFormUrlConfig />
            <AdminUserManagement />
            <InstructionsCard />
          </>
        )}
      </AdminLayout>
    </AdminGuard>
  );
};

export default AdminDashboard;
