import { createFileRoute } from '@tanstack/react-router'
import UploadPage from '../components/Upload/UploadPage'

export const Route = createFileRoute('/manage/upload')({
  component: UploadPage,
})
