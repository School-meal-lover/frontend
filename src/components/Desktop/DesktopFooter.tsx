const DesktopFooter = () => {
  return (
    <footer className="bg-orange-400 text-white">
      <div className="max-w-5xl mx-auto py-8">
        <div className="flex justify-between items-start">
          {/* 왼쪽: INFOTEAM */}
          <div className="flex-1 text-left pl-28 pr-20">
            <h1 className="text-4xl font-bold text-white mb-2">INFOTEAM</h1>
            <p className="text-orange-100 text-sm mb-4">지스트대학 총학생회 산하 정보국</p>
            
            {/* 소셜 미디어 아이콘 */}
            <div className="flex space-x-4 mb-4">
              <a href="https://github.com/gsainfoteam" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity cursor-pointer">
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
            <p className="text-orange-100 text-xs">ⓒ 2024. INFOTEAM all rights reserved.</p>
          </div>

          {/* 중간: 소개 */}
          <div className="flex-1 text-left px-12">
            <h4 className="text-white font-semibold mb-4">소개</h4>
            <ul className="space-y-3">
              <li>
                <a href="https://introduce.gistory.me/" target="_blank" rel="noopener noreferrer" className="text-orange-100 hover:text-white text-sm transition-colors">
                  인포팀 소개
                </a>
              </li>
              <li>
                <a href="mailto:grrrrgist@gmail.com" className="text-orange-100 hover:text-white text-sm transition-colors">
                  버그 제보
                </a>
              </li>
            </ul>
          </div>

          {/* 오른쪽: 바로가기 */}
          <div className="flex-1 text-left pl-0">
            <h4 className="text-white font-semibold mb-4">바로가기</h4>
            <ul className="space-y-3">
              <li>
                <a href="https://ziggle.gistory.me" target="_blank" rel="noopener noreferrer" className="text-orange-100 hover:text-white text-sm transition-colors">
                  Ziggle
                </a>
              </li>
              <li>
                <a href="https://www.gist.ac.kr" target="_blank" rel="noopener noreferrer" className="text-orange-100 hover:text-white text-sm transition-colors">
                  GIST 홈페이지
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default DesktopFooter;
