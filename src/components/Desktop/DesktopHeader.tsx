import { Link, useLocation } from "@tanstack/react-router";
import { useState, useEffect } from 'react';

const DesktopHeader = () => {
  const location = useLocation();
  const [selectedNav, setSelectedNav] = useState<string>("학식 메뉴");

  const navList = [
    { link: '/', name: "학식 메뉴" },
    { link: '/menu/lacklack', name: "락락 메뉴" },
    { link: '/introduce', name: "Team 학사모" }
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
      <div className="flex flex-1">
        <Link to='/' onClick={() => setSelectedNav("학식 메뉴")}>
          <img alt="꼬르륵 로고" src="../Frame 38.svg" />
        </Link>
        {navList.map((nav) => (
          <div className={`flex flex-1 justify-evenly items-center font-bold text-[14px] lg:text-[18px]
        ${selectedNav === nav.name ? "text-orange-500" : ""}`}>
            <Link to={nav.link} className="hover:text-orange-500 transition" onClick={() => setSelectedNav(nav.name)}>
              {nav.name}
            </Link>
          </div>
        ))}
      </div>
    </header>
  )
}

export default DesktopHeader;