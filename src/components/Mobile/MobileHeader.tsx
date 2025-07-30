import { Link } from "@tanstack/react-router";
import {useState} from 'react';

const MobileHeader = () => {
  const [selectedNav, setSelectedNav] = useState<string>("학식 메뉴");

  const navList = [
    {link : '/', name: "학식 메뉴"},
    {link : '/menu/lacklack', name: "락락 메뉴"},
    {link : '/menu/congestion', name: "혼잡도"},
    {link : '/menu/congestion', name: "Team 학사모"}
];

  return(
    <>
    </>
  )
}

export default MobileHeader;