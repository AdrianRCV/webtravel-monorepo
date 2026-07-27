'use client';

import { useState } from 'react';
import { LogOut, Menu, X } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useTranslations, useLocale } from 'next-intl';
import { Link as LocaleLink, getPathname } from '@/i18n/navigation';
import { clearChatStorage } from '@/lib/chat-storage';

interface ClientHeaderProps {
  active: 'dashboard' | 'settings';
}

export function ClientHeader({ active }: ClientHeaderProps) {
  const t = useTranslations('Client.Header');
  const locale = useLocale();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    clearChatStorage();
    await signOut({ redirect: true, callbackUrl: getPathname({ href: '/login', locale }) });
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
              <LocaleLink href="/chat" className="text-gray-600 hover:text-gray-900 transition">
                {t('chatLink')}
              </LocaleLink>
              <LocaleLink href="/client/dashboard" className={navLinkClass('dashboard')}>
                {t('dashboardLink')}
              </LocaleLink>
              <LocaleLink href="/client/settings" className={navLinkClass('settings')}>
                {t('settingsLink')}
              </LocaleLink>
            </nav>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
            >
              <LogOut className="h-5 w-5" />
              {t('logout')}
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
            <LocaleLink href="/chat" className="block text-gray-600 hover:text-gray-900">
              {t('chatLink')}
            </LocaleLink>
            <LocaleLink href="/client/dashboard" className={`block ${navLinkClass('dashboard')}`}>
              {t('dashboardLink')}
            </LocaleLink>
            <LocaleLink href="/client/settings" className={`block ${navLinkClass('settings')}`}>
              {t('settingsLink')}
            </LocaleLink>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
            >
              <LogOut className="h-5 w-5" />
              {t('logout')}
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
