import { useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/ko";

//🎯 interface 선언
//-----------------------------------
interface DateNavigatorProps{
  baseDate: Date;
  setBaseDate: React.Dispatch<React.SetStateAction<Date>>;
}

interface CategoryDisplayProps{
    selectedCategory: string;
    setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
}

interface MenuDisplayProps{
    selectedCategory: string;
}
//-----------------------------------

export default function MobileLacklack() {
    const [baseDate, setBaseDate] = useState(dayjs().toDate());
    const [selectedCategory, setSelectedCategory] = useState("찌개 / 라면")

    return(
        <div className="bg-[#F8F4F1] p-7">
            <DateNevigator baseDate={baseDate} setBaseDate={setBaseDate} />
            <CategoryDisplay selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}/>
            <MenuDisplay selectedCategory={selectedCategory} />
        </div>
  )
}

//-----------------------------🔥DateNeviagtor🔥-----------------------------
//화살표로 빠르게 주(week) 이동하는 Component
function DateNevigator({baseDate, setBaseDate}: DateNavigatorProps) {
  //한글 로케일 설정
  dayjs.locale("ko");
  //날짜 formatting
  const formatKoreanDate = (date: Date): string => {
    return dayjs(date).format("YYYY년 MM월 DD일 (dd)")
  };
  //화살표 누름에 따라 +/- 1일 하는 함수
  const handleDayChange = (direction: number) => {
    const newDate = dayjs(baseDate).add(direction, "day").toDate();
    setBaseDate(newDate);
  };

  return(
    <div className="flex items-center justify-center gap-4 bg-[#F8F4F1] p-4">
      <img className="hover:brightness-95 transition" alt="leftArrow" src="../public/leftArrow.svg"
      onClick={() => handleDayChange(-1)}  />
      <span className="text-2xl font-bold text-center">
        {formatKoreanDate(baseDate)}
      </span>
      <img className="hover:brightness-95 transition" alt="rightArrow" src="../public/rightArrow.svg"
      onClick={() => handleDayChange(1)} />
    </div>
  )
}

function CategoryDisplay({selectedCategory, setSelectedCategory}: CategoryDisplayProps){
    const categories = ["찌개 / 라면", "돈가스 / 밥", "음료수", "도너츠", "특별메뉴"];
    
    return(
        <div className="border-1 border-[#B7B7B7] rounded-xl w-full mb-10">
            <div className="grid grid-cols-2">
                {categories.map((category) => (
                    <div className={`text-center p-2 rounded-xl hover:cursor-pointer font-medium transition duration-300
                    ${selectedCategory === category ? "text-white bg-[#FF904C]" : "text-gray-500"}`}
                    onClick = {() => setSelectedCategory(category)}>
                        {category}
                    </div>
                ))}
            </div>
        </div>
    )
}

function MenuDisplay({selectedCategory}: MenuDisplayProps){
    const allMenuData = [
        {category:"찌개 / 라면", name:"김치찌개", price:"5,000", src:"../lacklack_01.png"},
        {category:"찌개 / 라면", name:"김치찌개+라면사리", price:"5,500", src:"../lacklack_02.png"},
        {category:"찌개 / 라면", name:"애호박찌개", price:"5,000", src:"../lacklack_03.png"},
        {category:"찌개 / 라면", name:"애호박찌개+라면사리", price:"5,000", src:"../lacklack_04.png"},
        {category:"찌개 / 라면", name:"버섯불고기", price:"6,500", src:"../lacklack_05.png"},
        {category:"찌개 / 라면", name:"라면", price:"3,000", src:"../lacklack_06.png"},
        {category:"찌개 / 라면", name:"계란라면", price:"3,500", src:"../lacklack_07.png"},
        {category:"찌개 / 라면", name:"치즈라면", price:"3,500", src:"../lacklack_08.png"},
        {category:"돈가스 / 밥", name:"치즈돈가스", price:"6,500", src:"../lacklack_09.png"},
        {category:"돈가스 / 밥", name:"치킨가스", price:"5,500", src:"../lacklack_10.png"},
        {category:"돈가스 / 밥", name:"웰빙비빔밥", price:"5,000", src:"../lacklack_11.png"},
        {category:"돈가스 / 밥", name:"제육덮밥", price:"6,000", src:"../lacklack_12.png"},
        {category:"돈가스 / 밥", name:"김치볶음밥", price:"5,000", src:"../lacklack_13.png"},
        {category:"돈가스 / 밥", name:"야채볶음밥", price:"5,000", src:"../lacklack_14.png"},
        {category:"돈가스 / 밥", name:"오므라이스", price:"5,000", src:"../lacklack_15.png"},
        {category:"돈가스 / 밥", name:"참치컵밥", price:"5,000", src:"../lacklack_16.png"},
        {category:"음료수", name:"콜라", price:"1,200", src:"../lacklack_17.png"},
        {category:"음료수", name:"스프라이트", price:"1,200", src:"../lacklack_18.png"},
        {category:"음료수", name:"환타", price:"1,500", src:"../lacklack_19.png"},
    ]
    const menuData = allMenuData.filter(item => item.category === selectedCategory)

    return(
        <div className="border-t-1 border-[#B7B7B7]">
            <h1 className="font-medium text-xl my-4">락락 메뉴 &gt; {selectedCategory}</h1>
            <div className="grid grid-cols-2 gap-4">
                {menuData.map((item) => (
                    <div className="border border-[#B7B7B7] rounded-[10px] shadow-xl p-4">
                        <div className="w-full h-35">
                            <img src={item.src} className={`w-full h-full rounded-xl ${selectedCategory === "음료수" ? "object-contain" : "object-cover"}`}/>
                        </div>
                        <div className="mt-2 font-bold">{item.name}</div>
                        <div className="text-sm text-gray-500">{item.price}원</div>
                    </div>
                ))}
            </div>
        </div>
    )
}