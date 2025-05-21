
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminHeader } from './navigation/AdminHeader';
import { AdminSidebar } from './navigation/AdminSidebar';
import { UnsavedChangesProvider } from '@/context/UnsavedChangesContext';

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
  
  useEffect(() => {
    const email = localStorage.getItem('admin-email');
    if (email) {
      setAdminEmail(email);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin-auth');
    localStorage.removeItem('admin-email');
    navigate('/admin');
  };

  return (
    <UnsavedChangesProvider>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <AdminHeader 
          adminEmail={adminEmail}
          onLogout={handleLogout}
        />
        
        <div className="flex flex-1">
          <AdminSidebar 
            active={active}
          />
          
          <main className="flex-1 p-6">
            {/* Pass the setUnsavedChanges function to children via React clone */}
            {React.Children.map(children, child => {
              if (React.isValidElement(child)) {
                return React.cloneElement(child, {
                  setUnsavedChanges
                } as any);
              }
              return child;
            })}
          </main>
        </div>
      </div>
    </UnsavedChangesProvider>
  );
};
