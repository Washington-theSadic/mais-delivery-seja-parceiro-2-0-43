
import React, { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminGuard } from '@/components/admin/AdminGuard';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ImageUploader } from '@/components/admin/ImageUploader';
import { useAdmin } from '@/context/AdminContext';
import { Trash2, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const TeamImages = () => {
  const { teamMembers, updateTeamMembers, isLoading } = useAdmin();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  
  const handleAddImage = async (imageUrl: string) => {
    try {
      setIsSaving(true);
      const newMember = {
        id: `team-${Date.now()}`,
        imageUrl
      };
      
      await updateTeamMembers([...teamMembers, newMember]);
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error('Erro ao adicionar imagem:', error);
      toast({
        title: "Erro ao adicionar imagem",
        description: "Ocorreu um erro ao adicionar a imagem da equipe.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const confirmDelete = (id: string) => {
    setMemberToDelete(id);
    setIsDeleteDialogOpen(true);
  };
  
  const handleDelete = async () => {
    if (!memberToDelete) return;
    
    try {
      setIsSaving(true);
      const updatedMembers = teamMembers.filter(
        member => member.id !== memberToDelete
      );
      
      await updateTeamMembers(updatedMembers);
      setIsDeleteDialogOpen(false);
      setMemberToDelete(null);
    } catch (error) {
      console.error('Erro ao excluir imagem:', error);
      toast({
        title: "Erro ao excluir imagem",
        description: "Ocorreu um erro ao excluir a imagem da equipe.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <AdminGuard>
        <AdminLayout active="team">
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-12 h-12 text-[#A21C1C] animate-spin mb-4" />
            <p className="text-gray-500">Carregando imagens da equipe...</p>
          </div>
        </AdminLayout>
      </AdminGuard>
    );
  }

  return (
    <AdminGuard>
      <AdminLayout active="team">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Imagens da Equipe</h1>
            <p className="text-gray-500">Gerencie as imagens da equipe exibidas no site</p>
          </div>
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-[#A21C1C] hover:bg-[#911616] text-white"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processando...
              </>
            ) : "Adicionar Imagem"}
          </Button>
        </div>
        
        {teamMembers.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <p className="text-gray-500 mb-4">Nenhuma imagem da equipe cadastrada</p>
              <Button 
                onClick={() => setIsAddDialogOpen(true)}
                className="bg-[#A21C1C] hover:bg-[#911616] text-white"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : "Adicionar Imagem"}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {teamMembers.map((member) => (
              <Card key={member.id}>
                <CardHeader className="p-0">
                  <div className="relative aspect-video overflow-hidden rounded-t-lg">
                    <img 
                      src={member.imageUrl} 
                      alt="Imagem da Equipe" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                </CardHeader>
                <CardFooter className="p-4 flex justify-end">
                  <Button 
                    variant="destructive"
                    size="sm"
                    onClick={() => confirmDelete(member.id)}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <>
                        <Trash2 size={16} className="mr-2" />
                        Excluir
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
        
        {/* Add Team Image Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Imagem da Equipe</DialogTitle>
              <DialogDescription>
                Adicione uma imagem via URL
              </DialogDescription>
            </DialogHeader>
            <ImageUploader 
              onImageSelected={handleAddImage} 
              buttonText={isSaving ? "Adicionando..." : "Adicionar Imagem"}
              disabled={isSaving}
            />
          </DialogContent>
        </Dialog>
        
        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar Exclusão</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja excluir esta imagem? Esta ação não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsDeleteDialogOpen(false)}
                disabled={isSaving}
              >
                Cancelar
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDelete}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Excluindo...
                  </>
                ) : "Excluir"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </AdminLayout>
    </AdminGuard>
  );
};

export default TeamImages;
