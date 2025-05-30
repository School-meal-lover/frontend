import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/menu/rakrak')({
  component: RouteComponent,
})

function Sidebar(){
    return(
        <div className="w-[268px] shadow-xl">
            <div className="py-15 flex flex-col items-center justify-center gap-4">
                <div className="bg-[#FF8940] w-[228px] h-10 flex items-center rounded-[8px] text-white px-5 shadow-lg font-bold">
                    카테고리
                </div>
                <div className="w-[228px] h-10 flex items-center rounded-[8px] text-[#252525] px-5 font-bold">
                    카테고리
                </div>
                <div className="w-[228px] h-10 flex items-center rounded-[8px] text-[#252525] px-5 font-bold">
                    카테고리
                </div>
                <div className="w-[228px] h-10 flex items-center rounded-[8px] text-[#252525] px-5 font-bold">
                    카테고리
                </div>
                <div className="w-[228px] h-10 flex items-center rounded-[8px] text-[#252525] px-5 font-bold">
                    카테고리
                </div>
            </div>
        </div>
    )
}

function Category(){
    const menuData = [
        {name: "김치찌개", price: "5,000원"},
        {name: "김치찌개", price: "5,000원"},
        {name: "김치찌개", price: "5,000원"},
        {name: "김치찌개", price: "5,000원"},
        {name: "김치찌개", price: "5,000원"},
        {name: "김치찌개", price: "5,000원"},
        {name: "김치찌개", price: "5,000원"},
        {name: "김치찌개", price: "5,000원"},
        {name: "김치찌개", price: "5,000원"},
        {name: "김치찌개", price: "5,000원"},
        {name: "김치찌개", price: "5,000원"},
        {name: "김치찌개", price: "5,000원"},
    ]
    return(
       <div className="mx-15 my-10 flex-1">
            <h1 className="font-bold text-[25px]">락락 메뉴 &gt; 카테고리</h1>
            <div className="my-[29px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
                {menuData.map((item, index) => (
                    <div key={index} className="border border-[#B7B7B7] rounded-[10px] shadow-xl p-4">
                        <div className="aspect-video bg-gray-100"></div>
                        <div className="mt-2 font-bold">{item.name}</div>
                        <div className="text-sm text-gray-500">{item.price}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}

function RouteComponent() {
  return(
    <div className="flex h-screen">
        <Sidebar />
        <Category />
    </div>
  )
}
