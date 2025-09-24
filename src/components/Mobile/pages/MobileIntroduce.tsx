export default function MobileIntroduce() {
    // 팀원 데이터 (예시)
    const teamMembers = [
        { id: 1, name: "최홍제", role: "Product Manager", description: "프로젝트 기획과 요구사항 분석, 팀 커뮤니케이션을 담당합니다.", src: "../introduce_01.webp"},
        { id: 2, name: "박시원", role: "Backend Developer", description: "데이터 처리 로직과 API 최적화, 보안 구현을 담당합니다.", src: "../introduce_02.webp" },
        { id: 3, name: "한세민", role: "Backend Developer", description: "API 설계와 데이터베이스 관리, 서버 인프라 구축을 담당합니다.", src: "../introduce_03.webp" },
        { id: 4, name: "박미솔", role: "Frontend Developer", description: "PWA 구현과 반응형 웹 디자인, 성능 최적화를 담당합니다.", src: "../introduce_04.webp" },
        { id: 5, name: "이준성", role: "Frontend Developer", description: "React와 TypeScript를 활용한 사용자 인터페이스 개발을 담당합니다.", src: "../introduce_05.webp" },
        { id: 6, name: "홍수아", role: "UX/UI Designer", description: "사용자 경험을 고려한 직관적인 디자인과 프로토타이핑을 담당합니다.", src: "../introduce_06.webp" }
    ];

    return (
        <div className="bg-[#F8F4F1] min-h-screen py-8 px-4">
            <div className="max-w-md mx-auto">
                {/* 제목 섹션 */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-800 mb-3">Team 학사모</h1>
                    <p className="text-sm text-gray-600">꼬르륵 프로젝트를 함께 만들어가는 팀원들을 소개합니다.</p>
                </div>

                {/* 팀원 그리드 - 모바일은 1열, 데스크톱 크기 유지 */}
                <div className="space-y-8">
                    {teamMembers.map((member) => (
                        <div 
                            key={member.id}
                            className="bg-white w-75 mx-auto rounded-lg shadow-lg overflow-hidden"
                        >
                            {/* 사진 영역 - 데스크톱과 동일한 크기 */}
                            <div className="relative w-full h-80 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                                <img 
                                    src={member.src} 
                                    alt={`${member.name} 프로필 사진`}
                                    className="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105"
                                    loading="lazy"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none';
                                        const fallback = target.nextElementSibling as HTMLElement;
                                        if (fallback) fallback.style.display = 'flex';
                                    }}
                                />
                                {/* 이미지 로딩 실패 시 대체 UI */}
                                <div className="absolute inset-0 hidden items-center justify-center bg-gray-200">
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-2">
                                            <span className="text-gray-500 text-xl font-semibold">
                                                {member.name.charAt(0)}
                                            </span>
                                        </div>
                                        <p className="text-gray-500 text-sm">이미지를 불러올 수 없습니다</p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* 소개 영역 - 데스크톱과 동일한 크기 */}
                            <div className="p-6 flex flex-col justify-center">
                                <h3 className="text-xl font-bold text-gray-800 mb-2">{member.name}</h3>
                                <p className="text-orange-400 font-medium mb-2">{member.role}</p>
                                <p className="text-gray-600 text-sm leading-relaxed">{member.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 구분선 */}
                <div className="border border-gray-300 mt-12"></div>

                {/* 개발 예정 기능 섹션 - 모바일용 */}
                <div className="mt-12">
                    <div className="text-center mb-8">
                        <h2 className="text-xl font-bold text-gray-800 mb-3">앞으로 추가될 기능들</h2>
                    </div>
                    
                    {/* 타임라인 - 모바일용 간소화 */}
                    <div className="relative">
                        {/* 세로 바 */}
                        <div className="absolute left-1 top-2 bottom-15 w-1 bg-orange-300"></div>
                        
                        {/* 기능들 */}
                        <div className="space-y-8">
                            {/* 기능 1 */}
                            <div className="relative flex items-start">
                                <div className="relative z-10 w-3 h-3 bg-orange-400 rounded-full mt-1"></div>
                                <div className="ml-6 flex-1">
                                    <div className="mb-2">
                                        <h3 className="text-base font-bold text-gray-800">혼잡도 페이지</h3>
                                        <span className="text-xs text-gray-600">2025.11.01 예정</span>
                                    </div>
                                    <p className="text-gray-600 text-xs">실시간 식당 혼잡도 정보를 제공할 예정입니다.</p>
                                </div>
                            </div>
                            
                            {/* 기능 2 */}
                            <div className="relative flex items-start">
                                <div className="relative z-10 w-3 h-3 bg-orange-400 rounded-full mt-1"></div>
                                <div className="ml-6 flex-1">
                                    <div className="mb-2">
                                        <h3 className="text-base font-bold text-gray-800">번역 기능</h3>
                                        <span className="text-xs text-gray-600">2025.11.15 예정</span>
                                    </div>
                                    <p className="text-gray-600 text-xs">다양한 언어로 메뉴명을 번역하여 제공합니다.</p>
                                </div>
                            </div>
                            
                            {/* 기능 3 */}
                            <div className="relative flex items-start">
                                <div className="relative z-10 w-3 h-3 bg-orange-400 rounded-full mt-1"></div>
                                <div className="ml-6 flex-1">
                                    <div className="mb-2">
                                        <h3 className="text-base font-bold text-gray-800">개인별 영양소 분석</h3>
                                        <span className="text-xs text-gray-600">2025.12.01 예정</span>
                                    </div>
                                    <p className="text-gray-600 text-xs">선택한 메뉴의 칼로리와 영양소를 분석해드립니다.</p>
                                </div>
                            </div>
                            
                            {/* 기능 4 */}
                            <div className="relative flex items-start">
                                <div className="relative z-10 w-3 h-3 bg-orange-400 rounded-full mt-1"></div>
                                <div className="ml-6 flex-1">
                                    <div className="mb-2">
                                        <h3 className="text-base font-bold text-gray-800">취향 기반 식단 추천</h3>
                                        <span className="text-xs text-gray-600">2025.12.15 예정</span>
                                    </div>
                                    <p className="text-gray-600 text-xs">개인 취향에 맞는 맞춤 식단을 추천해드립니다.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>       
            </div>
        </div>  
    );
}