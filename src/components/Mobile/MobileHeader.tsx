import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export default function MobileHeader() {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [selected, setSelected] = useState(t('nav.menu'));

  const navList = [
    { name: t('nav.menu'), link: "/" },
    { name: t('nav.lacklack'), link: "/menu/lacklack" },
    { name: t('nav.team'), link: "/introduce" },
    { name: t('nav.settings'), link: "/settings" },
  ];

  // 모달이 열렸을 때 배경 스크롤 방지
  useEffect(() => {
    if (menuOpen) {
      // 현재 스크롤 위치 저장
      const scrollY = window.scrollY;
      // body 스크롤 방지
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
    } else {
      // 스크롤 복원
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY) * -1);
      }
    }

    // 컴포넌트 언마운트 시 스타일 초기화 및 스크롤 복원
    return () => {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY) * -1);
      }
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 w-full h-[55px] px-4 py-2 shadow relative flex items-center justify-between z-50 bg-white">
      {/* 상단 navigation bar */}
      <div className="flex items-center">
        <Link to="/">
          <img
            src="/Frame 38.svg"
            alt="로고"
            onClick={() => setSelected(t('nav.menu'))}
            className="h-6"
          />
        </Link>
      </div>
      <div className="flex items-center gap-4">
        {/* Settings Icon */}
        <Link to="/settings">
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

        {/* Hamburger Menu */}
        <img
          src="/Hamburger.svg"
          alt="햄버거 nav"
          onClick={() => setMenuOpen(!menuOpen)}
          className="hover:cursor-pointer h-6"
        />
      </div>

      {/* 배경 오버레이 */}
      <div
        onClick={() => setMenuOpen(false)}
        className={`fixed top-[50px] left-0 right-0 bottom-0 bg-black transition-opacity duration-300 ${menuOpen ? "opacity-50" : "opacity-0 pointer-events-none"
          }`}
      />

      {/* 슬라이드 메뉴 */}
      <nav
        className={`fixed top-[50px] left-0 w-full bg-white px-8 py-5 flex flex-col items-start shadow-lg transform transition-all duration-300 ease-in-out z-50
        ${menuOpen ? "translate-y-0 opacity-100" : "-translate-y-5 opacity-0 pointer-events-none"}
        `}
      >
        {navList.map((nav) => (
          <Link
            key={nav.name}
            to={nav.link}
            onClick={() => {
              setSelected(nav.name);
              setMenuOpen(false);
            }}
            className={`w-full text-left px-6 py-3 my-1 font-bold rounded-xl text-lg cursor-pointer ${selected === nav.name
              ? "bg-[#FF8940] text-white"
              : "text-black hover:bg-[#FF8940] hover:text-white transition duration-300"
              }`}
          >
            {nav.name}
          </Link>
        ))}
      </nav>
    </header>
  );
}
