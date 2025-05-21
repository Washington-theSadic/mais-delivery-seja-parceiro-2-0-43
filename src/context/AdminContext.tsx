
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface MarketingCampaign {
  id: string;
  imageUrl: string;
}

export interface TeamMember {
  id: string;
  imageUrl: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  business: string;
  location: string;
  logoUrl: string;
}

export interface Video {
  id: string;
  url: string;
  title: string;
}

interface AdminContextType {
  marketingCampaigns: MarketingCampaign[];
  teamMembers: TeamMember[];
  testimonials: Testimonial[];
  videos: Video[];
  isLoading: boolean;
  updateMarketingCampaigns: (campaigns: MarketingCampaign[]) => Promise<void>;
  updateTeamMembers: (members: TeamMember[]) => Promise<void>;
  updateTestimonials: (testimonials: Testimonial[]) => Promise<void>;
  updateVideos: (videos: Video[]) => Promise<void>;
  refreshData: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [marketingCampaigns, setMarketingCampaigns] = useState<MarketingCampaign[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Função para carregar dados das campanhas de marketing
  const fetchMarketingCampaigns = async () => {
    try {
      console.log('Fetchando campanhas de marketing');
      const { data, error } = await supabase
        .from('marketing_campaigns')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Erro ao carregar campanhas:', error);
        throw error;
      }

      console.log('Campanhas carregadas:', data);
      const formattedData = data.map(campaign => ({
        id: campaign.id,
        imageUrl: campaign.image_url
      }));

      setMarketingCampaigns(formattedData);
      return formattedData;
    } catch (error) {
      console.error('Erro ao carregar campanhas de marketing:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar as campanhas de marketing.",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Função para carregar dados dos membros da equipe
  const fetchTeamMembers = async () => {
    try {
      console.log('Fetchando membros da equipe');
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Erro ao carregar equipe:', error);
        throw error;
      }

      console.log('Membros da equipe carregados:', data);
      const formattedData = data.map(member => ({
        id: member.id,
        imageUrl: member.image_url
      }));

      setTeamMembers(formattedData);
      return formattedData;
    } catch (error) {
      console.error('Erro ao carregar membros da equipe:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os membros da equipe.",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Função para carregar dados dos depoimentos
  const fetchTestimonials = async () => {
    try {
      console.log('Fetchando depoimentos');
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Erro ao carregar depoimentos:', error);
        throw error;
      }

      console.log('Depoimentos carregados:', data);
      const formattedData = data.map(testimonial => ({
        id: testimonial.id,
        quote: testimonial.quote,
        author: testimonial.author,
        business: testimonial.business,
        location: testimonial.location,
        logoUrl: testimonial.logo_url
      }));

      setTestimonials(formattedData);
      return formattedData;
    } catch (error) {
      console.error('Erro ao carregar depoimentos:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os depoimentos.",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Função para carregar dados dos vídeos
  const fetchVideos = async () => {
    try {
      console.log('Fetchando vídeos');
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Erro ao carregar vídeos:', error);
        throw error;
      }

      console.log('Vídeos carregados:', data);
      const formattedData = data.map(video => ({
        id: video.id,
        url: video.url,
        title: video.title
      }));

      setVideos(formattedData);
      return formattedData;
    } catch (error) {
      console.error('Erro ao carregar vídeos:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os vídeos.",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Função para recarregar todos os dados
  const refreshData = useCallback(async () => {
    console.log('Recarregando todos os dados');
    setIsLoading(true);
    try {
      await Promise.all([
        fetchMarketingCampaigns(),
        fetchTeamMembers(),
        fetchTestimonials(),
        fetchVideos()
      ]);
      toast({
        title: "Dados atualizados",
        description: "Todos os dados foram sincronizados com sucesso"
      });
    } catch (error) {
      console.error('Erro ao recarregar dados:', error);
      toast({
        title: "Erro na sincronização",
        description: "Ocorreu um erro ao sincronizar os dados",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Carregar todos os dados quando o componente é montado
  useEffect(() => {
    const loadAllData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          fetchMarketingCampaigns(),
          fetchTeamMembers(),
          fetchTestimonials(),
          fetchVideos()
        ]);
      } catch (error) {
        console.error('Erro ao carregar dados iniciais:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAllData();

    // Configurar inscrições em tempo real para atualizações
    const marketingCampaignsSubscription = supabase
      .channel('public:marketing_campaigns')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'marketing_campaigns' 
      }, (payload) => {
        console.log('Alteração detectada em marketing_campaigns:', payload);
        fetchMarketingCampaigns();
      })
      .subscribe();

    const teamMembersSubscription = supabase
      .channel('public:team_members')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'team_members' 
      }, (payload) => {
        console.log('Alteração detectada em team_members:', payload);
        fetchTeamMembers();
      })
      .subscribe();

    const testimonialsSubscription = supabase
      .channel('public:testimonials')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'testimonials' 
      }, (payload) => {
        console.log('Alteração detectada em testimonials:', payload);
        fetchTestimonials();
      })
      .subscribe();

    const videosSubscription = supabase
      .channel('public:videos')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'videos' 
      }, (payload) => {
        console.log('Alteração detectada em videos:', payload);
        fetchVideos();
      })
      .subscribe();

    // Limpar inscrições quando o componente é desmontado
    return () => {
      supabase.removeChannel(marketingCampaignsSubscription);
      supabase.removeChannel(teamMembersSubscription);
      supabase.removeChannel(testimonialsSubscription);
      supabase.removeChannel(videosSubscription);
    };
  }, []);

  // Função para atualizar campanhas de marketing
  const updateMarketingCampaigns = async (campaigns: MarketingCampaign[]) => {
    try {
      console.log('Atualizando campanhas de marketing:', campaigns);
      
      // Obter campanhas existentes para determinar quais excluir
      const { data: existingCampaigns } = await supabase
        .from('marketing_campaigns')
        .select('id');
      
      const existingIds = existingCampaigns?.map(c => c.id) || [];
      const newIds = campaigns.map(c => c.id);
      
      // IDs para excluir (existem no banco, mas não na nova lista)
      const idsToDelete = existingIds.filter(id => !newIds.includes(id));
      
      console.log('IDs a excluir:', idsToDelete);
      
      // Excluir campanhas que não estão mais na lista
      if (idsToDelete.length > 0) {
        const { error: deleteError } = await supabase
          .from('marketing_campaigns')
          .delete()
          .in('id', idsToDelete);
          
        if (deleteError) {
          console.error('Erro ao excluir campanhas:', deleteError);
          throw deleteError;
        }
      }
      
      // Atualizar ou inserir campanhas existentes
      for (const campaign of campaigns) {
        if (campaign.id.startsWith('campaign-')) {
          // Nova campanha (ID temporário do frontend)
          console.log('Inserindo nova campanha:', campaign);
          const { error: insertError } = await supabase
            .from('marketing_campaigns')
            .insert({
              image_url: campaign.imageUrl
            });
            
          if (insertError) {
            console.error('Erro ao inserir campanha:', insertError);
            throw insertError;
          }
        } else {
          // Campanha existente
          console.log('Atualizando campanha existente:', campaign);
          const { error: updateError } = await supabase
            .from('marketing_campaigns')
            .update({
              image_url: campaign.imageUrl,
              updated_at: new Date().toISOString()
            })
            .eq('id', campaign.id);
            
          if (updateError) {
            console.error('Erro ao atualizar campanha:', updateError);
            throw updateError;
          }
        }
      }
      
      // Atualizar estado local
      await fetchMarketingCampaigns();
      
      toast({
        title: "Sucesso",
        description: "Campanhas de marketing atualizadas com sucesso"
      });
    } catch (error) {
      console.error('Erro ao atualizar campanhas de marketing:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar as campanhas de marketing",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Função para atualizar membros da equipe
  const updateTeamMembers = async (members: TeamMember[]) => {
    try {
      console.log('Atualizando membros da equipe:', members);
      
      // Obter membros existentes para determinar quais excluir
      const { data: existingMembers } = await supabase
        .from('team_members')
        .select('id');
      
      const existingIds = existingMembers?.map(m => m.id) || [];
      const newIds = members.map(m => m.id);
      
      // IDs para excluir (existem no banco, mas não na nova lista)
      const idsToDelete = existingIds.filter(id => !newIds.includes(id));
      
      console.log('IDs a excluir:', idsToDelete);
      
      // Excluir membros que não estão mais na lista
      if (idsToDelete.length > 0) {
        const { error: deleteError } = await supabase
          .from('team_members')
          .delete()
          .in('id', idsToDelete);
          
        if (deleteError) {
          console.error('Erro ao excluir membros da equipe:', deleteError);
          throw deleteError;
        }
      }
      
      // Atualizar ou inserir membros existentes
      for (const member of members) {
        if (member.id.startsWith('team-')) {
          // Novo membro (ID temporário do frontend)
          console.log('Inserindo novo membro da equipe:', member);
          const { error: insertError } = await supabase
            .from('team_members')
            .insert({
              image_url: member.imageUrl
            });
            
          if (insertError) {
            console.error('Erro ao inserir membro da equipe:', insertError);
            throw insertError;
          }
        } else {
          // Membro existente
          console.log('Atualizando membro da equipe existente:', member);
          const { error: updateError } = await supabase
            .from('team_members')
            .update({
              image_url: member.imageUrl,
              updated_at: new Date().toISOString()
            })
            .eq('id', member.id);
            
          if (updateError) {
            console.error('Erro ao atualizar membro da equipe:', updateError);
            throw updateError;
          }
        }
      }
      
      // Atualizar estado local
      await fetchTeamMembers();
      
      toast({
        title: "Sucesso",
        description: "Membros da equipe atualizados com sucesso"
      });
    } catch (error) {
      console.error('Erro ao atualizar membros da equipe:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar os membros da equipe",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Função para atualizar depoimentos
  const updateTestimonials = async (updatedTestimonials: Testimonial[]) => {
    try {
      console.log('Atualizando depoimentos:', updatedTestimonials);
      
      // Obter depoimentos existentes para determinar quais excluir
      const { data: existingTestimonials } = await supabase
        .from('testimonials')
        .select('id');
      
      const existingIds = existingTestimonials?.map(t => t.id) || [];
      const newIds = updatedTestimonials.map(t => t.id);
      
      // IDs para excluir (existem no banco, mas não na nova lista)
      const idsToDelete = existingIds.filter(id => !newIds.includes(id));
      
      console.log('IDs a excluir:', idsToDelete);
      
      // Excluir depoimentos que não estão mais na lista
      if (idsToDelete.length > 0) {
        const { error: deleteError } = await supabase
          .from('testimonials')
          .delete()
          .in('id', idsToDelete);
          
        if (deleteError) {
          console.error('Erro ao excluir depoimentos:', deleteError);
          throw deleteError;
        }
      }
      
      // Atualizar ou inserir depoimentos existentes
      for (const testimonial of updatedTestimonials) {
        if (testimonial.id.startsWith('testimonial-')) {
          // Novo depoimento (ID temporário do frontend)
          console.log('Inserindo novo depoimento:', testimonial);
          const { error: insertError } = await supabase
            .from('testimonials')
            .insert({
              quote: testimonial.quote,
              author: testimonial.author,
              business: testimonial.business,
              location: testimonial.location,
              logo_url: testimonial.logoUrl
            });
            
          if (insertError) {
            console.error('Erro ao inserir depoimento:', insertError);
            throw insertError;
          }
        } else {
          // Depoimento existente
          console.log('Atualizando depoimento existente:', testimonial);
          const { error: updateError } = await supabase
            .from('testimonials')
            .update({
              quote: testimonial.quote,
              author: testimonial.author,
              business: testimonial.business,
              location: testimonial.location,
              logo_url: testimonial.logoUrl,
              updated_at: new Date().toISOString()
            })
            .eq('id', testimonial.id);
            
          if (updateError) {
            console.error('Erro ao atualizar depoimento:', updateError);
            throw updateError;
          }
        }
      }
      
      // Atualizar estado local
      await fetchTestimonials();
      
      toast({
        title: "Sucesso",
        description: "Depoimentos atualizados com sucesso"
      });
    } catch (error) {
      console.error('Erro ao atualizar depoimentos:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar os depoimentos",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Função para atualizar vídeos
  const updateVideos = async (updatedVideos: Video[]) => {
    try {
      console.log('Atualizando vídeos:', updatedVideos);
      
      // Obter vídeos existentes para determinar quais excluir
      const { data: existingVideos } = await supabase
        .from('videos')
        .select('id');
      
      const existingIds = existingVideos?.map(v => v.id) || [];
      const newIds = updatedVideos.map(v => v.id);
      
      // IDs para excluir (existem no banco, mas não na nova lista)
      const idsToDelete = existingIds.filter(id => !newIds.includes(id));
      
      console.log('IDs a excluir:', idsToDelete);
      
      // Excluir vídeos que não estão mais na lista
      if (idsToDelete.length > 0) {
        const { error: deleteError } = await supabase
          .from('videos')
          .delete()
          .in('id', idsToDelete);
          
        if (deleteError) {
          console.error('Erro ao excluir vídeos:', deleteError);
          throw deleteError;
        }
      }
      
      // Atualizar ou inserir vídeos existentes
      for (const video of updatedVideos) {
        if (video.id.startsWith('video-')) {
          // Novo vídeo (ID temporário do frontend)
          console.log('Inserindo novo vídeo:', video);
          const { error: insertError } = await supabase
            .from('videos')
            .insert({
              url: video.url,
              title: video.title
            });
            
          if (insertError) {
            console.error('Erro ao inserir vídeo:', insertError);
            throw insertError;
          }
        } else {
          // Vídeo existente
          console.log('Atualizando vídeo existente:', video);
          const { error: updateError } = await supabase
            .from('videos')
            .update({
              url: video.url,
              title: video.title,
              updated_at: new Date().toISOString()
            })
            .eq('id', video.id);
            
          if (updateError) {
            console.error('Erro ao atualizar vídeo:', updateError);
            throw updateError;
          }
        }
      }
      
      // Atualizar estado local
      await fetchVideos();
      
      toast({
        title: "Sucesso",
        description: "Vídeos atualizados com sucesso"
      });
    } catch (error) {
      console.error('Erro ao atualizar vídeos:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar os vídeos",
        variant: "destructive"
      });
      throw error;
    }
  };
  
  return (
    <AdminContext.Provider value={{
      marketingCampaigns,
      teamMembers,
      testimonials,
      videos,
      isLoading,
      updateMarketingCampaigns,
      updateTeamMembers,
      updateTestimonials,
      updateVideos,
      refreshData
    }}>
      {children}
    </AdminContext.Provider>
  );
};
