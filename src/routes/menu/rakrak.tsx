import { createFileRoute } from '@tanstack/react-router'
import { useState } from "react";

export const Route = createFileRoute('/menu/rakrak')({
  component: RouteComponent,
})

interface SidebarProps{
    selectedCategory: string;
    setSelectedCategory: (category: string) => void;
}
interface CategoryProps{
    selectedCategory: string;
}

function Sidebar({selectedCategory, setSelectedCategory}: SidebarProps){
    const categories = ["찌개 / 라면", "돈가스 / 밥", "음료수", "도너츠", "특별메뉴"]
    
    return(
        <div className="w-[268px] shadow-xl">
            <div className="py-15 flex flex-col items-center justify-center gap-4">
                {categories.map(cat => (
                    <div
                    key={cat}
                    className={`w-[228px] h-10 flex items-center rounded-[8px] px-5 shadow-lg font-bold transition
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

function Category({selectedCategory}:CategoryProps){
    const allMenuData = [
        {category:"찌개 / 라면", name:"김치찌개", price:"5,000"},
        {category:"찌개 / 라면", name:"김치찌개+라면사리", price:"5,500"},
        {category:"찌개 / 라면", name:"애호박찌개", price:"5,000"},
        {category:"찌개 / 라면", name:"애호박찌개+라면사리", price:"5,000"},
        {category:"찌개 / 라면", name:"버섯불고기", price:"6,500"},
        {category:"찌개 / 라면", name:"라면", price:"3,000"},
        {category:"찌개 / 라면", name:"계란라면", price:"3,500"},
        {category:"찌개 / 라면", name:"치즈라면", price:"3,500"},
        {category:"돈가스 / 밥", name:"치즈돈가스", price:"6,500"},
        {category:"돈가스 / 밥", name:"치킨가스", price:"5,500"},
        {category:"돈가스 / 밥", name:"웰빙비빔밥", price:"5,000"},
        {category:"돈가스 / 밥", name:"제육덮밥", price:"6,000"},
        {category:"돈가스 / 밥", name:"김치볶음밥", price:"5,000"},
        {category:"돈가스 / 밥", name:"야채볶음밥", price:"5,000"},
        {category:"돈가스 / 밥", name:"오므라이스", price:"5,000"},
        {category:"돈가스 / 밥", name:"참치컵밥", price:"5,000"},
        {category:"음료수", name:"콜라", price:"1,200"},
        {category:"음료수", name:"스프라이트", price:"1,200"},
        {category:"음료수", name:"환타", price:"1,500"},
    ]

    const menuData = allMenuData.filter(item => item.category === selectedCategory)
    return(
       <div className="mx-15 my-10 flex-1">
            <h1 className="font-bold text-[25px]">락락 메뉴 &gt; {selectedCategory}</h1>
            <div className="my-[29px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
                {menuData.map((item, index) => (
                    <div key={index} className="border border-[#B7B7B7] rounded-[10px] shadow-xl p-4">
                        <div className="aspect-video bg-gray-100"></div>
                        <div className="mt-2 font-bold">{item.name}</div>
                        <div className="text-sm text-gray-500">{item.price}원</div>
                    </div>
                ))}
            </div>
        </div>
    )
}

function RouteComponent() {
    const [selectedCategory, setSelectedCategory] = useState("찌개 / 라면")
    
    return(
        <div className="flex h-screen">
         <Sidebar selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}/>
         <Category selectedCategory={selectedCategory} />
        </div>
  )
}
