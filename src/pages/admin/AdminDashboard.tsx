
import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminGuard } from '@/components/admin/AdminGuard';
import { DashboardCards } from '@/components/admin/dashboard/DashboardCards';
import { ClickUpFormUrlConfig } from '@/components/admin/dashboard/ClickUpFormUrlConfig';
import { AdminUserManagement } from '@/components/admin/dashboard/AdminUserManagement';
import { InstructionsCard } from '@/components/admin/dashboard/InstructionsCard';
import { useAdmin } from '@/context/AdminContext';
import { Loader2, RefreshCcw } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { supabase } from '@/integrations/supabase/client';

const AdminDashboard = () => {
  const { isLoading, refreshData } = useAdmin();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();
  
  // Verificar conexão com Supabase
  const [supabaseStatus, setSupabaseStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  
  // Verificar status da conexão com o Supabase
  useEffect(() => {
    const checkSupabaseConnection = async () => {
      try {
        const { data, error } = await supabase.from('marketing_campaigns').select('count').single();
        
        if (error) {
          console.error("Erro ao verificar conexão com Supabase:", error);
          setSupabaseStatus('error');
        } else {
          console.log("Conexão com Supabase estabelecida com sucesso:", data);
          setSupabaseStatus('connected');
        }
      } catch (error) {
        console.error("Erro ao verificar conexão com Supabase:", error);
        setSupabaseStatus('error');
      }
    };
    
    checkSupabaseConnection();
  }, []);
  
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
    
    // Configurar listeners para atualizações em tempo real
    const marketingCampaignsSubscription = supabase
      .channel('public:marketing_campaigns')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'marketing_campaigns' 
      }, () => {
        console.log('Dashboard: Detectada atualização na tabela marketing_campaigns');
        refreshData();
      })
      .subscribe();
      
    const teamMembersSubscription = supabase
      .channel('public:team_members')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'team_members' 
      }, () => {
        console.log('Dashboard: Detectada atualização na tabela team_members');
        refreshData();
      })
      .subscribe();
      
    const testimonialsSubscription = supabase
      .channel('public:testimonials')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'testimonials' 
      }, () => {
        console.log('Dashboard: Detectada atualização na tabela testimonials');
        refreshData();
      })
      .subscribe();
      
    const videosSubscription = supabase
      .channel('public:videos')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'videos' 
      }, () => {
        console.log('Dashboard: Detectada atualização na tabela videos');
        refreshData();
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(marketingCampaignsSubscription);
      supabase.removeChannel(teamMembersSubscription);
      supabase.removeChannel(testimonialsSubscription);
      supabase.removeChannel(videosSubscription);
    };
  }, [refreshData, toast]);
  
  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshData();
      toast({
        title: "Dados atualizados",
        description: "Todos os dados foram sincronizados com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao atualizar dados:", error);
      toast({
        title: "Erro na atualização",
        description: "Não foi possível atualizar os dados.",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  };
  
  return (
    <AdminGuard>
      <AdminLayout active="dashboard">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
            <p className="text-gray-500">Bem-vindo ao painel administrativo do Mais Delivery</p>
          </div>
          <Button
            onClick={handleManualRefresh}
            variant="outline"
            disabled={isRefreshing || isLoading}
            className="flex items-center gap-2"
          >
            {isRefreshing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCcw className="h-4 w-4" />
            )}
            <span>Atualizar Dados</span>
          </Button>
        </div>
        
        {supabaseStatus === 'checking' && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-md mb-4 flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <p>Verificando conexão com o banco de dados...</p>
          </div>
        )}
        
        {supabaseStatus === 'error' && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-md mb-4">
            <p className="font-medium">Erro de conexão com o banco de dados</p>
            <p className="text-sm mt-1">Verifique as políticas de acesso no Supabase e tente novamente.</p>
          </div>
        )}
        
        {supabaseStatus === 'connected' && (
          <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-md mb-4">
            <p className="font-medium">Conexão com o banco de dados estabelecida</p>
            <p className="text-sm mt-1">O sistema está pronto para salvar e recuperar dados.</p>
          </div>
        )}
        
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
