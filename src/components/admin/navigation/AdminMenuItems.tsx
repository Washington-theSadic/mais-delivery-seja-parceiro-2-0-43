
import React from 'react';
import { Home, Image, Users, MessageSquare, Video } from 'lucide-react';

export interface AdminMenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

export const adminMenuItems: AdminMenuItem[] = [{
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
