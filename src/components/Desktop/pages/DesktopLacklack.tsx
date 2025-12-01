import { useState, useEffect } from "react";

// 개별 이미지 스피너 컴포넌트
const ImageSpinner = () => (
    <div className="absolute inset-0 flex justify-center items-center bg-gray-100 rounded-xl">
        <div className="w-10 h-10 border-3 border-gray-300 border-t-[#FF904C] rounded-full animate-spin"></div>
    </div>
);

//🎯 interface 선언
//-----------------------------------
interface SidebarProps {
    selectedCategory: string;
    setSelectedCategory: (category: string) => void;
}
interface CategoryProps {
    selectedCategory: string;
}
//-----------------------------------

function Sidebar({ selectedCategory, setSelectedCategory }: SidebarProps) {
    const categories = ["찌개 / 라면", "돈가스 / 밥", "음료수", "특별메뉴"]

    return (
        <div className="w-[268px] shadow">
            <div className="py-15 flex flex-col items-center justify-center gap-4">
                {categories.map(cat => (
                    <div
                        key={cat}
                        className={`w-[228px] h-10 flex items-center rounded-[8px] px-5 shadow-lg font-bold transition hover:cursor-pointer
                        ${selectedCategory === cat
                                ? "bg-[#FF8940] text-white shadow-lg"
                                : "text-[#252525] hover:bg-[#FF8940] hover:text-white"
                            }`}
                        onClick={() => setSelectedCategory(cat)}
                    >
                        {cat}
                    </div>
                ))}
            </div>
        </div>
    )
}

function Category({ selectedCategory }: CategoryProps) {
    const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

    const allMenuData = [
        { category: "찌개 / 라면", name: "김치찌개", price: "5,000", src: "../lacklack_01.webp" },
        { category: "찌개 / 라면", name: "김치찌개+라면사리", price: "5,500", src: "../lacklack_02.webp" },
        { category: "찌개 / 라면", name: "애호박찌개", price: "5,000", src: "../lacklack_03.webp" },
        { category: "찌개 / 라면", name: "애호박찌개+라면사리", price: "5,500", src: "../lacklack_04.webp" },
        { category: "찌개 / 라면", name: "버섯불고기", price: "6,500", src: "../lacklack_05.webp" },
        { category: "찌개 / 라면", name: "라면", price: "3,000", src: "../lacklack_06.webp" },
        { category: "찌개 / 라면", name: "계란라면", price: "3,500", src: "../lacklack_07.webp" },
        { category: "찌개 / 라면", name: "치즈라면", price: "3,500", src: "../lacklack_08.webp" },
        { category: "돈가스 / 밥", name: "치즈돈가스", price: "6,500", src: "../lacklack_09.webp" },
        { category: "돈가스 / 밥", name: "치킨가스", price: "5,500", src: "../lacklack_10.webp" },
        { category: "돈가스 / 밥", name: "웰빙비빔밥", price: "5,000", src: "../lacklack_11.webp" },
        { category: "돈가스 / 밥", name: "제육덮밥", price: "6,000", src: "../lacklack_12.webp" },
        { category: "돈가스 / 밥", name: "김치볶음밥", price: "5,000", src: "../lacklack_13.webp" },
        { category: "돈가스 / 밥", name: "야채볶음밥", price: "5,000", src: "../lacklack_14.webp" },
        { category: "돈가스 / 밥", name: "오므라이스", price: "5,000", src: "../lacklack_15.webp" },
        { category: "돈가스 / 밥", name: "참치컵밥", price: "5,000", src: "../lacklack_16.webp" },
        { category: "음료수", name: "콜라", price: "1,200", src: "../lacklack_17.webp" },
        { category: "음료수", name: "스프라이트", price: "1,200", src: "../lacklack_18.webp" },
        { category: "음료수", name: "환타", price: "1,500", src: "../lacklack_19.webp" },
    ]

    const menuData = allMenuData.filter(item => item.category === selectedCategory)

    const handleImageLoad = (src: string) => {
        setLoadedImages(prev => new Set([...prev, src]));
    };

    return (
        <div className="px-15 py-10 flex-1 bg-[#F8F4F1]">
            <h1 className="font-bold text-[25px]">락락 메뉴 &gt; {selectedCategory}</h1>
            <div className="my-[30px] grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                {menuData.map((item, index) => (
                    <div key={index} className="border border-[#B7B7B7] rounded-xl shadow-xl p-4">
                        <div className="w-full h-60 relative">
                            {!loadedImages.has(item.src) && <ImageSpinner />}
                            <img
                                src={item.src}
                                loading="lazy"
                                alt={item.name}
                                onLoad={() => handleImageLoad(item.src)}
                                className={`w-full h-full rounded-xl ${selectedCategory === "음료수" ? "object-contain" : "object-cover"} ${!loadedImages.has(item.src) ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'}`}
                            />
                        </div>
                        <div className="mt-2 font-bold">{item.name}</div>
                        <div className="text-sm text-gray-500">{item.price}원</div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default function DesktopLacklack() {
    const [selectedCategory, setSelectedCategory] = useState("찌개 / 라면")

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