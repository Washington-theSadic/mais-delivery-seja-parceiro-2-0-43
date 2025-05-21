
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { adminMenuItems, AdminMenuItem } from './AdminMenuItems';
import { useUnsavedChanges } from '@/context/UnsavedChangesContext';

interface AdminSidebarProps {
  active: string;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  active
}) => {
  const navigate = useNavigate();
  const { hasUnsavedChanges } = useUnsavedChanges();

  const handleMenuItemClick = (item: AdminMenuItem) => {
    if (hasUnsavedChanges) {
      if (window.confirm('Você tem alterações não salvas. Deseja realmente sair desta página?')) {
        navigate(item.path);
      }
    } else {
      navigate(item.path);
    }
  };

  return (
    <aside className="w-16 sm:w-64 bg-white shadow-md">
      <nav className="p-4">
        <ul className="space-y-2">
          {adminMenuItems.map(item => (
            <li key={item.id}>
              <Button 
                variant={active === item.id ? "default" : "ghost"} 
                className={`w-full justify-start ${active === item.id ? 'bg-[#A21C1C] text-white hover:bg-[#911616]' : 'text-gray-600'}`} 
                onClick={() => handleMenuItemClick(item)}
              >
                <span className="mr-2">{item.icon}</span>
                <span className="hidden sm:inline">{item.label}</span>
              </Button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};
