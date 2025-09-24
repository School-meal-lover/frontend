export default function DesktopIntroduce() {
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
        <div className="bg-[#F8F4F1] min-h-screen py-12 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
            <div className="max-w-5xl mx-auto">
                {/* 제목 섹션 */}
                <div className="text-center mb-8 md:mb-12">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 md:mb-4">Team 학사모</h1>
                    <p className="text-sm sm:text-base md:text-lg text-gray-600">꼬르륵 프로젝트를 함께 만들어가는 팀원들을 소개합니다.</p>
                </div>

                {/* 팀원 그리드 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {teamMembers.map((member) => (
                        <div 
                            key={member.id}
                            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                        >
                            {/* 사진 영역 */}
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
                            
                            {/* 소개 영역 */}
                            <div className="p-6 flex flex-col justify-center">
                                <h3 className="text-xl font-bold text-gray-800 mb-2">{member.name}</h3>
                                <p className="text-orange-400 font-medium mb-2">{member.role}</p>
                                <p className="text-gray-600 text-sm leading-relaxed">{member.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}