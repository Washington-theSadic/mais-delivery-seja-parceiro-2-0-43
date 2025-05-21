
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminHeader } from './navigation/AdminHeader';
import { AdminSidebar } from './navigation/AdminSidebar';
import { UnsavedChangesProvider } from '@/context/UnsavedChangesContext';

interface AdminLayoutProps {
  children: React.ReactNode;
  active: 'dashboard' | 'marketing' | 'team' | 'testimonials' | 'videos';
  // Removed: setUnsavedChanges?: (value: boolean) => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  active,
  // Removed: setUnsavedChanges
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
            {/* Removed React.cloneElement logic, render children directly */}
            {children}
          </main>
        </div>
      </div>
    </UnsavedChangesProvider>
  );
};

