
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ExternalLink } from 'lucide-react';

interface ClickUpFormUrlConfigProps {
  setUnsavedChanges: (value: boolean) => void;
}

export const ClickUpFormUrlConfig: React.FC<ClickUpFormUrlConfigProps> = ({ setUnsavedChanges }) => {
  const [clickUpFormUrl, setClickUpFormUrl] = useState<string>('');
  const [hasChanged, setHasChanged] = useState<boolean>(false);
  const [isValidUrl, setIsValidUrl] = useState<boolean>(true);
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

  return (
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
  );
};
