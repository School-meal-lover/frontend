import React from 'react';
import { Link, useLocation } from '@tanstack/react-router';

interface ManageHeaderProps {
    bearerToken: string;
    onTokenChange: (token: string) => void;
}

const ManageHeader: React.FC<ManageHeaderProps> = ({ bearerToken, onTokenChange }) => {
    const location = useLocation();

    const tabs = [
        { name: '메뉴 등록', path: '/manage/upload' },
        { name: '메뉴 사진 추가', path: '/manage/picture' },
        { name: '매진 관리', path: '/manage/soldout' },
    ];

    return (
        <header className="relative bg-gradient-to-br from-[#F3E2D4] via-[#E6D1C2] to-[#D9C0B0] shadow-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-black/5"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/8 rounded-full -translate-y-32 translate-x-32 blur-2xl"></div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center mb-6">
                        <img src="/GRRRR.svg" alt="GRRRR Logo" className="h-14 w-14 mr-6 drop-shadow-lg" />
                        <h1 className="text-4xl font-bold text-white tracking-tight drop-shadow-lg">
                            학식 관리자 메뉴
                        </h1>
                    </div>
                    <p className="text-xl text-[#8B4513] font-light tracking-wide">
                        하단 마스터 토큰을 입력해야 적용할 수 있습니다.
                    </p>
                </div>

                {/* Navigation Tabs */}
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                    {tabs.map((tab) => (
                        <Link
                            key={tab.path}
                            to={tab.path}
                            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${location.pathname === tab.path
                                ? 'bg-white text-orange-600 shadow-lg'
                                : 'bg-white/30 text-white hover:bg-white/50 backdrop-blur-sm'
                                }`}
                        >
                            {tab.name}
                        </Link>
                    ))}
                </div>

                {/* Bearer Token Input */}
                <div className="max-w-2xl mx-auto">
                    <label className="block text-sm font-medium text-white mb-2 drop-shadow">
                        Bearer Token *
                    </label>
                    <input
                        type="password"
                        value={bearerToken}
                        onChange={(e) => onTokenChange(e.target.value)}
                        placeholder="인증 토큰을 입력하세요"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent shadow-sm"
                    />
                </div>
            </div>
        </header>
    );
};

export default ManageHeader;
