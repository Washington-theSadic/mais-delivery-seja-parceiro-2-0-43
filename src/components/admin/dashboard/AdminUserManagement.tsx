
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { UserPlus } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const AdminUserManagement = () => {
  const [isNewAdminDialogOpen, setIsNewAdminDialogOpen] = useState<boolean>(false);
  const [newAdminEmail, setNewAdminEmail] = useState<string>('');
  const [newAdminPassword, setNewAdminPassword] = useState<string>('');
  const [admins, setAdmins] = useState<string[]>(() => {
    const savedAdmins = localStorage.getItem('admin-users');
    if (savedAdmins) return JSON.parse(savedAdmins);
    
    const currentEmail = localStorage.getItem('admin-email') || '';
    return currentEmail ? [currentEmail] : [];
  });
  const { toast } = useToast();

  useEffect(() => {
    // Save admins to localStorage
    localStorage.setItem('admin-users', JSON.stringify(admins));
  }, [admins]);

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

  return (
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
    </div>
  );
};
