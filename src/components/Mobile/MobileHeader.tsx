import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";

const navList = [
  { name: "학식 메뉴", link: "/" },
  { name: "락락 메뉴", link: "/menu/lacklack" },
  { name: "Team 학사모", link: "/menu/introduce" },
];

export default function MobileHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selected, setSelected] = useState("학식 메뉴");

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
            onClick={() => setSelected("학식 메뉴")}
            className="h-6"
          />
        </Link>
      </div>
      <div className="flex items-center">
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
