import { useState, useEffect } from "react";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import { useTranslation } from "react-i18next";

// 개별 이미지 스피너 컴포넌트
const ImageSpinner = () => (
    <div className="absolute inset-0 flex justify-center items-center bg-gray-100 rounded-xl">
        <div className="w-8 h-8 border-3 border-gray-300 border-t-[#FF904C] rounded-full animate-spin"></div>
    </div>
);

//🎯 interface 선언
//-----------------------------------
type CategoryKey = 'stew' | 'pork' | 'beverage' | 'special';

interface LacklackMenuItem {
    category: CategoryKey;
    nameKey: string;
    name_ko: string;
    name_en: string;
    price: string;
    src: string;
}

interface DateNavigatorProps {
    baseDate: Date;
    setBaseDate: React.Dispatch<React.SetStateAction<Date>>;
}

interface CategoryDisplayProps {
    selectedCategory: CategoryKey;
    setSelectedCategory: React.Dispatch<React.SetStateAction<CategoryKey>>;
}

interface MenuDisplayProps {
    selectedCategory: CategoryKey;
}
//-----------------------------------

export default function MobileLacklack() {
    const [baseDate, setBaseDate] = useState(dayjs().toDate());
    const [selectedCategory, setSelectedCategory] = useState<CategoryKey>('stew')

    // 첫 번째 카테고리 이미지 프리로딩
    useEffect(() => {
        const preloadImages = [
            "../lacklack_01.webp",
            "../lacklack_02.webp",
            "../lacklack_03.webp",
            "../lacklack_04.webp",
            "../lacklack_05.webp",
            "../lacklack_06.webp"
        ];

        preloadImages.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }, []);

    return (
        <div className="bg-[#F8F4F1] p-5 min-w-72 min-h-screen">
            <DateNevigator baseDate={baseDate} setBaseDate={setBaseDate} />
            <CategoryDisplay selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
            <MenuDisplay selectedCategory={selectedCategory} />
        </div>
    )
}

//-----------------------------🔥DateNeviagtor🔥-----------------------------
//화살표로 빠르게 주(week) 이동하는 Component
function DateNevigator({ baseDate, setBaseDate }: DateNavigatorProps) {
    const { t, i18n } = useTranslation();
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

function CategoryDisplay({ selectedCategory, setSelectedCategory }: CategoryDisplayProps) {
    const { t } = useTranslation();
    const categories: Array<{ key: CategoryKey; label: string }> = [
        { key: 'stew', label: t('lacklack.categories.stew') },
        { key: 'pork', label: t('lacklack.categories.pork') },
        { key: 'beverage', label: t('lacklack.categories.beverage') },
        { key: 'special', label: t('lacklack.categories.special') }
    ];

    return (
        <div className="border-1 border-[#B7B7B7] rounded-xl w-full mb-10">
            <div className="grid grid-cols-2">
                {categories.map((category) => (
                    <div key={category.key} className={`text-center p-2 rounded-xl hover:cursor-pointer font-medium transition duration-300
                    ${selectedCategory === category.key ? "text-white bg-[#FF904C]" : "text-gray-500"}`}
                        onClick={() => setSelectedCategory(category.key)}>
                        {category.label}
                    </div>
                ))}
            </div>
        </div>
    )
}

function MenuDisplay({ selectedCategory }: MenuDisplayProps) {
    const { t, i18n } = useTranslation();
    const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

    const allMenuData: LacklackMenuItem[] = [
        { category: 'stew', nameKey: 'kimchiStew', name_ko: "김치찌개", name_en: "Kimchi Stew", price: "5,000", src: "../lacklack_01.webp" },
        { category: 'stew', nameKey: 'kimchiStewRamen', name_ko: "김치찌개+라면사리", name_en: "Kimchi Stew + Ramen", price: "5,500", src: "../lacklack_02.webp" },
        { category: 'stew', nameKey: 'zucchiniStew', name_ko: "애호박찌개", name_en: "Zucchini Stew", price: "5,000", src: "../lacklack_03.webp" },
        { category: 'stew', nameKey: 'zucchiniStewRamen', name_ko: "애호박찌개+라면사리", name_en: "Zucchini Stew + Ramen", price: "5,000", src: "../lacklack_04.webp" },
        { category: 'stew', nameKey: 'mushroomBulgogi', name_ko: "버섯불고기", name_en: "Mushroom Bulgogi", price: "6,500", src: "../lacklack_05.webp" },
        { category: 'stew', nameKey: 'ramen', name_ko: "라면", name_en: "Ramen", price: "3,000", src: "../lacklack_06.webp" },
        { category: 'stew', nameKey: 'eggRamen', name_ko: "계란라면", name_en: "Egg Ramen", price: "3,500", src: "../lacklack_07.webp" },
        { category: 'stew', nameKey: 'cheeseRamen', name_ko: "치즈라면", name_en: "Cheese Ramen", price: "3,500", src: "../lacklack_08.webp" },
        { category: 'pork', nameKey: 'cheesePork', name_ko: "치즈돈가스", name_en: "Cheese Pork Cutlet", price: "6,500", src: "../lacklack_09.webp" },
        { category: 'pork', nameKey: 'chickenCutlet', name_ko: "치킨가스", name_en: "Chicken Cutlet", price: "5,500", src: "../lacklack_10.webp" },
        { category: 'pork', nameKey: 'bibimbap', name_ko: "웰빙비빔밥", name_en: "Wellbeing Bibimbap", price: "5,000", src: "../lacklack_11.webp" },
        { category: 'pork', nameKey: 'spicyPork', name_ko: "제육덮밥", name_en: "Spicy Pork Rice Bowl", price: "6,000", src: "../lacklack_12.webp" },
        { category: 'pork', nameKey: 'kimchiFried', name_ko: "김치볶음밥", name_en: "Kimchi Fried Rice", price: "5,000", src: "../lacklack_13.webp" },
        { category: 'pork', nameKey: 'veggieFried', name_ko: "야채볶음밥", name_en: "Vegetable Fried Rice", price: "5,000", src: "../lacklack_14.webp" },
        { category: 'pork', nameKey: 'omurice', name_ko: "오므라이스", name_en: "Omurice", price: "5,000", src: "../lacklack_15.webp" },
        { category: 'pork', nameKey: 'tunaRice', name_ko: "참치컵밥", name_en: "Tuna Cup Rice", price: "5,000", src: "../lacklack_16.webp" },
        { category: 'beverage', nameKey: 'cola', name_ko: "콜라", name_en: "Coke", price: "1,200", src: "../lacklack_17.webp" },
        { category: 'beverage', nameKey: 'sprite', name_ko: "스프라이트", name_en: "Sprite", price: "1,200", src: "../lacklack_18.webp" },
        { category: 'beverage', nameKey: 'fanta', name_ko: "환타", name_en: "Fanta", price: "1,500", src: "../lacklack_19.webp" },
    ];

    const menuData = allMenuData.filter(item => item.category === selectedCategory);

    // 메뉴 아이템 이름 표시 함수 (i18n with fallback)
    const getMenuItemName = (item: LacklackMenuItem) => {
        // 1순위: i18n 번역
        const translationKey = `lacklack.items.${item.nameKey}`;
        if (i18n.exists(translationKey)) {
            return t(translationKey);
        }

        // 2순위: 언어별 필드 fallback
        if (i18n.language === 'en' && item.name_en) {
            return item.name_en;
        }

        // 3순위: 기본 한글
        return item.name_ko;
    };

    const handleImageLoad = (src: string) => {
        setLoadedImages(prev => new Set([...prev, src]));
    };

    return (
        <div className="border-t-1 border-[#B7B7B7]">
            <h1 className="font-medium text-xl my-4">{t('lacklack.title')} {t(`lacklack.categories.${selectedCategory}`)}</h1>
            <div className="grid grid-cols-1 [@media(min-width:380px)]:grid-cols-2 gap-4">
                {menuData.map((item) => (
                    <div key={item.nameKey} className="border border-[#B7B7B7] rounded-[10px] shadow-xl p-2">
                        <div className="w-full h-50 [@media(min-width:380px)]:h-40 relative">
                            {!loadedImages.has(item.src) && <ImageSpinner />}
                            <img
                                src={item.src}
                                loading="lazy"
                                alt={getMenuItemName(item)}
                                onLoad={() => handleImageLoad(item.src)}
                                className={`w-full h-full rounded-xl ${selectedCategory === 'beverage' ? "object-contain" : "object-cover"} ${!loadedImages.has(item.src) ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'}`}
                            />
                        </div>
                        <div className="mt-2 font-bold">{getMenuItemName(item)}</div>
                        <div className="text-sm text-gray-500">{item.price}{t('currency.won')}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}