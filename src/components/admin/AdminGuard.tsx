import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface AdminGuardProps {
  children: React.ReactNode;
}

export const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('admin-auth') === 'true';
    
    if (!isAuthenticated) {
      navigate('/admin');
    }
  }, [navigate]);
  
  // Context no longer provides setUnsavedChanges
  // If AdminGuardContext is solely for setUnsavedChanges, it could be removed.
  // For now, we'll keep the context structure but remove setUnsavedChanges from it.
  // If useAdminGuard() is not used elsewhere for other purposes, it might become unused.
  const contextValue = {
    // Removed: setUnsavedChanges: setUnsavedChanges || (() => {}),
  };
  
  return (
    // If contextValue is empty, Provider might not be needed or can pass an empty object.
    // For minimal changes, let's keep the Provider but its value is now effectively {}.
    <AdminGuardContext.Provider value={contextValue as any}> {/* Cast to any if contextValue is empty and type expects properties */}
      {children}
    </AdminGuardContext.Provider>
  );
};

// AdminGuardContext no longer includes setUnsavedChanges
// If nothing else is in this context, it could be simplified to React.createContext({}).
// For now, let's make it an empty object type if nothing else is there.
export const AdminGuardContext = React.createContext<{
  // Removed: setUnsavedChanges: (value: boolean) => void;
}>({}); // Default value is an empty object

// Custom hook to use the admin guard context
// Will now return an empty object (or whatever AdminGuardContext holds)
export const useAdminGuard = () => {
  return React.useContext(AdminGuardContext);
};
