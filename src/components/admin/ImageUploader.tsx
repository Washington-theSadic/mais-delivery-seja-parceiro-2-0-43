
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Link } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelected: (imageUrl: string) => void;
  buttonText?: string;
  disabled?: boolean;  // Adicionado o parâmetro disabled
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onImageSelected, 
  buttonText = "Adicionar Imagem",
  disabled = false
}) => {
  const [imageUrl, setImageUrl] = useState('');
  const { toast } = useToast();
  
  const handleUrlSubmit = () => {
    if (!imageUrl.trim()) {
      toast({
        title: "URL inválida",
        description: "Por favor, insira uma URL válida",
        variant: "destructive"
      });
      return;
    }
    
    // Simple URL validation (melhorada)
    if (!imageUrl.match(/^(http|https):\/\/[^ "]+(\.[a-z]{2,}|\d+)([^\s"]*)?$/i)) {
      toast({
        title: "URL inválida",
        description: "Por favor, insira uma URL válida iniciando com http:// ou https://",
        variant: "destructive"
      });
      return;
    }
    
    onImageSelected(imageUrl);
    setImageUrl('');
    
    toast({
      title: "Imagem adicionada",
      description: "A imagem foi adicionada com sucesso!",
    });
  };
  
  return (
    <div className="space-y-4">
      <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          URL da imagem
        </label>
        <div className="flex space-x-2">
          <Input
            type="url"
            placeholder="https://exemplo.com/imagem.jpg"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="flex-1"
            disabled={disabled}
          />
          <Button 
            onClick={handleUrlSubmit}
            className="bg-[#A21C1C] hover:bg-[#911616] text-white"
            disabled={disabled}
          >
            <Link size={16} className="mr-2" />
            {buttonText}
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2">Insira a URL completa da imagem que deseja adicionar (Imgur, ImgBB, etc)</p>
      </div>
    </div>
  );
};
