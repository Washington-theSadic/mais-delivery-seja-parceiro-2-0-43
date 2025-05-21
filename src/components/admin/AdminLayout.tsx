import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, Image, Users, MessageSquare, Video, ArrowLeft, Home } from 'lucide-react';
interface AdminLayoutProps {
  children: React.ReactNode;
  active: 'dashboard' | 'marketing' | 'team' | 'testimonials' | 'videos';
  setUnsavedChanges?: (value: boolean) => void;
}
export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  active,
  setUnsavedChanges
}) => {
  const navigate = useNavigate();
  const [adminEmail, setAdminEmail] = useState<string>('');
  const [hasUnsavedChanges, setHasUnsavedChangesState] = useState<boolean>(false);
  useEffect(() => {
    const email = localStorage.getItem('admin-email');
    if (email) {
      setAdminEmail(email);
    }

    // Handle beforeunload event to prevent accidental navigation when there are unsaved changes
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);
  const handleLogout = () => {
    if (hasUnsavedChanges) {
      if (window.confirm('Você tem alterações não salvas. Deseja realmente sair?')) {
        localStorage.removeItem('admin-auth');
        localStorage.removeItem('admin-email');
        navigate('/admin');
      }
    } else {
      localStorage.removeItem('admin-auth');
      localStorage.removeItem('admin-email');
      navigate('/admin');
    }
  };

  // Update unsaved changes state and call parent's setUnsavedChanges if available
  const updateUnsavedChanges = (value: boolean) => {
    setHasUnsavedChangesState(value);
    if (setUnsavedChanges) {
      setUnsavedChanges(value);
    }
  };
  const menuItems = [{
    id: 'dashboard',
    label: 'Dashboard',
    icon: <Home size={18} />,
    path: '/admin/dashboard'
  }, {
    id: 'marketing',
    label: 'Campanhas',
    icon: <Image size={18} />,
    path: '/admin/marketing'
  }, {
    id: 'team',
    label: 'Equipe',
    icon: <Users size={18} />,
    path: '/admin/team'
  }, {
    id: 'testimonials',
    label: 'Depoimentos',
    icon: <MessageSquare size={18} />,
    path: '/admin/testimonials'
  }, {
    id: 'videos',
    label: 'Vídeos',
    icon: <Video size={18} />,
    path: '/admin/videos'
  }];
  return <div className="min-h-screen bg-gray-100 flex flex-col">
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
      
      <div className="flex flex-1">
        <aside className="w-16 sm:w-64 bg-white shadow-md">
          <nav className="p-4">
            <ul className="space-y-2">
              {menuItems.map(item => <li key={item.id}>
                  <Button variant={active === item.id ? "default" : "ghost"} className={`w-full justify-start ${active === item.id ? 'bg-[#A21C1C] text-white hover:bg-[#911616]' : 'text-gray-600'}`} onClick={() => {
                if (hasUnsavedChanges) {
                  if (window.confirm('Você tem alterações não salvas. Deseja realmente sair desta página?')) {
                    navigate(item.path);
                  }
                } else {
                  navigate(item.path);
                }
              }}>
                    <span className="mr-2">{item.icon}</span>
                    <span className="hidden sm:inline">{item.label}</span>
                  </Button>
                </li>)}
            </ul>
          </nav>
        </aside>
        
        <main className="flex-1 p-6">
          {/* Pass the updateUnsavedChanges function to children via React clone */}
          {React.Children.map(children, child => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              setUnsavedChanges: updateUnsavedChanges
            } as any);
          }
          return child;
        })}
        </main>
      </div>
    </div>;
};
