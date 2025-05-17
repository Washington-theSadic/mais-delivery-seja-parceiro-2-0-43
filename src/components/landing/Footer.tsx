
import React from 'react';

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <img 
              src="/lovable-uploads/476b844f-a75b-468e-ba6a-1e7345b83181.png" 
              alt="Mais Delivery Logo" 
              className="h-8 mb-2"
            />
            <p className="text-sm text-gray-400">
              © 2025 Mais Delivery. Todos os direitos reservados.
            </p>
          </div>
          
          <nav className="flex flex-wrap gap-4">
            <a href="#beneficios" className="text-gray-300 hover:text-white transition-colors">
              Benefícios
            </a>
            <a href="#como-funciona" className="text-gray-300 hover:text-white transition-colors">
              Como Funciona
            </a>
            <a href="#depoimentos" className="text-gray-300 hover:text-white transition-colors">
              Depoimentos
            </a>
            <a href="#precos" className="text-gray-300 hover:text-white transition-colors">
              Preços
            </a>
            <a href="#cta" className="text-gray-300 hover:text-white transition-colors">
              Contato
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
};
