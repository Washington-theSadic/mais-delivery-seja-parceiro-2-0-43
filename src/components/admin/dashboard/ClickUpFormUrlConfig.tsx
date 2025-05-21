
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Save, Link, Check } from 'lucide-react';

export const ClickUpFormUrlConfig = () => {
  const defaultUrl = "https://forms.clickup.com/9007116077/f/8cdvbtd-1933/04EZ2JLNT1SGLXPAF2?Nome%20da%20tarefa=Estabelecimento%20Interessado";
  const [formUrl, setFormUrl] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    // Carregar URL salva ou usar a padrão
    const savedUrl = localStorage.getItem('clickup-form-url');
    setFormUrl(savedUrl || defaultUrl);
  }, []);
  
  const handleSaveUrl = () => {
    if (!formUrl.trim()) {
      toast({
        title: "URL inválida",
        description: "Por favor, insira uma URL válida",
        variant: "destructive"
      });
      return;
    }
    
    // Validação básica de URL
    if (!formUrl.match(/^(http|https):\/\/[^ "]+/)) {
      toast({
        title: "URL inválida",
        description: "Por favor, insira uma URL válida iniciando com http:// ou https://",
        variant: "destructive"
      });
      return;
    }
    
    // Salvar no localStorage para que o site principal possa acessar
    localStorage.setItem('clickup-form-url', formUrl);
    
    // Disparar evento de storage para notificar outras abas/componentes
    window.dispatchEvent(new Event('storage'));
    
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
    
    toast({
      title: "URL salva com sucesso",
      description: "O formulário do ClickUp foi atualizado.",
    });
  };
  
  const handleResetDefault = () => {
    setFormUrl(defaultUrl);
    localStorage.setItem('clickup-form-url', defaultUrl);
    window.dispatchEvent(new Event('storage'));
    
    toast({
      title: "URL restaurada",
      description: "A URL padrão foi restaurada.",
    });
  };
  
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Link className="mr-2 text-[#A21C1C]" />
          Configuração do Formulário ClickUp
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">
              URL do Formulário ClickUp (Botão "Quero ser parceiro")
            </label>
            <div className="flex gap-2 mt-1">
              <Input 
                type="url" 
                value={formUrl} 
                onChange={(e) => setFormUrl(e.target.value)}
                placeholder="https://forms.clickup.com/..."
                className="flex-1"
              />
              <Button 
                onClick={handleSaveUrl}
                className="bg-[#A21C1C] hover:bg-[#911616] text-white flex items-center"
              >
                {isSaved ? <Check size={16} className="mr-2" /> : <Save size={16} className="mr-2" />}
                {isSaved ? "Salvo!" : "Salvar"}
              </Button>
            </div>
          </div>
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              <p>Esta URL é usada no botão "Quero ser parceiro" na página inicial.</p>
            </div>
            <Button 
              variant="outline" 
              onClick={handleResetDefault}
            >
              Restaurar padrão
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
