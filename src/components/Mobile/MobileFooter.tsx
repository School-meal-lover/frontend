import { Link } from "@tanstack/react-router";

const MobileFooter = () => {
  return (
    <footer className="bg-orange-400 text-white">
      <div className="px-4 py-6">
        {/* 브랜드 정보 */}
        <div className="text-center mb-6">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg inline-block min-w-[150px] text-center py-3 px-4 mb-4">
            <img className="h-8 w-auto mx-auto" alt="꼬르륵 로고" src="/Frame 40.svg" />
          </div>
          <p className="text-orange-100 text-sm font-medium mb-4">오늘의 학식, 똑똑하게 선택하다</p>
          
          {/* 소셜 미디어 아이콘 */}
          <div className="flex justify-center space-x-4 mb-4">
            <a href="https://github.com/School-meal-lover" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity cursor-pointer">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            <a href="mailto:grrrrgist@gmail.com" className="hover:opacity-80 transition-opacity cursor-pointer">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.904.732-1.636 1.636-1.636h.91L12 10.09l9.455-6.27h.909c.904 0 1.636.732 1.636 1.636z"/>
                </svg>
              </div>
            </a>
          </div>
        </div>

        {/* 링크 섹션 */}
        <div className="space-y-4 mb-6">
          {/* 소개 */}
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <h4 className="text-white font-semibold mb-4 flex items-center text-sm">
              <span className="w-1 h-3 bg-white rounded-full mr-2"></span>
              소개
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="mailto:grrrrgist@gmail.com" className="text-orange-100 hover:text-white text-xs transition-colors">
                  버그 제보
                </a>
              </li>
              <li>
                <a href="https://www.gist.ac.kr/kr/html/sub05/050305.html" target="_blank" rel="noopener noreferrer" className="text-orange-100 hover:text-white text-xs transition-colors">
                  GIST 편의시설
                </a>
              </li>
            </ul>
          </div>

          {/* 바로가기 */}
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <h4 className="text-white font-semibold mb-4 flex items-center text-sm">
              <span className="w-1 h-3 bg-white rounded-full mr-2"></span>
              바로가기
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="https://sportal.gist.ac.kr/" target="_blank" rel="noopener noreferrer" className="text-orange-100 hover:text-white text-xs transition-colors">
                  GIST 포털
                </a>
              </li>
              <li>
                <a href="https://www.gist.ac.kr" target="_blank" rel="noopener noreferrer" className="text-orange-100 hover:text-white text-xs transition-colors">
                  GIST 홈페이지
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* 저작권 정보 */}
        <div className="text-center border-t border-white/20 pt-4">
          <p className="text-orange-100 text-xs">ⓒ 2024. 꼬르륵 all rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default MobileFooter;
