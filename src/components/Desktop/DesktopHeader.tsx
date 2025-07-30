import { Link } from "@tanstack/react-router";
import {useState} from 'react';

const DesktopHeader = () => {
  const [selectedNav, setSelectedNav] = useState<string>("학식 메뉴");

  const navList = [
    {link : '/', name: "학식 메뉴"},
    {link : '/menu/lacklack', name: "락락 메뉴"},
    {link : '/menu/congestion', name: "식당 혼잡도"},
    {link : '/menu/congestion', name: "Team 학사모"}
];

  return(
  <header className="w-full h-[50px] px-4 py-2 shadow flex items-center justify-between relative">
    <div className="flex flex-1">
      <img alt="꼬르륵 로고" src="../Frame 38.svg" />
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