import React, { useState, useRef } from 'react';
import axios from 'axios';
import Modal from './Modal';
import { useMediaQuery } from 'react-responsive';
import MobileFooter from '../Mobile/MobileFooter';
import DesktopFooter from '../Desktop/DesktopFooter';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  uploadTime: Date;
}

const UploadPage = () => {
  // 제1 학생식당 파일들
  const [firstRestaurantKoFile, setFirstRestaurantKoFile] = useState<UploadedFile | null>(null);
  const [firstRestaurantEnFile, setFirstRestaurantEnFile] = useState<UploadedFile | null>(null);
  
  // 제2 학생식당 파일들
  const [secondRestaurantKoFile, setSecondRestaurantKoFile] = useState<UploadedFile | null>(null);
  const [secondRestaurantEnFile, setSecondRestaurantEnFile] = useState<UploadedFile | null>(null);
  
  const [isUploading, setIsUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState<'success' | 'error'>('success');
  

  // 모바일 여부 확인(footer 추가 용도)
  const isMobile = useMediaQuery({ maxWidth: 639 });

  // 파일 유효성 검사
  const validateFile = (file: File): boolean => {
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel' // .xls
    ];
    return allowedTypes.includes(file.type);
  };

  // 파일 업로드 처리
  const handleFileUpload = (file: File, restaurant: 'first' | 'second', language: 'ko' | 'en') => {
    if (!validateFile(file)) {
      setModalMessage('엑셀 파일(.xlsx, .xls)만 업로드 가능합니다.');
      setModalType('error');
      setShowModal(true);
      return;
    }
    
    const uploadedFile: UploadedFile = {
      id: Math.random().toString(36).substring(2, 9),
      file,
      name: file.name,
      size: file.size,
      uploadTime: new Date()
    };

    if (restaurant === 'first') {
      if (language === 'ko') {
        setFirstRestaurantKoFile(uploadedFile);
      } else {
        setFirstRestaurantEnFile(uploadedFile);
      }
    } else {
      if (language === 'ko') {
        setSecondRestaurantKoFile(uploadedFile);
      } else {
        setSecondRestaurantEnFile(uploadedFile);
      }
    }
  };

  // 드래그 앤 드롭 처리
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, restaurant: 'first' | 'second', language: 'ko' | 'en') => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0], restaurant, language);
    }
  };

  // 파일 삭제
  const removeFile = (restaurant: 'first' | 'second', language: 'ko' | 'en') => {
    if (restaurant === 'first') {
      if (language === 'ko') {
        setFirstRestaurantKoFile(null);
      } else {
        setFirstRestaurantEnFile(null);
      }
    } else {
      if (language === 'ko') {
        setSecondRestaurantKoFile(null);
      } else {
        setSecondRestaurantEnFile(null);
      }
    }
  };

  // 파일 크기 포맷팅
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // 저장 버튼 클릭
  const handleSave = async () => {
    // 모든 필수 파일이 업로드되었는지 확인
    if (!firstRestaurantKoFile || !firstRestaurantEnFile || !secondRestaurantKoFile || !secondRestaurantEnFile) {
      setModalMessage('모든 식당의 한글/영어 파일을 업로드해주세요.');
      setModalType('error');
      setShowModal(true);
      return;
    }

    setIsUploading(true);
    
      try {
        // 제1 학생식당 파일 업로드(KOR/ENG)
        const formDataFirst = new FormData();
        formDataFirst.append('excel_ko', firstRestaurantKoFile.file);
        formDataFirst.append('excel_en', firstRestaurantEnFile.file);
        
        const responseFirst = await axios.post(`${API_BASE_URL}/upload/excel`, formDataFirst, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        // 제2 학생식당 파일 업로드(KOR/ENG)
        const formDataSecond = new FormData();
        formDataSecond.append('excel_ko', secondRestaurantKoFile.file);
        formDataSecond.append('excel_en', secondRestaurantEnFile.file);
        
        const responseSecond = await axios.post(`${API_BASE_URL}/upload/excel`, formDataSecond, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      
        // 성공 응답 확인
        if (responseFirst.data.success && responseSecond.data.success) {
          // 각 식당별 처리 결과 확인
          const firstKoSuccess = responseFirst.data.result_ko?.success;
          const firstEnSuccess = responseFirst.data.result_en?.success;
          const secondKoSuccess = responseSecond.data.result_ko?.success;
          const secondEnSuccess = responseSecond.data.result_en?.success;
          
          if (firstKoSuccess && firstEnSuccess && secondKoSuccess && secondEnSuccess) {
            // 모든 파일 처리 성공
            const totalMeals = (responseFirst.data.result_ko?.total_meals || 0) + 
                              (responseFirst.data.result_en?.total_meals || 0) +
                              (responseSecond.data.result_ko?.total_meals || 0) + 
                              (responseSecond.data.result_en?.total_meals || 0);
            
            setModalMessage(`🎉 업로드 완료!\n\n총 ${totalMeals}개 식사가 데이터베이스에 저장되었습니다 :)`);
            setModalType('success');
            setShowModal(true);
            
            // 성공 후 파일 목록 초기화
            setFirstRestaurantKoFile(null);
            setFirstRestaurantEnFile(null);
            setSecondRestaurantKoFile(null);
            setSecondRestaurantEnFile(null);
          } else {
            throw new Error('일부 파일 처리에 실패했습니다.');
          }
        } else {
          throw new Error('파일 업로드에 실패했습니다.');
        }
        
      } catch (error) {
        console.error('Upload error:', error);
        
        let errorMessage = '❌ 업로드 실패\n\n파일을 다시 확인하고 시도해주세요.\n문제가 지속되면 관리자에게 문의하세요.';
        
        if (axios.isAxiosError(error)) {
          if (error.response?.data?.error) {
            errorMessage = `❌ 업로드 실패\n\n${error.response.data.error}\n\n파일을 다시 확인하고 시도해주세요.`;
          } else if (error.response?.status === 500) {
            errorMessage = '❌ 서버 오류\n\n서버에 문제가 발생했습니다.\n잠시 후 다시 시도해주세요.';
          } else if (error.response?.status === 400) {
            errorMessage = '❌ 파일 형식 오류\n\n엑셀 파일(.xlsx, .xls)만 업로드 가능합니다.\n파일 형식을 확인해주세요.';
          } else if (error.response?.status === 413) {
            errorMessage = '❌ 파일 크기 초과\n\n파일 크기가 너무 큽니다.\n더 작은 파일로 시도해주세요.';
          }
        }
        
        setModalMessage(errorMessage);
        setModalType('error');
        setShowModal(true);
    } finally {
      setIsUploading(false);
    }
  };

  // 개별 파일 업로드 영역 컴포넌트
  const FileUploadArea = ({ 
    restaurant, 
    language, 
    file, 
    fileInputRef 
  }: { 
    restaurant: 'first' | 'second';
    language: 'ko' | 'en';
    file: UploadedFile | null;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
  }) => {
    const languageName = language === 'ko' ? '한글' : '영어';
    const languageColor = language === 'ko' ? 'border-blue-300 hover:border-blue-400' : 'border-green-300 hover:border-green-400';
    const languageIconColor = language === 'ko' ? 'text-blue-400' : 'text-green-400';
    
    return (
      <div className="w-full">
        <h4 className="text-lg font-semibold text-gray-700 mb-3">{languageName} 파일 *</h4>
        
        {/* 드래그 앤 드롭 영역 */}
        <div
          className={`border-2 border-dashed ${languageColor} rounded-lg p-6 text-center transition-colors cursor-pointer`}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, restaurant, language)}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="text-gray-600">
            <svg className={`mx-auto h-10 w-10 ${languageIconColor} mb-3`} stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="text-base font-medium">파일을 드래그하거나 클릭하여 업로드</p>
            <p className="text-sm text-gray-500 mt-1">엑셀 파일(.xlsx, .xls)만 지원</p>
          </div>
        </div>

        {/* 파일 입력 */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={(e) => e.target.files && e.target.files[0] && handleFileUpload(e.target.files[0], restaurant, language)}
          className="hidden"
        />

        {/* 업로드된 파일 표시 */}
        {file && (
          <div className="mt-3">
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              <div className="flex-1">
                <p className="font-medium text-gray-800">{file.name}</p>
                <p className="text-sm text-gray-500">
                  {formatFileSize(file.size)} • {file.uploadTime.toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => removeFile(restaurant, language)}
                className="text-red-500 hover:text-red-700 p-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // 식당별 업로드 영역 컴포넌트
  const RestaurantUploadArea = ({ 
    restaurant 
  }: { 
    restaurant: 'first' | 'second';
  }) => {
    const restaurantName = restaurant === 'first' ? '제1 학생식당' : '제2 학생식당';
    const koFile = restaurant === 'first' ? firstRestaurantKoFile : secondRestaurantKoFile;
    const enFile = restaurant === 'first' ? firstRestaurantEnFile : secondRestaurantEnFile;
    
    const koFileInputRef = useRef<HTMLInputElement>(null);
    const enFileInputRef = useRef<HTMLInputElement>(null);
    
    return (
      <div className="w-full max-w-4xl mx-auto">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">{restaurantName}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 한글 파일 업로드 */}
          <FileUploadArea
            restaurant={restaurant}
            language="ko"
            file={koFile}
            fileInputRef={koFileInputRef}
          />
          
          {/* 영어 파일 업로드 */}
          <FileUploadArea
            restaurant={restaurant}
            language="en"
            file={enFile}
            fileInputRef={enFileInputRef}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="relative bg-gradient-to-br from-[#F3E2D4] via-[#E6D1C2] to-[#D9C0B0] shadow-xl overflow-hidden">
        {/* 배경 장식 요소 */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-black/5"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/8 rounded-full -translate-y-32 translate-x-32 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#F3E2D4]/10 rounded-full translate-y-24 -translate-x-24 blur-xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="text-center">
            {/* 로고와 제목 */}
            <div className="flex items-center justify-center mb-6">
              <div className="relative group">
                <div className="absolute -inset-2 bg-white/20 rounded-full blur-sm group-hover:blur-md transition-all duration-300"></div>
                <img 
                  src="/GRRRR.svg" 
                  alt="GRRRR Logo" 
                  className="relative h-14 w-14 mr-6 drop-shadow-lg"
                />
              </div>
              <div className="relative">
                <h1 className="text-4xl font-bold text-white tracking-tight drop-shadow-lg">
                  GIST 학식 메뉴 등록 사이트
                </h1>
              </div>
            </div>
            
            {/* 서브 제목 */}
            <p className="text-xl text-[#8B4513] font-light tracking-wide mb-6">
              주간 식단표 엑셀 파일을 업로드해주세요 :)
            </p>
            
            {/* 구분선 */}
            <div className="flex items-center justify-center space-x-4">
              <div className="w-16 h-px bg-gradient-to-r from-transparent to-white/50"></div>
              <div className="w-2 h-2 bg-white/70 rounded-full"></div>
              <div className="w-16 h-px bg-gradient-to-l from-transparent to-white/50"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-16">
          {/* 제1 학생식당 */}
          <RestaurantUploadArea restaurant="first" />

          {/* 제2 학생식당 */}
          <RestaurantUploadArea restaurant="second" />

          {/* 저장 버튼 */}
          <div className="flex justify-center pt-8 mb-12">
            <button
              onClick={handleSave}
              disabled={isUploading || !firstRestaurantKoFile || !firstRestaurantEnFile || !secondRestaurantKoFile || !secondRestaurantEnFile}
              className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center space-x-2"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>업로드 중...</span>
                </>
              ) : (
                <span>저장</span>
              )}
            </button>
          </div>
        </div>
      </main>
      {isMobile && <MobileFooter />}
      {!isMobile && <DesktopFooter />}

      {/* Modal */}
      {showModal && (
        <Modal
          message={modalMessage}
          type={modalType}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default UploadPage;
