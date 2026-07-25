'use client';

import { useState } from 'react';
import { LogOut, Menu, X } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { clearChatStorage } from '@/lib/chat-storage';

interface ClientHeaderProps {
  active: 'dashboard' | 'settings';
}

export function ClientHeader({ active }: ClientHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    clearChatStorage();
    await signOut({ redirect: true, callbackUrl: '/login' });
  };

  const navLinkClass = (key: 'dashboard' | 'settings') =>
    key === active
      ? 'text-blue-600 font-medium'
      : 'text-gray-600 hover:text-gray-900 transition';

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              YourAgencyToday
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <nav className="flex gap-6">
              <a href="/chat" className="text-gray-600 hover:text-gray-900 transition">
                Chat
              </a>
              <a href="/client/dashboard" className={navLinkClass('dashboard')}>
                Mis solicitudes
              </a>
              <a href="/client/settings" className={navLinkClass('settings')}>
                Ajustes
              </a>
            </nav>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
            >
              <LogOut className="h-5 w-5" />
              Cerrar sesión
            </button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 space-y-4">
            <a href="/chat" className="block text-gray-600 hover:text-gray-900">
              Chat
            </a>
            <a href="/client/dashboard" className={`block ${navLinkClass('dashboard')}`}>
              Mis solicitudes
            </a>
            <a href="/client/settings" className={`block ${navLinkClass('settings')}`}>
              Ajustes
            </a>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
            >
              <LogOut className="h-5 w-5" />
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
