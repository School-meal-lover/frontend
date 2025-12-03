import { useNavigate } from '@tanstack/react-router'
import dayjs from "dayjs";
import "dayjs/locale/ko";
import axios from "axios";
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

//🎯 interface 선언
//-----------------------------------
interface DateNavigatorProps {
  baseDate: Date;
  setBaseDate: React.Dispatch<React.SetStateAction<Date>>;
}

interface MenuDisplayProps {
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
export default function MobileDate({ date }: Props) {
  const [baseDate, setBaseDate] = useState(dayjs(date).toDate());

  //baseDate param 바뀔 때마다 date, weekOffset 값 동기화
  useEffect(() => {
    setBaseDate(dayjs(date).toDate());
  }, [date])

  const navigate = useNavigate();

  const handleTodayClick = () => {
    const today = dayjs().format("YYYY-MM-DD");
    navigate({ to: "/menu/$date", params: { date: today } });
  };

  return (
    <div className="bg-[#F8F4F1] p-5 min-w-[300px] min-h-screen">
      <DateNevigator baseDate={baseDate} setBaseDate={setBaseDate} />
      <TodayButton onClick={handleTodayClick} />
      <MenuDisplay date={date} />
    </div>
  )
}

//-----------------------------🔥DateNeviagtor🔥-----------------------------
//화살표로 빠르게 주(week) 이동하는 Component
function DateNevigator({ baseDate, setBaseDate }: DateNavigatorProps) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  //로케일 설정 (한글/영어)
  dayjs.locale(i18n.language === 'ko' ? 'ko' : 'en');
  //날짜 formatting
  const formatDate = (date: Date): string => {
    return dayjs(date).format(t('date.format'));
  };
  //화살표 누름에 따라 +/- 1일 하는 함수
  const handleDayChange = (direction: number) => {
    const newDate = dayjs(baseDate).add(direction, "day").toDate();
    setBaseDate(newDate);

    navigate({ to: "/menu/$date", params: { date: dayjs(newDate).format("YYYY-MM-DD") } })
  };

  return (
    <div className="flex items-center justify-center gap-4 bg-[#F8F4F1] p-4 mx-5">
      <img className="w-10 h-10 hover:brightness-95 transition" alt="leftArrow" src="../leftArrow.svg"
        onClick={() => handleDayChange(-1)} />
      <span className="text-lg font-bold text-center whitespace-nowrap">
        {formatDate(baseDate)}
      </span>
      <img className="w-10 h-10 hover:brightness-95 transition" alt="rightArrow" src="../rightArrow.svg"
        onClick={() => handleDayChange(1)} />
    </div>
  )
}

//-----------------------------🔥TodayButton🔥-----------------------------
// Navigate to today's date
interface TodayButtonProps {
  onClick: () => void;
}

function TodayButton({ onClick }: TodayButtonProps) {
  const { t } = useTranslation();

  return (
    <div className="flex justify-center items-center my-4 mx-5">
      <button
        onClick={onClick}
        className="px-6 py-2 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-md"
      >
        {t('button.today')}
      </button>
    </div>
  );
}

//-----------------------------🔥MenuDisplay🔥-----------------------------
//날짜에 맞게 메뉴(조식, 점심, 석식) 보여주는 Component
function MenuDisplay({ date }: MenuDisplayProps) {
  const { t, i18n } = useTranslation();
  const [firstMenuData, setFirstMenuData] = useState<MenuData>();
  const [secondMenuData, setSecondMenuData] = useState<MenuData>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState<number>(1);
  //터치 시작, 끝 좌표
  const [touchStart, setTouchStart] = useState<{ x: number, y: number } | null>(null);
  //터치 끝 좌표
  const [touchEnd, setTouchEnd] = useState<{ x: number, y: number } | null>(null);
  //최소 스와이프 거리
  const minSwipeDistance = 50;
  //스와이프 중 상태
  const [isSwiping, setIsSwiping] = useState(false);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.targetTouches.length > 1) return;
    const touch = e.targetTouches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
    setTouchEnd(null);
    setIsSwiping(true);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const touch = e.targetTouches[0];
    setTouchEnd({ x: touch.clientX, y: touch.clientY });
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;

    const xDiff = touchStart.x - touchEnd.x;
    const yDiff = touchStart.y - touchEnd.y;

    // 수평 스와이프인지 확인
    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      if (xDiff > minSwipeDistance && selectedRestaurant === 1) {
        // 왼쪽으로 스와이프 → 2학생식당으로
        setSelectedRestaurant(2);
      } else if (xDiff < -minSwipeDistance && selectedRestaurant === 2) {
        // 오른쪽으로 스와이프 → 1학생식당으로
        setSelectedRestaurant(1);
      }
    }

    // 스와이프 상태 초기화
    setIsSwiping(false);
    setTouchStart(null);
    setTouchEnd(null);
  }, [touchStart, touchEnd, selectedRestaurant, minSwipeDistance]);
  const restaurants = [
    { name: t('restaurant.first'), number: 1 },
    { name: t('restaurant.second'), number: 2 }
  ];

  // 메뉴 아이템 이름 표시 함수 (name_en fallback)
  const getMenuItemName = (item: MenuItem) => {
    if (i18n.language === 'en' && item.name_en && item.name_en.trim() !== '') {
      return item.name_en;
    }
    return item.name;
  };

  const fixedBreakfast = [
    { key: 'cereal', name: t('fixedBreakfast.cereal') },
    { key: 'toast', name: t('fixedBreakfast.toast') },
    { key: 'salad', name: t('fixedBreakfast.salad') }
  ];

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        setError(null);

        const resFirst = await axios.get(
          `${API_BASE_URL}/restaurants/restaurant_1`,
          { params: { date: date } }
        );
        setFirstMenuData(resFirst.data.data);

        const resSecond = await axios.get(
          `${API_BASE_URL}/restaurants/restaurant_2`,
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
  const fixedBreakfastNames = ['시리얼*우유', '토스트*잼', '야채샐러드*D'];
  const breakfastItems = dayData?.meals?.["Breakfast"]?.menu_items.filter((item) => (!fixedBreakfastNames.includes(item.name)));
  const lunchItems_1 = dayData?.meals?.["Lunch_1"]?.menu_items;
  const lunchItems_2 = dayData?.meals?.["Lunch_2"]?.menu_items;
  const dinnerItems = dayData?.meals?.["Dinner"]?.menu_items;

  return (
    <div
      className={`transition-all duration-200`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
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
          <img alt={t('meal.breakfast')} src="/logoBreakfast.svg" />
          <span className="font-bold px-1">{t('meal.breakfast')}</span>
          <span className="flex-1">{t('time.breakfast')}</span>
          <span className="font-semibold">1,000{t('currency.won')}</span>
        </div>
        {/* 조식 메뉴 1 */}
        <div className="border-b-1 border-orange-500">
          {(() => {
            return breakfastItems && breakfastItems.length > 0 ? (
              <ul className="p-4 font-medium">
                {breakfastItems.map((item, idx) => (
                  <li key={idx} className={`p-1 ${item.category === "메인메뉴" ? "text-orange-500" : ""}`}>{getMenuItemName(item)}</li>
                ))}
              </ul>
            ) : (
              <div className="p-4 text-gray-400">{t('empty.breakfast')}</div>
            );
          })()}
        </div>
        {/* 조식 메뉴 2 */}
        <div>
          <ul className="p-4 font-medium">
            {fixedBreakfast.map((item) => (
              <li key={item.key} className={`p-1 ${item.key === "salad" ? "text-green-700" : ""}`}>{item.name}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* 중식 div */}
      <div className="border border-orange-500 rounded-xl mb-10">
        <div className="bg-[#FFB080] rounded-t-xl flex items-center p-4">
          <img alt={t('meal.lunch')} src="/logoLunch.svg" />
          <span className="font-bold px-1">{t('meal.lunch')}</span>
          <span className="flex-1">{t('time.lunch')}</span>
          <span className="font-semibold">5,500{t('currency.won')}</span>
        </div>
        {/* 중식 메뉴 1 */}
        <div className="bg-[#FFDEC9] border-b-1 border-orange-500">
          {(() => {
            return lunchItems_1 && lunchItems_1.length > 0 ? (
              <ul className="p-4 font-medium">
                {lunchItems_1.map((item, idx) => (
                  <li key={idx}>
                    {getMenuItemName(item).split("\n*").map((line, lineIdx) => (
                      <div key={lineIdx} className="p-1">{line}</div>
                    ))}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-4 text-gray-400">{t('empty.lunch')}</div>
            );
          })()}
        </div>
        {/* 중식 메뉴 2 */}
        <div>
          {(() => {
            return lunchItems_2 && lunchItems_2.length > 0 ? (
              <ul className="p-4 font-medium">
                {lunchItems_2.map((item, idx) => (
                  <li key={idx} className={`p-1 ${item.category === "메인메뉴" ? "text-orange-500" : ""}`}>{getMenuItemName(item)}</li>
                ))}
              </ul>
            ) : (
              <div className="p-4 text-gray-400">{t('empty.lunch')}</div>
            );
          })()}
        </div>
      </div>

      {/* 석식 div */}
      <div className="border border-orange-500 rounded-xl mb-10">
        <div className="bg-[#FFB080] rounded-t-xl flex items-center p-4">
          <img alt={t('meal.dinner')} src="/logoDinner.svg" />
          <span className="font-bold px-1">{t('meal.dinner')}</span>
          <span className="flex-1">{t('time.dinner')}</span>
          <span className="font-semibold">5,500{t('currency.won')}</span>
        </div>
        {/* 석식 메뉴 1 */}
        <div className="">
          {(() => {
            return dinnerItems && dinnerItems.length > 0 ? (
              <ul className="p-4 font-medium">
                {dinnerItems.map((item, idx) => (
                  <li key={idx} className={`p-1 ${item.category === "메인메뉴" ? "text-orange-500" : ""}`}>{getMenuItemName(item)}</li>
                ))}
              </ul>
            ) : (
              <div className="p-4 text-gray-400">{t('empty.dinner')}</div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}