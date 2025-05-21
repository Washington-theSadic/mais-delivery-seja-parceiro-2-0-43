
import React, { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminGuard } from '@/components/admin/AdminGuard';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAdmin } from '@/context/AdminContext';
import { Edit, Trash2, Video, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const videoSchema = z.object({
  title: z.string().min(2, { message: "O título deve ter pelo menos 2 caracteres" }),
  url: z.string().url({ message: "Por favor insira uma URL válida" }),
});

type VideoFormValues = z.infer<typeof videoSchema>;

const VideoLinks = () => {
  const { videos, updateVideos, isLoading } = useAdmin();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<VideoFormValues>({
    resolver: zodResolver(videoSchema),
    defaultValues: {
      title: "",
      url: "",
    }
  });
  
  const openAddDialog = () => {
    form.reset({
      title: "",
      url: "",
    });
    setCurrentVideo(null);
    setIsAddDialogOpen(true);
  };
  
  const openEditDialog = (video: any) => {
    form.reset({
      title: video.title,
      url: video.url,
    });
    setCurrentVideo(video.id);
    setIsEditDialogOpen(true);
  };
  
  const confirmDelete = (id: string) => {
    setCurrentVideo(id);
    setIsDeleteDialogOpen(true);
  };
  
  const onSubmitAdd = async (data: VideoFormValues) => {
    try {
      setIsSaving(true);
      const newVideo = {
        id: `video-${Date.now()}`,
        title: data.title,
        url: data.url
      };
      
      await updateVideos([...videos, newVideo]);
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error('Erro ao adicionar vídeo:', error);
      toast({
        title: "Erro ao adicionar vídeo",
        description: "Ocorreu um erro ao adicionar o vídeo.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const onSubmitEdit = async (data: VideoFormValues) => {
    if (!currentVideo) return;
    
    try {
      setIsSaving(true);
      const updatedVideos = videos.map(video => 
        video.id === currentVideo 
          ? { 
              ...video,
              title: data.title,
              url: data.url 
            }
          : video
      );
      
      await updateVideos(updatedVideos);
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Erro ao atualizar vídeo:', error);
      toast({
        title: "Erro ao atualizar vídeo",
        description: "Ocorreu um erro ao atualizar o vídeo.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleDelete = async () => {
    if (!currentVideo) return;
    
    try {
      setIsSaving(true);
      const updatedVideos = videos.filter(
        video => video.id !== currentVideo
      );
      
      await updateVideos(updatedVideos);
      setIsDeleteDialogOpen(false);
      setCurrentVideo(null);
    } catch (error) {
      console.error('Erro ao excluir vídeo:', error);
      toast({
        title: "Erro ao excluir vídeo",
        description: "Ocorreu um erro ao excluir o vídeo.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <AdminGuard>
        <AdminLayout active="videos">
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-12 h-12 text-[#A21C1C] animate-spin mb-4" />
            <p className="text-gray-500">Carregando vídeos...</p>
          </div>
        </AdminLayout>
      </AdminGuard>
    );
  }

  return (
    <AdminGuard>
      <AdminLayout active="videos">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Links de Vídeos</h1>
            <p className="text-gray-500">Gerencie os vídeos exibidos no site</p>
          </div>
          <Button 
            onClick={openAddDialog}
            className="bg-[#A21C1C] hover:bg-[#911616]"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processando...
              </>
            ) : "Adicionar Vídeo"}
          </Button>
        </div>
        
        {videos.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <p className="text-gray-500 mb-4">Nenhum vídeo cadastrado</p>
              <Button 
                onClick={openAddDialog}
                className="bg-[#A21C1C] hover:bg-[#911616]"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : "Adicionar Vídeo"}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {videos.map((video) => (
              <Card key={video.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Video className="h-5 w-5 text-[#A21C1C]" />
                    {video.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm text-gray-500 break-all">{video.url}</p>
                </CardContent>
                <CardFooter className="pt-2 flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => openEditDialog(video)}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <>
                        <Edit size={16} className="mr-2" />
                        Editar
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => confirmDelete(video.id)}
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
        
        {/* Add Video Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Novo Vídeo</DialogTitle>
              <DialogDescription>
                Adicione as informações do vídeo
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmitAdd)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título do Vídeo</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o título do vídeo..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL do Vídeo</FormLabel>
                      <FormControl>
                        <Input placeholder="https://youtube.com/..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsAddDialogOpen(false)}
                    disabled={isSaving}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-[#A21C1C] hover:bg-[#911616]"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Adicionando...
                      </>
                    ) : "Adicionar Vídeo"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        
        {/* Edit Video Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Vídeo</DialogTitle>
              <DialogDescription>
                Atualize as informações do vídeo
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmitEdit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título do Vídeo</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o título do vídeo..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL do Vídeo</FormLabel>
                      <FormControl>
                        <Input placeholder="https://youtube.com/..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsEditDialogOpen(false)}
                    disabled={isSaving}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-[#A21C1C] hover:bg-[#911616]"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Salvando...
                      </>
                    ) : "Salvar Alterações"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        
        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar Exclusão</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja excluir este vídeo? Esta ação não pode ser desfeita.
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

export default VideoLinks;
