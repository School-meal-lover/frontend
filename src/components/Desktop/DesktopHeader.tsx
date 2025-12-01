import { Link, useLocation } from "@tanstack/react-router";
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const DesktopHeader = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [selectedNav, setSelectedNav] = useState<string>(t('nav.menu'));

  const navList = [
    { link: '/', name: t('nav.menu') },
    { link: '/menu/lacklack', name: t('nav.lacklack') },
    { link: '/introduce', name: t('nav.team') }
  ];

  // Sync selectedNav with current route
  useEffect(() => {
    const currentNav = navList.find(nav => nav.link === location.pathname);
    if (currentNav) {
      setSelectedNav(currentNav.name);
    }
  }, [location.pathname]);

  return (
    <header className="w-full h-[55px] px-4 py-2 shadow flex items-center justify-between relative">
      <div className="flex flex-1 items-center">
        <Link to='/' onClick={() => setSelectedNav(t('nav.menu'))}>
          <img alt="꼬르륵 로고" src="../Frame 38.svg" />
        </Link>
        {navList.map((nav) => (
          <div key={nav.link} className={`flex flex-1 justify-evenly items-center font-bold text-[14px] lg:text-[18px]
        ${selectedNav === nav.name ? "text-orange-500" : ""}`}>
            <Link to={nav.link} className="hover:text-orange-500 transition" onClick={() => setSelectedNav(nav.name)}>
              {nav.name}
            </Link>
          </div>
        ))}
      </div>

      {/* Settings Icon */}
      <Link to="/settings" className="ml-4">
        <svg
          className="w-6 h-6 text-gray-700 hover:text-orange-500 transition-colors cursor-pointer"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </Link>
    </header>
  )
}

export default DesktopHeader;