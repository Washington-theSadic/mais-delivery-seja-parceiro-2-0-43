
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";

export const CallToAction = () => {
  const [isPulsing, setIsPulsing] = useState(false);
  // URL direta do ClickUp Form
  const clickUpFormUrl = "https://forms.clickup.com/9007116077/f/8cdvbtd-1933/04EZ2JLNT1SGLXPAF2?Nome%20da%20tarefa=Estabelecimento%20Interessado";
  
  useEffect(() => {
    const interval = setInterval(() => {
      setIsPulsing(true);
      const timeout = setTimeout(() => {
        setIsPulsing(false);
      }, 1500);
      return () => clearTimeout(timeout);
    }, 3000);
    
    // Armazenar a URL no localStorage para manter compatibilidade com o código existente
    localStorage.setItem('clickup-form-url', clickUpFormUrl);
    
    return () => {
      clearInterval(interval);
    };
  }, [clickUpFormUrl]);
  
  const handlePartnerClick = () => {
    window.open(clickUpFormUrl, '_blank');
  };

  return <section id="cta" className="py-16 px-4 bg-gray-50 relative z-10">
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-[#1F2937] animate-pulse">
          Quer crescer com a gente?
        </h2>
        
        <p className="text-lg md:text-xl mb-8 text-[#1F2937]">
          Cadastre seu negócio agora e comece a vender mais
        </p>
        
        <Button 
          size="lg" 
          className={`text-lg bg-[#A21C1C] hover:bg-[#911616] shadow-lg hover:shadow-xl transition-all duration-300 ${isPulsing ? 'animate-pulse scale-105' : 'scale-100'}`}
          onClick={handlePartnerClick}
        >
          Quero ser parceiro
        </Button>
      </div>
    </section>;
};
