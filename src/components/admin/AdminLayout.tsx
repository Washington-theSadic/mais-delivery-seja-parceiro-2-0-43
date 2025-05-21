
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminHeader } from './navigation/AdminHeader';
import { AdminSidebar } from './navigation/AdminSidebar';

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
    localStorage.removeItem('admin-auth');
    localStorage.removeItem('admin-email');
    navigate('/admin');
  };

  // Update unsaved changes state and call parent's setUnsavedChanges if available
  const updateUnsavedChanges = (value: boolean) => {
    setHasUnsavedChangesState(value);
    if (setUnsavedChanges) {
      setUnsavedChanges(value);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <AdminHeader 
        adminEmail={adminEmail}
        hasUnsavedChanges={hasUnsavedChanges}
        onLogout={handleLogout}
      />
      
      <div className="flex flex-1">
        <AdminSidebar 
          active={active}
          hasUnsavedChanges={hasUnsavedChanges}
        />
        
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
    </div>
  );
};
