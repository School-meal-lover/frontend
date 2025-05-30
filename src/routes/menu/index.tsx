import { createFileRoute, Link } from "@tanstack/react-router";
import {useState} from "react";

export const Route = createFileRoute("/menu/")({
  component: RouteComponent,
});

function Header() {
  return (
    <header className="w-full h-[50px] px-4 py-2 shadow flex items-center justify-between">
      <div className="mx-6 flex flex-grow">
        <img src="../Frame 38.svg" />
        <nav className="flex flex-1 items-center justify-evenly font-bold text-[20px]">
          <Link to='/' className="hover:text-orange-500 transition">
            학식 메뉴
          </Link>
          <Link to='/menu/rakrak' className="hover:text-orange-500 transition">
            락락 메뉴
          </Link>
          <Link to='/menu/congestion' className="hover:text-orange-500 transition">
            혼잡도
          </Link>
          <Link to='/' className="hover:text-orange-500 transition">
            Team 학사모
          </Link>
        </nav>
      </div>
    </header>
  );
}

function Body(){

  return(
    <div className="w-full my-5 flex justify-center">
        <div className="w-[1000px]">
            <div className="w-[800px] m-auto">
                <p className="py-[16.75px] m-0 font-bold text-center text-[25px]">2025 5월 첫째주</p>
                <DaySelector />
                <PlaceSelector />
                <Menu />
            </div>
        </div>
    </div>
  )
}

function Menu(){
    return(
        <div className="my-[65px] flex items-center gap-[61px] font-bold">
            <div className="flex-1 justify-center">
                <div className="flex flex-1 bg-[#FF8940] text-white items-center justify-center rounded-[8px] h-10">
                    아침
                </div>
                <div className="my-4 h-[452px] flex flex-col">
                    <div className="flex flex-1 items-center justify-center bg-[#FFC19B] border border-[#FF8940] rounded-[10px]">
                        일품 메뉴
                    </div>
                    <div className="my-[10px] flex flex-1 items-center justify-center bg-[#E6E6E6] border border-[#B7B7B7] rounded-[10px]">
                        일반 메뉴
                    </div>
                </div>
            </div>
            <div className="flex-1 justify-center">
                <div className="flex flex-1 items-center justify-center border border-[#B7B7B7] rounded-[8px] h-10">
                    점심
                </div>
                <div className="my-4 h-[452px] flex flex-col">
                    <div className="flex flex-1 items-center justify-center border border-[#FF8940] rounded-[10px]">
                        일품 메뉴
                    </div>
                    <div className="my-[10px] flex flex-1 items-center justify-center border border-[#B7B7B7] rounded-[10px]">
                        일반 메뉴
                    </div>
                </div>
            </div>
            <div className="flex-1 justify-center">
                <div className="flex flex-1 items-center justify-center border border-[#B7B7B7] rounded-[8px] h-10">
                    저녁
                </div>
                <div className="my-4 h-[452px] flex flex-col">
                    <div className="flex flex-1 items-center justify-center border border-[#FF8940] rounded-[10px]">
                        일품 메뉴
                    </div>
                    <div className="my-[10px] flex flex-1 items-center justify-center border border-[#B7B7B7] rounded-[10px]">
                        일반 메뉴
                    </div>
                </div>
            </div>
        </div>
    )
}

function DaySelector(){
    const days = [
    { date: 26, day: "월" },
    { date: 27, day: "화" },
    { date: 28, day: "수" },
    { date: 29, day: "목" },
    { date: 30, day: "금" },
    ];
    
    const [selected, setSelected] = useState(28);

    return(
        <div className="flex justify-center items-center">
            <div className="flex rounded-[12px] border border-[#B7B7B7] w-[432px] h-[102px] gap-2">
                {days.map( (d) => (
                    <div 
                    key={d.date} 
                    onClick={() => setSelected(d.date)}
                    className={`flex flex-col flex-1 items-center justify-center px-4 py-2 cursor-pointer transition-all duration-300 font-bold
                        ${selected === d.date ? "bg-[#FF8940] text-white rounded-[12px] shadow-md" : "text-[#757575]"}`}>
                        <div className="text-[18px]">{d.date}</div>
                        <div className="text-[18px]">{d.day}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function PlaceSelector(){
    const [place, setPlace] = useState(1);

    return(
        <div className="my-[38px] flex items-center justify-center">
            <div className="flex border border-[#B7B7B7] w-[278px] h-[50px] rounded-[13px]">
                <div onClick={()=>setPlace(1)} className={`cursor-pointer transition-all duraition-300 font-bold rounded-[12px] ${
                    place===1 ? "bg-[#FF8940] text-white flex flex-1 items-center shadow justify-center" : "flex flex-1 items-center justify-center text-[#757575]"}`}>
                        제1 학생식당
                    </div>
                <div onClick={()=>setPlace(2)} className={`cursor-pointer transition-all duraition-300 font-bold rounded-[12px] ${
                    place===2 ? "bg-[#FF8940] text-white flex flex-1 items-center shadow justify-center" : "flex flex-1 items-center justify-center text-[#757575]"}`}>
                        제2 학생식당
                    </div>
            </div>
        </div>
    )
}

function RouteComponent() {
  return (
    <div>
      <Body />
    </div>
  );
}

export default Header;