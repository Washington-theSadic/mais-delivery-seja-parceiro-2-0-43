
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, ArrowLeft } from 'lucide-react';

interface AdminHeaderProps {
  adminEmail: string;
  hasUnsavedChanges: boolean;
  onLogout: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  adminEmail,
  hasUnsavedChanges,
  onLogout
}) => {
  const handleLogout = () => {
    if (hasUnsavedChanges) {
      if (window.confirm('Você tem alterações não salvas. Deseja realmente sair?')) {
        onLogout();
      }
    } else {
      onLogout();
    }
  };

  return (
    <header className="bg-[#1F2937] text-white px-6 py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <img src="/lovable-uploads/476b844f-a75b-468e-ba6a-1e7345b83181.png" alt="Mais Delivery Logo" className="h-8" />
          <h1 className="text-xl font-bold hidden sm:block">Painel Administrativo</h1>
        </div>
        <div className="flex items-center gap-4">
          {adminEmail && <span className="text-sm hidden md:block text-gray-300">{adminEmail}</span>}
          <Link to="/">
            <Button variant="outline" size="sm" className="border-white text-red-600 bg-red-400 hover:bg-red-300">
              <ArrowLeft size={16} className="mr-2" />
              Página Inicial
            </Button>
          </Link>
          <Button variant="outline" size="sm" onClick={handleLogout} className="border-white text-red-600 bg-red-400 hover:bg-red-300">
            <LogOut size={16} className="mr-2" />
            Sair
          </Button>
        </div>
      </div>
    </header>
  );
};
