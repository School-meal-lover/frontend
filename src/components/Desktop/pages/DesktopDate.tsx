import { useNavigate} from '@tanstack/react-router'
import dayjs from "dayjs";
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
  weekOffset: number;
  setWeekOffset: React.Dispatch<React.SetStateAction<number>>;
}

interface DateSelectorProps{
  baseDate: Date;
  weekOffset: number;
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
export default function DesktopDate({date} : Props) {
  const [weekOffset, setWeekOffset] = useState(0);
  const [baseDate, setBaseDate] = useState(dayjs(date).toDate());

  //baseDate param 바뀔 때마다 date, weekOffset 값 동기화
  useEffect( () => {
    setBaseDate(dayjs(date).toDate());
    setWeekOffset(0); 
  }, [date])

  return(
    <div className="bg-[#F8F4F1] p-7">
      <DateNevigator baseDate={baseDate} weekOffset={weekOffset} setWeekOffset={setWeekOffset}/>
      <DateSelector baseDate={baseDate} weekOffset={weekOffset} />
      <MenuDisplay date={date} />
    </div>
  )
}

//-----------------------------🔥DateNeviagtor🔥-----------------------------
//화살표로 빠르게 주(week) 이동하는 Component
function DateNevigator({baseDate, weekOffset, setWeekOffset}: DateNavigatorProps) {
  const weekDates = getWeekDates(baseDate, weekOffset);
  const monday = weekDates[0];
  const friday = weekDates[4];
  const navigate = useNavigate();

  //날짜 formatting
  const formatKoreanDate = (date: Date): string => {
    return dayjs(date).format("YYYY년 MM월 DD일")
  };

  const handleWeekChange = (direction: number) => {
    const newWeekOffset = weekOffset + direction;
    setWeekOffset(newWeekOffset);

    const weekDates = getWeekDates(baseDate, newWeekOffset);
    const newMonday = dayjs(weekDates[0]).format("YYYY-MM-DD")
    
    navigate({to: "/menu/$date", params: {date: newMonday}});
  }

  return (
    <div className="flex items-center justify-center gap-4 bg-[#F8F4F1] p-4">
      <img className="hover:brightness-95 transition" alt="leftArrow" src="../public/leftArrow.svg" 
      onClick={() => handleWeekChange(-1)} />
      <span className="text-2xl font-bold min-w-[320px] text-center">
        {formatKoreanDate(monday)} - {`${monday.getMonth() === friday.getMonth() ? '' : `${friday.getMonth() + 1}월 `}${friday.getDate()}일`}
      </span>
      <img className="hover:brightness-95 transition" alt="rightArrow" src="../public/rightArrow.svg" 
      onClick={() => handleWeekChange(1)} />
    </div>
  );
}


//-----------------------------🔥DateSelector🔥-----------------------------
//금주 월~금 선택할 수 있는 Component
function DateSelector({baseDate, weekOffset} : DateSelectorProps){
  const weekDates = getWeekDates(baseDate, weekOffset);
  const [daySelected, setDaySelected] = useState(baseDate);
  const navigate = useNavigate();

  useEffect(() => {
    setDaySelected(baseDate);
  }, [baseDate])

  //날짜 formatting
  const formatDate= (date: Date): string => {
    return dayjs(date).format("DD")
  }

  //월~금 객체 배열
  const days = [
    {date: weekDates[0], day: "월"},
    {date: weekDates[1], day: "화"},
    {date: weekDates[2], day: "수"},
    {date: weekDates[3], day: "목"},
    {date: weekDates[4], day: "금"},
  ]

  const handleDayChange = (date: Date) => {
    setDaySelected(date);
    const newDate = dayjs(date).format("YYYY-MM-DD")

    navigate({to: "/menu/$date", params: {date: newDate}})
  }

  return (
    <div className="m-4 flex justify-center items-center">
      <div className="flex rounded-[12px] border border-[#B7B7B7] w-[432px] h-[102px] gap-2 bg-white">
        {days.map( (day) => (
         <div 
         key={formatDate(day.date)} 
         onClick={() => handleDayChange(day.date)}
         className={`flex flex-col flex-1 items-center justify-center px-4 py-2 cursor-pointer transition-all duration-300 font-bold
              ${formatDate(daySelected) === formatDate(day.date) ? "bg-[#FF8940] text-white rounded-[10px] shadow-md" : "text-[#757575]"}`}>
              <div className="text-[18px]">{formatDate(day.date)}</div>
              <div className="text-[18px]">{day.day}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

//-----------------------------🔥MenuDisplay🔥-----------------------------
//날짜에 맞게 메뉴(조식, 점심, 석식) 보여주는 Component
function MenuDisplay({date} : MenuDisplayProps){
  const [firstMenuData, setFirstMenuData] = useState<MenuData | null>(null);
  const [secondMenuData, setSecondMenuData] = useState<MenuData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      <p>
        
      </p>
    </div>
  )
}