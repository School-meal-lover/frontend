import { useState } from "react";
import { Link } from "@tanstack/react-router";

const navList = [
  { name: "학식 메뉴", link: "/" },
  { name: "락락 메뉴", link: "/menu/lacklack"},
  { name: "식당 혼잡도", link: "/menu/congestion" },
  { name: "Team 학사모", link: "/menu/congestion" },
];

export default function MobileHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selected, setSelected] = useState("학식 메뉴");

  return (
    <header className="w-full h-[50px] px-4 py-2 shadow relative flex items-center justify-between z-50 bg-white">
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
        className={`fixed top-[50px] left-0 right-0 bottom-0 bg-black transition-opacity duration-300 ${
          menuOpen ? "opacity-50" : "opacity-0 pointer-events-none"
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
            className={`w-full text-left px-6 py-3 my-1 font-bold rounded-xl text-lg cursor-pointer ${
              selected === nav.name
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
