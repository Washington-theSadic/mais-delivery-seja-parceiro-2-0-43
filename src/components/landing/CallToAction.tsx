
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";

export const CallToAction = () => {
  const [isPulsing, setIsPulsing] = useState(false);
  // Get the ClickUp form URL from localStorage (set in AdminDashboard)
  const [clickUpFormUrl, setClickUpFormUrl] = useState<string>('');
  
  useEffect(() => {
    const interval = setInterval(() => {
      setIsPulsing(true);
      const timeout = setTimeout(() => {
        setIsPulsing(false);
      }, 1500);
      return () => clearTimeout(timeout);
    }, 3000);
    
    // Get the ClickUp form URL from localStorage and set up a listener to update it if it changes
    const updateClickUpUrl = () => {
      const savedUrl = localStorage.getItem('clickup-form-url');
      if (savedUrl) {
        setClickUpFormUrl(savedUrl);
      }
    };
    
    // Initial load
    updateClickUpUrl();
    
    // Listen for storage changes (in case admin updates the URL in another tab)
    window.addEventListener('storage', updateClickUpUrl);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', updateClickUpUrl);
    };
  }, []);
  
  const handlePartnerClick = () => {
    if (clickUpFormUrl) {
      window.open(clickUpFormUrl, '_blank');
    } else {
      // Fallback in case no URL is set - simply do nothing or console log
      console.log("Nenhuma URL de formulário ClickUp configurada");
    }
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
