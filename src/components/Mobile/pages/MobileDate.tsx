import { useNavigate} from '@tanstack/react-router'
import dayjs from "dayjs";
import "dayjs/locale/ko";
import axios from "axios";
import React, {useState, useEffect, useMemo} from 'react';

const FIRST_RESTAURANT = "6dd9a55b-1202-4073-a875-0bb79f57a3b0";
const SECOND_RESTAURANT = "860be56e-fbf2-4a8e-b5e3-8c8f151d8b21";
// const LACK_LACK = "e4f67cd4-eebd-467e-a0e9-e718d3b056ed"; 

// params로 받아온 날짜 기준으로 해당 주의 월~금 날짜 배열 return
const getWeekDates = (baseDate: Date, weekOffset: number = 0): Date[] => {
  const day = baseDate.getDay(); // 0: 일요일, 1: 월요일, ...
  const monday = new Date(baseDate);
  monday.setDate(baseDate.getDate() - (day === 0 ? 6 : day - 1) + weekOffset * 7);

  const weekDates = [];
  for (let i = 0; i < 5; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    weekDates.push(d);
  }
  return weekDates;
};

//🎯 interface 선언
//-----------------------------------
interface DateNavigatorProps{
  baseDate: Date;
  setBaseDate: React.Dispatch<React.SetStateAction<Date>>;
}

interface MenuDisplayProps{
  date: string;
}

export interface MenuApiResponse {
  code: string;
  data: MenuData;
  error: string;
  success: boolean;
}

export interface MenuData {
  meals_by_day: MealsByDay[];
  restaurant: Restaurant;
  summary: Summary;
  week: WeekInfo;
}

export interface MealsByDay {
  date: string; // YYYY-MM-DD
  day_of_week: string; // e.g. "월요일"
  meals: {
    [mealType: string]: Meal; // 조식/중식/석식 key
  };
}

export interface Meal {
  meal_id: string;
  meal_type: string; // e.g. "breakfast", "lunch", "dinner"
  menu_items: MenuItem[];
}

export interface MenuItem {
  category: string;
  id: string;
  name: string;
  name_en: string;
  price: number;
}

export interface Restaurant {
  id: string;
  name: string;
  name_en: string;
}

export interface Summary {
  total_days: number;
  total_meals: number;
  total_menu_items: number;
}

export interface WeekInfo {
  end_date: string;
  id: string;
  start_date: string;
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
    <div className="bg-[#F8F4F1] p-7">
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

//-----------------------------🔥MenuDisplay🔥-----------------------------
//날짜에 맞게 메뉴(조식, 점심, 석식) 보여주는 Component
function MenuDisplay({date} : MenuDisplayProps){
  const [firstMenuData, setFirstMenuData] = useState<MenuData | null>(null);
  const [secondMenuData, setSecondMenuData] = useState<MenuData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState<number>(1);

  const restaurants = [
    {name: "제1 학생식당", number: 1},
    {name: "제2 학생식당", number: 2}
  ]

  const mondayStr = useMemo(() => {
    const monday = getWeekDates(dayjs(date).toDate())[0];
    return dayjs(monday).format("YYYY-MM-DD");
  }, [date]);

  useEffect(() => {
    const fetchMenu = async () => {
      try{
        setLoading(true);
        setError(null);
        // 제 1학생식당의 주 단위 메뉴 GET
        const resFirst: MenuApiResponse = await axios.get(`http://grrrr.is-an.ai:9090/api/v1/restaurants/${FIRST_RESTAURANT}`,{
          params: {
            date: mondayStr
          }
        });
        setFirstMenuData(resFirst.data);

        //제 2학생식당의 주 단위 메뉴 GET
        const resSecond: MenuApiResponse = await axios.get(`http://grrrr.is-an.ai:9090/api/v1/restaurants/${SECOND_RESTAURANT}`,{
          params: {
            date: mondayStr
          }
        });
        setSecondMenuData(resSecond.data);

      } catch(err){
        if(axios.isAxiosError(err)){
          setError(err.response?.data?.error || err.message);
        }else{
          setError("알 수 없는 에러가 발생했습니다.")
        }
      } finally{
        setLoading(false);
      }
    };
    fetchMenu();
  },[mondayStr])

  // 나중에 dayData = firstMenuData.meals_by_day.find(d=> d.date === date) 사용해서 일자별 필터링
  // 이후 dayData.meals["breakfast"].menu_items 로 각 메뉴별(객체) 저장 배열 만들어서 보여주면 될 듯
  return(
    <div>
      {/* 식당 선택 div */}
      <div className="flex justify-center items-center">
        {restaurants.map( (restaurant) => (
          <div className={`px-12 py-2 border-b-2 font-semibold hover:cursor-pointer
          ${selectedRestaurant === restaurant.number ? "border-orange-500 text-orange-500" : "border-gray-300"}`}
          onClick={() => setSelectedRestaurant(restaurant.number)}>
            {restaurant.name}
          </div>
        ))}
      </div>
      {/* 조식, 중식, 석식 담는 div */}
      
    </div>
  )
}