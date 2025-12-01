import { useNavigate } from '@tanstack/react-router'
import dayjs from "dayjs";
import "dayjs/locale/ko";
import axios from "axios";
import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

//🎯 interface 선언
//-----------------------------------
interface DateNavigatorProps {
  baseDate: Date;
  weekOffset: number;
  setWeekOffset: React.Dispatch<React.SetStateAction<number>>;
}

interface DateSelectorProps {
  baseDate: Date;
  weekOffset: number;
}

interface MenuDisplayProps {
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

//-----------------------------📌RouteComponent📌-----------------------------
export default function DesktopDate({ date }: Props) {
  const [weekOffset, setWeekOffset] = useState(0);
  const [baseDate, setBaseDate] = useState(dayjs(date).toDate());

  //baseDate param 바뀔 때마다 date, weekOffset 값 동기화
  useEffect(() => {
    setBaseDate(dayjs(date).toDate());
    setWeekOffset(0);
  }, [date])

  return (
    <div className="bg-[#F8F4F1] p-7">
      <DateNevigator baseDate={baseDate} weekOffset={weekOffset} setWeekOffset={setWeekOffset} />
      <DateSelector baseDate={baseDate} weekOffset={weekOffset} />
      <MenuDisplay date={date} />
    </div>
  )
}

//-----------------------------🔥DateNeviagtor🔥-----------------------------
//화살표로 빠르게 주(week) 이동하는 Component
function DateNevigator({ baseDate, weekOffset, setWeekOffset }: DateNavigatorProps) {
  const { t, i18n } = useTranslation();
  const weekDates = getWeekDates(baseDate, weekOffset);
  const monday = weekDates[0];
  const friday = weekDates[4];
  const navigate = useNavigate();
  dayjs.locale(i18n.language === 'ko' ? 'ko' : 'en');

  //날짜 formatting
  const formatDate = (date: Date): string => {
    const year = dayjs(date).format("YYYY");
    const month = dayjs(date).format("MM");
    const day = dayjs(date).format("DD");
    return i18n.language === 'ko' ? `${year}년 ${month}월 ${day}일` : `${year}/${month}/${day}`;
  };

  const handleWeekChange = (direction: number) => {
    const newWeekOffset = weekOffset + direction;
    setWeekOffset(newWeekOffset);

    const weekDates = getWeekDates(baseDate, newWeekOffset);
    const newMonday = dayjs(weekDates[0]).format("YYYY-MM-DD")

    navigate({ to: "/menu/$date", params: { date: newMonday } });
  }

  return (
    <div className="flex items-center justify-center gap-4 bg-[#F8F4F1] p-4">
      <img className="hover:brightness-95 transition" alt="leftArrow" src="../leftArrow.svg"
        onClick={() => handleWeekChange(-1)} />
      <span className="text-2xl font-bold min-w-[320px] text-center">
        {formatDate(monday)} - {i18n.language === 'ko' ? `${monday.getMonth() === friday.getMonth() ? '' : `${friday.getMonth() + 1}월 `}${friday.getDate()}일` : `${monday.getMonth() === friday.getMonth() ? '' : `${friday.getMonth() + 1}/`}${friday.getDate()}`}
      </span>
      <img className="hover:brightness-95 transition" alt="rightArrow" src="../rightArrow.svg"
        onClick={() => handleWeekChange(1)} />
    </div>
  );
}


//-----------------------------🔥DateSelector🔥-----------------------------
//금주 월~금 선택할 수 있는 Component
function DateSelector({ baseDate, weekOffset }: DateSelectorProps) {
  const { i18n } = useTranslation();
  const weekDates = getWeekDates(baseDate, weekOffset);
  const [daySelected, setDaySelected] = useState(baseDate);
  const navigate = useNavigate();
  dayjs.locale(i18n.language === 'ko' ? 'ko' : 'en');

  useEffect(() => {
    setDaySelected(baseDate);
  }, [baseDate])

  //날짜 formatting
  const formatDate = (date: Date): string => {
    return dayjs(date).format("DD")
  }

  //월~금 객체 배열
  const days = [
    { date: weekDates[0], day: i18n.language === 'ko' ? "월" : "Mon" },
    { date: weekDates[1], day: i18n.language === 'ko' ? "화" : "Tue" },
    { date: weekDates[2], day: i18n.language === 'ko' ? "수" : "Wed" },
    { date: weekDates[3], day: i18n.language === 'ko' ? "목" : "Thu" },
    { date: weekDates[4], day: i18n.language === 'ko' ? "금" : "Fri" },
  ]

  const handleDayChange = (date: Date) => {
    setDaySelected(date);
    const newDate = dayjs(date).format("YYYY-MM-DD")

    navigate({ to: "/menu/$date", params: { date: newDate } })
  }

  return (
    <div className="m-4 flex justify-center items-center">
      <div className="flex rounded-[12px] border border-[#B7B7B7] w-[432px] h-[102px] gap-2 bg-white">
        {days.map((day) => (
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
function MenuDisplay({ date }: MenuDisplayProps) {
  const { t, i18n } = useTranslation();
  const [firstMenuData, setFirstMenuData] = useState<MenuData>();
  const [secondMenuData, setSecondMenuData] = useState<MenuData>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fixedBreakfastNames = ['시리얼*우유', '토스트*잼', '야채샐러드*D'];
  const fixedBreakfast = [
    { key: 'cereal', name: t('fixedBreakfast.cereal') },
    { key: 'toast', name: t('fixedBreakfast.toast') },
    { key: 'salad', name: t('fixedBreakfast.salad') }
  ];

  // 메뉴 아이템 이름 표시 함수 (name_en fallback)
  const getMenuItemName = (item: MenuItem) => {
    if (i18n.language === 'en' && item.name_en && item.name_en.trim() !== '') {
      return item.name_en;
    }
    return item.name;
  };

  const mondayStr = useMemo(() => {
    const monday = getWeekDates(dayjs(date).toDate())[0];
    return dayjs(monday).format("YYYY-MM-DD");
  }, [date]);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        setError(null);
        // 제 1학생식당의 주 단위 메뉴 GET
        const resFirst = await axios.get(
          `${API_BASE_URL}/restaurants/restaurant_1`,
          { params: { date: mondayStr } }
        );
        setFirstMenuData(resFirst.data.data);

        //제 2학생식당의 주 단위 메뉴 GET
        const resSecond = await axios.get(
          `${API_BASE_URL}/restaurants/restaurant_2`,
          { params: { date: mondayStr } }
        );
        setSecondMenuData(resSecond.data.data);

      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.error || err.message);
        } else {
          setError("알 수 없는 에러가 발생했습니다.")
        }
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, [mondayStr])

  // 각 일자별 1학, 2학 전체 식단표 받아오기(조식/중식/석식)
  const firstDayData = firstMenuData?.meals_by_day.find(d => d.date === date);
  const secondDayData = secondMenuData?.meals_by_day.find(d => d.date === date);
  // 1학, 2학 별로 조식/중식/석식 저장
  // 조식
  const firstBreakfastItems = firstDayData?.meals?.["Breakfast"]?.menu_items.filter((item) => (!fixedBreakfastNames.includes(item.name)));
  const secondBreakfastItems = secondDayData?.meals?.["Breakfast"]?.menu_items.filter((item) => (!fixedBreakfastNames.includes(item.name)));
  // 중식_1
  const firstLunchItems_1 = firstDayData?.meals?.["Lunch_1"]?.menu_items;
  const secondLunchItems_1 = secondDayData?.meals?.["Lunch_1"]?.menu_items;
  // 중식_2
  const firstLunchItems_2 = firstDayData?.meals?.["Lunch_2"]?.menu_items;
  const secondLunchItems_2 = secondDayData?.meals?.["Lunch_2"]?.menu_items;
  // 석식
  const firstDinnerItems = firstDayData?.meals?.["Dinner"]?.menu_items;
  const secondDinnerItems = secondDayData?.meals?.["Dinner"]?.menu_items;

  return (
    <div className="sm:mx-10 md:mx-30 lg:mx-50 xl:mx-70">
      {/* 조식 div */}
      <div className="border border-orange-500 rounded-xl my-10">
        <div className="bg-[#FFB080] rounded-t-xl flex items-center p-4">
          <img alt={t('meal.breakfast')} src="/logoBreakfast.svg" />
          <span className="font-bold px-1">{t('meal.breakfast')}</span>
          <span className="flex-1">{t('time.breakfast')}</span>
          <span className="font-semibold">1,000{t('currency.won')}</span>
        </div>
        <div className="flex justify-center items-stretch">
          <div className="flex-1">
            <div className="text-center p-3 border-r-1 border-b-1 border-orange-500 font-semibold">
              {t('restaurant.first')}
            </div>
            <div className="border-r-1 border-b-1 border-orange-500">
              {(() => {
                return firstBreakfastItems && firstBreakfastItems.length > 0 ? (
                  <ul className="p-4 font-medium">
                    {firstBreakfastItems.map((item, idx) => (
                      <li key={idx} className={`p-1 ${item.category === "메인메뉴" ? "text-orange-500" : ""}`}>{getMenuItemName(item)}</li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-4 text-center text-gray-400">{t('empty.breakfast')}</div>
                );
              })()}
            </div>
            {/* 조식 메뉴 2 */}
            <div>
              <ul className="p-4 font-medium border-r-1 border-orange-500">
                {fixedBreakfast.map((item) => (
                  <li key={item.key} className={`p-1 ${item.key === "salad" ? "text-green-700" : ""}`}>{item.name}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="flex-1">
            <div className="text-center p-3 border-b-1 border-orange-500 font-semibold">
              {t('restaurant.second')}
            </div>
            <div className="">
              {(() => {
                return secondBreakfastItems && secondBreakfastItems.length > 0 ? (
                  <ul className="p-4 font-medium">
                    {secondBreakfastItems.map((item, idx) => (
                      <li key={idx} className={`p-1 ${item.category === "메인메뉴" ? "text-orange-500" : ""}`}>{getMenuItemName(item)}</li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-4 text-center text-gray-400">{t('empty.breakfast')}</div>
                );
              })()}
            </div>
          </div>
        </div>
      </div>


      {/* 중식 div */}
      <div className="border border-orange-500 rounded-xl my-10">
        <div className="bg-[#FFB080] rounded-t-xl flex items-center p-4">
          <img alt={t('meal.lunch')} src="/logoLunch.svg" />
          <span className="font-bold px-1">{t('meal.lunch')}</span>
          <span className="flex-1">{t('time.lunch')}</span>
          <span className="font-semibold">5,500{t('currency.won')}</span>
        </div>

        <div className="flex justify-center items-stretch">
          {/* 제1 학생식당 */}
          <div className="flex-1">
            <div className="text-center p-3 border-r-1 border-b-1 border-orange-500 font-semibold">
              {t('restaurant.first')}
            </div>
            {/* 중식 메뉴 1 */}
            <div className="bg-[#FFDEC9] border-b-1 border-r-1 border-orange-500 h-[100px] flex items-center">
              {(() => {
                return firstLunchItems_1 && firstLunchItems_1.length > 0 ? (
                  <ul className="p-4 font-medium">
                    {firstLunchItems_1.map((item, idx) => (
                      <li key={idx}>
                        {getMenuItemName(item).split("\n*").map((line, lineIdx) => (
                          <div key={lineIdx} className="p-1">{line}</div>
                        ))}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-4 mx-auto text-gray-400">{t('empty.lunch')}</div>
                );
              })()}
            </div>
            {/* 중식 메뉴 2 */}
            <div className="border-r-1 border-orange-500">
              {(() => {
                return firstLunchItems_2 && firstLunchItems_2.length > 0 ? (
                  <ul className="p-4 font-medium">
                    {firstLunchItems_2.map((item, idx) => (
                      <li key={idx} className={`p-1 ${item.category === "메인메뉴" ? "text-orange-500" : ""}`}>{getMenuItemName(item)}</li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-4 text-center text-gray-400">{t('empty.lunch')}</div>
                );
              })()}
            </div>
          </div>

          {/* 제2 학생식당 */}
          <div className="flex-1">
            <div className="text-center p-3 border-b-1 border-orange-500 font-semibold">
              {t('restaurant.second')}
            </div>
            {/* 중식 메뉴 1 */}
            <div className="bg-[#FFDEC9] border-b-1 border-orange-500 h-[100px] flex items-center">
              {(() => {
                return secondLunchItems_1 && secondLunchItems_1.length > 0 ? (
                  <ul className="p-4 font-medium">
                    {secondLunchItems_1.map((item, idx) => (
                      <li key={idx}>
                        {getMenuItemName(item).split("\n*").map((line, lineIdx) => (
                          <div key={lineIdx} className="p-1">{line}</div>
                        ))}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-4 mx-auto text-gray-400">{t('empty.lunch')}</div>
                );
              })()}
            </div>
            {/* 중식 메뉴 2 */}
            <div className="">
              {(() => {
                return secondLunchItems_2 && secondLunchItems_2.length > 0 ? (
                  <ul className="p-4 font-medium">
                    {secondLunchItems_2.map((item, idx) => (
                      <li key={idx} className={`p-1 ${item.category === "메인메뉴" ? "text-orange-500" : ""}`}>{getMenuItemName(item)}</li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-4 text-center text-gray-400">{t('empty.lunch')}</div>
                );
              })()}
            </div>
          </div>
        </div>
      </div>



      {/* 석식 div */}
      <div className="border border-orange-500 rounded-xl my-10">
        <div className="bg-[#FFB080] rounded-t-xl flex items-center p-4">
          <img alt={t('meal.dinner')} src="/logoDinner.svg" />
          <span className="font-bold px-1">{t('meal.dinner')}</span>
          <span className="flex-1">{t('time.dinner')}</span>
          <span className="font-semibold">5,500{t('currency.won')}</span>
        </div>
        <div className="flex justify-center items-stretch">
          <div className="flex-1">
            <div className="text-center p-3 border-r-1 border-b-1 border-orange-500 font-semibold">
              {t('restaurant.first')}
            </div>
            <div className="border-r-1 border-orange-500">
              {(() => {
                return firstDinnerItems && firstDinnerItems.length > 0 ? (
                  <ul className="p-4 font-medium">
                    {firstDinnerItems.map((item, idx) => (
                      <li key={idx} className={`p-1 ${item.category === "메인메뉴" ? "text-orange-500" : ""}`}>{getMenuItemName(item)}</li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-4 text-center text-gray-400">{t('empty.dinner')}</div>
                );
              })()}
            </div>
          </div>
          <div className="flex-1">
            <div className="text-center p-3 border-b-1 border-orange-500 font-semibold">
              {t('restaurant.second')}
            </div>
            <div className="">
              {(() => {
                return secondDinnerItems && secondDinnerItems.length > 0 ? (
                  <ul className="p-4 font-medium">
                    {secondDinnerItems.map((item, idx) => (
                      <li key={idx} className={`p-1 ${item.category === "메인메뉴" ? "text-orange-500" : ""}`}>{getMenuItemName(item)}</li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-4 text-center text-gray-400">{t('empty.dinner')}</div>
                );
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}