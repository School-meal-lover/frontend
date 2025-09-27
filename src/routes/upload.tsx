import { createFileRoute, redirect } from '@tanstack/react-router'
import UploadPage from '../components/Upload/UploadPage'

// 업로드 페이지 접근 키 (8자리 랜덤 문자열)
const UPLOAD_ACCESS_KEY = import.meta.env.VITE_UPLOAD_ACCESS_KEY;

export const Route = createFileRoute('/upload')({
  beforeLoad: ({ search }) => {
    // key 파라미터가 없거나 틀리면 404로 리다이렉트
    const key = (search as any).key
    if (!key || key !== UPLOAD_ACCESS_KEY) {
      throw redirect({ to: '/404Page' })
    }
  },
  component: UploadPage,
})
