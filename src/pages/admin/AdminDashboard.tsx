
import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminGuard, useAdminGuard } from '@/components/admin/AdminGuard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Image, Users, MessageSquare, UserPlus, Video, ExternalLink } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { Link } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const AdminDashboard = () => {
  const { 
    marketingCampaigns, 
    teamMembers, 
    testimonials,
    videos
  } = useAdmin();
  
  const { setUnsavedChanges } = useAdminGuard();
  const [clickUpFormUrl, setClickUpFormUrl] = useState<string>('');
  const [hasChanged, setHasChanged] = useState<boolean>(false);
  const [isNewAdminDialogOpen, setIsNewAdminDialogOpen] = useState<boolean>(false);
  const [newAdminEmail, setNewAdminEmail] = useState<string>('');
  const [newAdminPassword, setNewAdminPassword] = useState<string>('');
  const [isValidUrl, setIsValidUrl] = useState<boolean>(true);
  const [admins, setAdmins] = useState<string[]>(() => {
    const savedAdmins = localStorage.getItem('admin-users');
    if (savedAdmins) return JSON.parse(savedAdmins);
    
    const currentEmail = localStorage.getItem('admin-email') || '';
    return currentEmail ? [currentEmail] : [];
  });
  const { toast } = useToast();
  
  useEffect(() => {
    // Load stored ClickUp form URL
    const savedUrl = localStorage.getItem('clickup-form-url') || '';
    setClickUpFormUrl(savedUrl);
  }, []);
  
  useEffect(() => {
    // Check if URL has changed from saved value
    const savedUrl = localStorage.getItem('clickup-form-url') || '';
    setHasChanged(clickUpFormUrl !== savedUrl);
    setUnsavedChanges(clickUpFormUrl !== savedUrl);
    
    // Basic URL validation
    if (clickUpFormUrl) {
      try {
        new URL(clickUpFormUrl);
        setIsValidUrl(true);
      } catch (e) {
        setIsValidUrl(false);
      }
    } else {
      setIsValidUrl(true); // Empty URL is allowed
    }
  }, [clickUpFormUrl, setUnsavedChanges]);
  
  useEffect(() => {
    // Save admins to localStorage
    localStorage.setItem('admin-users', JSON.stringify(admins));
  }, [admins]);
  
  const handleSaveClickUpUrl = () => {
    if (!isValidUrl) {
      toast({
        title: "URL inválida",
        description: "Por favor, insira uma URL válida",
        variant: "destructive",
      });
      return;
    }
    
    localStorage.setItem('clickup-form-url', clickUpFormUrl);
    setHasChanged(false);
    setUnsavedChanges(false);
    toast({
      title: "URL do formulário salva",
      description: "A URL do formulário ClickUp foi salva com sucesso.",
      duration: 3000,
    });
    
    // Trigger storage event for other tabs
    window.dispatchEvent(new Event('storage'));
  };
  
  const handleAddNewAdmin = () => {
    if (!newAdminEmail || !newAdminPassword) {
      toast({
        title: "Dados incompletos",
        description: "Por favor, informe email e senha para o novo administrador.",
        variant: "destructive"
      });
      return;
    }
    
    if (!newAdminEmail.includes('@')) {
      toast({
        title: "Email inválido",
        description: "Por favor, informe um email válido.",
        variant: "destructive"
      });
      return;
    }
    
    if (newAdminPassword.length < 6) {
      toast({
        title: "Senha muito curta",
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive"
      });
      return;
    }
    
    // Simple storage in localStorage for demo purposes
    // This would normally be replaced with Supabase auth in real implementation
    const adminCredentials = JSON.parse(localStorage.getItem('admin-credentials') || '{}');
    adminCredentials[newAdminEmail] = newAdminPassword;
    localStorage.setItem('admin-credentials', JSON.stringify(adminCredentials));
    
    if (!admins.includes(newAdminEmail)) {
      setAdmins([...admins, newAdminEmail]);
    }
    
    setNewAdminEmail('');
    setNewAdminPassword('');
    setIsNewAdminDialogOpen(false);
    
    toast({
      title: "Administrador adicionado",
      description: `${newAdminEmail} foi adicionado como administrador.`,
      duration: 3000,
    });
  };
  
  const removeAdmin = (email: string) => {
    const currentUserEmail = localStorage.getItem('admin-email');
    
    if (email === currentUserEmail) {
      toast({
        title: "Operação não permitida",
        description: "Você não pode remover seu próprio usuário.",
        variant: "destructive"
      });
      return;
    }
    
    const adminCredentials = JSON.parse(localStorage.getItem('admin-credentials') || '{}');
    delete adminCredentials[email];
    localStorage.setItem('admin-credentials', JSON.stringify(adminCredentials));
    
    setAdmins(admins.filter(admin => admin !== email));
    
    toast({
      title: "Administrador removido",
      description: `${email} foi removido com sucesso.`,
      duration: 3000,
    });
  };

  const dashboardItems = [
    {
      title: 'Campanhas de Marketing',
      description: `${marketingCampaigns.length} campanhas cadastradas`,
      icon: <Image className="w-10 h-10 text-[#A21C1C]" />,
      path: '/admin/marketing',
      count: marketingCampaigns.length
    },
    {
      title: 'Imagens da Equipe',
      description: `${teamMembers.length} imagens cadastradas`,
      icon: <Users className="w-10 h-10 text-[#A21C1C]" />,
      path: '/admin/team',
      count: teamMembers.length
    },
    {
      title: 'Depoimentos',
      description: `${testimonials.length} depoimentos cadastrados`,
      icon: <MessageSquare className="w-10 h-10 text-[#A21C1C]" />,
      path: '/admin/testimonials',
      count: testimonials.length
    },
    {
      title: 'Vídeos',
      description: `${videos.length} vídeos cadastrados`,
      icon: <Video className="w-10 h-10 text-[#A21C1C]" />,
      path: '/admin/videos',
      count: videos.length
    }
  ];

  return (
    <AdminGuard>
      <AdminLayout active="dashboard">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
          <p className="text-gray-500">Bem-vindo ao painel administrativo do Mais Delivery</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {dashboardItems.map((item, index) => (
            <Link to={item.path} key={index} className="transition-transform hover:scale-105">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex justify-between items-center">
                    {item.title}
                    {item.icon}
                  </CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-[#A21C1C]">{item.count}</div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ExternalLink size={20} className="text-[#A21C1C]" />
                Configuração do Formulário de Parceria
              </CardTitle>
              <CardDescription>
                Configure a URL do formulário ClickUp para onde os usuários serão redirecionados ao clicar em "Quero ser parceiro"
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="clickup-form-url" className="text-sm font-medium">
                  URL do formulário ClickUp
                </label>
                <Input
                  id="clickup-form-url"
                  type="url"
                  placeholder="https://forms.clickup.com/..."
                  value={clickUpFormUrl}
                  onChange={(e) => setClickUpFormUrl(e.target.value)}
                  className={!isValidUrl ? "border-red-500" : ""}
                />
                {!isValidUrl && (
                  <p className="text-red-500 text-sm">Por favor, insira uma URL válida</p>
                )}
              </div>
              
              {clickUpFormUrl && isValidUrl && (
                <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
                  <p className="text-sm font-medium mb-2">Prévia do redirecionamento:</p>
                  <div className="flex items-center gap-2 text-blue-600 hover:underline overflow-hidden">
                    <ExternalLink size={16} />
                    <a href={clickUpFormUrl} target="_blank" rel="noopener noreferrer" className="text-sm truncate">
                      {clickUpFormUrl}
                    </a>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                className={`bg-[#A21C1C] hover:bg-[#911616] ${(!hasChanged || !isValidUrl) ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={!hasChanged || !isValidUrl}
                onClick={handleSaveClickUpUrl}
              >
                Salvar URL
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="mt-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Administradores</CardTitle>
                <CardDescription>Gerencie os usuários administradores do sistema</CardDescription>
              </div>
              <Button 
                onClick={() => setIsNewAdminDialogOpen(true)}
                className="bg-[#A21C1C] hover:bg-[#911616]"
              >
                <UserPlus size={16} className="mr-2" />
                Novo Admin
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {admins.map(admin => (
                  <div key={admin} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                    <span>{admin}</span>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => removeAdmin(admin)}
                      disabled={admin === localStorage.getItem('admin-email')}
                    >
                      {admin === localStorage.getItem('admin-email') ? 'Usuário Atual' : 'Remover'}
                    </Button>
                  </div>
                ))}
                {admins.length === 0 && (
                  <p className="text-center text-gray-500 py-4">
                    Nenhum administrador cadastrado
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Instruções</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Use este painel administrativo para gerenciar as campanhas de marketing, imagens da equipe, depoimentos e vídeos exibidos no site.
              </p>
              <p className="text-gray-600 mt-4">
                Clique em uma das seções acima para começar a editar o conteúdo.
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Add New Admin Dialog */}
        <Dialog open={isNewAdminDialogOpen} onOpenChange={setIsNewAdminDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Novo Administrador</DialogTitle>
              <DialogDescription>
                Preencha os dados para cadastrar um novo administrador do sistema
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="admin-email">Email</Label>
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="email@exemplo.com"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-password">Senha</Label>
                <Input
                  id="admin-password"
                  type="password"
                  placeholder="******"
                  value={newAdminPassword}
                  onChange={(e) => setNewAdminPassword(e.target.value)}
                />
                <p className="text-xs text-gray-500">
                  A senha deve ter pelo menos 6 caracteres
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsNewAdminDialogOpen(false)}>
                Cancelar
              </Button>
              <Button 
                className="bg-[#A21C1C] hover:bg-[#911616]"
                onClick={handleAddNewAdmin}
              >
                Adicionar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </AdminLayout>
    </AdminGuard>
  );
};

export default AdminDashboard;
