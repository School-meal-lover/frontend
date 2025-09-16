import { useNavigate} from '@tanstack/react-router'
import dayjs from "dayjs";
import "dayjs/locale/ko";
import axios from "axios";
import React, {useState, useEffect} from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const FIRST_RESTAURANT = import.meta.env.VITE_FIRST_RESTAURANT_ID;
const SECOND_RESTAURANT = import.meta.env.VITE_SECOND_RESTAURANT_ID;
// const LACK_LACK = "e4f67cd4-eebd-467e-a0e9-e718d3b056ed"; 


//🎯 interface 선언
//-----------------------------------
interface DateNavigatorProps{
  baseDate: Date;
  setBaseDate: React.Dispatch<React.SetStateAction<Date>>;
}

interface MenuDisplayProps{
  date: string;
}

// 전체 axios 응답 구조
export interface AxiosResponseWrapper {
  success: boolean;
  data: MenuData;
  error?: string;
  code?: string;
}

// 실제 payload 구조
export interface MenuData {
  restaurant: Restaurant;
  week: WeekInfo;
  meals_by_day: MealsByDay[];
  summary: Summary;
}

export interface Restaurant {
  id: string;
  name: string;
  name_en: string;
}

export interface WeekInfo {
  id: string;
  start_date: string; // YYYY-MM-DD
  end_date: string;   // YYYY-MM-DD
}

export interface MealsByDay {
  date: string; // YYYY-MM-DD
  day_of_week: string; // e.g., "Mon", "화요일"
  meals: {
    [mealType: string]: Meal; // "Breakfast", "Lunch_1", "Dinner" 등
  };
}

export interface Meal {
  meal_id: string;
  meal_type: string;
  menu_items: MenuItem[];
}

export interface MenuItem {
  id: string;
  category: string;
  name: string;
  name_en: string;
  price: number;
}

export interface Summary {
  total_days: number;
  total_meals: number;
  total_menu_items: number;
}

interface Props {
  date: string;
}
//-----------------------------------


//-----------------------------📌RouteComponent📌-----------------------------
export default function MobileDate({date} : Props) {
  const [baseDate, setBaseDate] = useState(dayjs(date).toDate());

  //baseDate param 바뀔 때마다 date, weekOffset 값 동기화
  useEffect( () => {
    setBaseDate(dayjs(date).toDate());
  }, [date])

  return(
    <div className="bg-[#F8F4F1] p-5 min-w-[300px] min-h-screen">
      <DateNevigator baseDate={baseDate} setBaseDate={setBaseDate} />
      <MenuDisplay date={date} />
    </div>
  )
}

//-----------------------------🔥DateNeviagtor🔥-----------------------------
//화살표로 빠르게 주(week) 이동하는 Component
function DateNevigator({baseDate, setBaseDate}: DateNavigatorProps) {
  //한글 로케일 설정
  dayjs.locale("ko");
  const navigate = useNavigate();
  //날짜 formatting
  const formatKoreanDate = (date: Date): string => {
    return dayjs(date).format("YYYY년 MM월 DD일 (dd)")
  };
  //화살표 누름에 따라 +/- 1일 하는 함수
  const handleDayChange = (direction: number) => {
    const newDate = dayjs(baseDate).add(direction, "day").toDate();
    setBaseDate(newDate);

    navigate({to: "/menu/$date", params: {date: dayjs(newDate).format("YYYY-MM-DD")}})
  };

  return(
    <div className="flex items-center justify-center gap-4 bg-[#F8F4F1] p-4 mx-5">
      <img className="w-10 h-10 hover:brightness-95 transition" alt="leftArrow" src="../leftArrow.svg"
      onClick={() => handleDayChange(-1)}  />
      <span className="text-lg font-bold text-center whitespace-nowrap">
        {formatKoreanDate(baseDate)}
      </span>
      <img className="w-10 h-10 hover:brightness-95 transition" alt="rightArrow" src="../rightArrow.svg"
      onClick={() => handleDayChange(1)} />
    </div>
  )
}

//-----------------------------🔥MenuDisplay🔥-----------------------------
//날짜에 맞게 메뉴(조식, 점심, 석식) 보여주는 Component
function MenuDisplay({ date }: MenuDisplayProps) {
  const [firstMenuData, setFirstMenuData] = useState<MenuData>();
  const [secondMenuData, setSecondMenuData] = useState<MenuData>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState<number>(1);

  const restaurants = [
    { name: "제1 학생식당", number: 1 },
    { name: "제2 학생식당", number: 2 }
  ];

  const fixedBreakfast = ['시리얼*우유','토스트*잼','야채샐러드*D'];

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        setError(null);

        const resFirst = await axios.get(
          `${API_BASE_URL}/restaurants/${FIRST_RESTAURANT}`,
          { params: { date: date } }
        );
        setFirstMenuData(resFirst.data.data); 

        const resSecond = await axios.get(
          `${API_BASE_URL}/restaurants/${SECOND_RESTAURANT}`,
          { params: { date: date } }
        );
        setSecondMenuData(resSecond.data.data); 
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.error || err.message);
        } else {
          setError("알 수 없는 에러가 발생했습니다.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, [date]);

  const selectedMenu = selectedRestaurant === 1 ? firstMenuData : secondMenuData;
  const dayData = selectedMenu?.meals_by_day?.find((d) => d.date === date);
  const breakfastItems = dayData?.meals?.["Breakfast"]?.menu_items.filter((item) => (!fixedBreakfast.includes(item.name)));
  const lunchItems_1 = dayData?.meals?.["Lunch_1"]?.menu_items;
  const lunchItems_2 = dayData?.meals?.["Lunch_2"]?.menu_items;
  const dinnerItems = dayData?.meals?.["Dinner"]?.menu_items;

  return(
    <div className="">
      {/* 식당 선택 div */}
      <div className="flex justify-center items-center mb-10">
        {restaurants.map((restaurant) => (
          <div
            key={restaurant.number}
            className={`text-center py-2 border-b-2 font-semibold hover:cursor-pointer w-full transition duration-200
            ${selectedRestaurant === restaurant.number ? "border-orange-500 text-orange-500" : "border-gray-300"}`}
            onClick={() => setSelectedRestaurant(restaurant.number)}
          >
            {restaurant.name}
          </div>
        ))}
      </div>
      {/* 조식 div */}
      <div className="border border-orange-500 rounded-xl mb-10">
        <div className="bg-[#FFB080] rounded-t-xl flex items-center p-4">
          <img alt="조식" src="/logoBreakfast.svg" />
          <span className="font-bold px-1">조식</span>
          <span className="flex-1">(08:00-09:00)</span>
          <span className="font-semibold">1,000원</span>
        </div>
        {/* 조식 메뉴 1 */}
        <div className="border-b-1 border-orange-500">
          {(() => {
            return breakfastItems && breakfastItems.length > 0 ? (
              <ul className="p-4 font-medium">
                {breakfastItems.map( (item) => (
                  <li className={`p-1 ${item.category === "메인메뉴" ? "text-orange-500" : ""}`}>{item.name}</li>
                ))}
              </ul>
            ) : (
              <div className="p-4 text-gray-400">조식 메뉴가 없습니다.</div>
            );
          })()}
        </div>
        {/* 조식 메뉴 2 */}
        <div>
          <ul className="p-4 font-medium">
            {fixedBreakfast.map( (item) => (
              <li className={`p-1 ${item==="야채샐러드*D" ? "text-green-700" : ""}`}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* 중식 div */}
      <div className="border border-orange-500 rounded-xl mb-10">
        <div className="bg-[#FFB080] rounded-t-xl flex items-center p-4">
          <img alt="조식" src="/logoLunch.svg" />
          <span className="font-bold px-1">중식</span>
          <span className="flex-1">(11:30-13:30)</span>
          <span className="font-semibold">5,500원</span>
        </div>
        {/* 중식 메뉴 1 */}
        <div className="bg-[#FFDEC9] border-b-1 border-orange-500">
          {(() => {
            return lunchItems_1 && lunchItems_1.length > 0 ? (
              <ul className="p-4 font-medium">
                {lunchItems_1.map((item) => (
                  <li>
                    {item.name.split("\n*").map((line) => (
                      <div className="p-1">{line}</div>
                    ))}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-4 text-gray-400">중식 메뉴가 없습니다.</div>
            );
          })()}
        </div>
        {/* 중식 메뉴 2 */}
        <div>
          {(() => {
            return lunchItems_2 && lunchItems_2.length > 0 ? (
              <ul className="p-4 font-medium">
                {lunchItems_2.map( (item) => (
                  <li className={`p-1 ${item.category === "메인메뉴" ? "text-orange-500" : ""}`}>{item.name}</li>
                ))}
              </ul>
            ) : (
              <div className="p-4 text-gray-400">중식 메뉴가 없습니다.</div>
            );
          })()}
        </div>
      </div>

      {/* 석식 div */}
      <div className="border border-orange-500 rounded-xl mb-10">
        <div className="bg-[#FFB080] rounded-t-xl flex items-center p-4">
          <img alt="조식" src="/logoDinner.svg" />
          <span className="font-bold px-1">석식</span>
          <span className="flex-1">(17:00-18:30)</span>
          <span className="font-semibold">5,500원</span>
        </div>
        {/* 석식 메뉴 1 */}
        <div className="">
          {(() => {
            return dinnerItems && dinnerItems.length > 0 ? (
              <ul className="p-4 font-medium">
                {dinnerItems.map( (item) => (
                  <li className={`p-1 ${item.category === "메인메뉴" ? "text-orange-500" : ""}`}>{item.name}</li>
                ))}
              </ul>
            ) : (
              <div className="p-4 text-gray-400">석식 메뉴가 없습니다.</div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}