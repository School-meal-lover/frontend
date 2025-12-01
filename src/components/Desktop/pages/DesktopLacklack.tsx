import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

// 개별 이미지 스피너 컴포넌트
const ImageSpinner = () => (
    <div className="absolute inset-0 flex justify-center items-center bg-gray-100 rounded-xl">
        <div className="w-10 h-10 border-3 border-gray-300 border-t-[#FF904C] rounded-full animate-spin"></div>
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

interface SidebarProps {
    selectedCategory: CategoryKey;
    setSelectedCategory: (category: CategoryKey) => void;
}
interface CategoryProps {
    selectedCategory: CategoryKey;
}
//-----------------------------------

function Sidebar({ selectedCategory, setSelectedCategory }: SidebarProps) {
    const { t } = useTranslation();
    const categories: Array<{ key: CategoryKey; label: string }> = [
        { key: 'stew', label: t('lacklack.categories.stew') },
        { key: 'pork', label: t('lacklack.categories.pork') },
        { key: 'beverage', label: t('lacklack.categories.beverage') },
        { key: 'special', label: t('lacklack.categories.special') }
    ];

    return (
        <div className="w-[268px] shadow">
            <div className="py-15 flex flex-col items-center justify-center gap-4">
                {categories.map(cat => (
                    <div
                        key={cat.key}
                        className={`w-[228px] h-10 flex items-center rounded-[8px] px-5 shadow-lg font-bold transition hover:cursor-pointer
                        ${selectedCategory === cat.key
                                ? "bg-[#FF8940] text-white shadow-lg"
                                : "text-[#252525] hover:bg-[#FF8940] hover:text-white"
                            }`}
                        onClick={() => setSelectedCategory(cat.key)}
                    >
                        {cat.label}
                    </div>
                ))}
            </div>
        </div>
    )
}

function Category({ selectedCategory }: CategoryProps) {
    const { t, i18n } = useTranslation();
    const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

    const allMenuData: LacklackMenuItem[] = [
        { category: 'stew', nameKey: 'kimchiStew', name_ko: "김치찌개", name_en: "Kimchi Stew", price: "5,000", src: "../lacklack_01.webp" },
        { category: 'stew', nameKey: 'kimchiStewRamen', name_ko: "김치찌개+라면사리", name_en: "Kimchi Stew + Ramen", price: "5,500", src: "../lacklack_02.webp" },
        { category: 'stew', nameKey: 'zucchiniStew', name_ko: "애호박찌개", name_en: "Zucchini Stew", price: "5,000", src: "../lacklack_03.webp" },
        { category: 'stew', nameKey: 'zucchiniStewRamen', name_ko: "애호박찌개+라면사리", name_en: "Zucchini Stew + Ramen", price: "5,500", src: "../lacklack_04.webp" },
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
        <div className="px-15 py-10 flex-1 bg-[#F8F4F1]">
            <h1 className="font-bold text-[25px]">{t('lacklack.title')} {t(`lacklack.categories.${selectedCategory}`)}</h1>
            <div className="my-[30px] grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                {menuData.map((item, index) => (
                    <div key={index} className="border border-[#B7B7B7] rounded-xl shadow-xl p-4">
                        <div className="w-full h-60 relative">
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

export default function DesktopLacklack() {
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
        <div className="flex min-h-screen">
            <Sidebar selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
            <Category selectedCategory={selectedCategory} />
        </div>
    )
};