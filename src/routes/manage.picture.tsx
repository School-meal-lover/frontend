import { createFileRoute } from '@tanstack/react-router'
import ManagePicturePage from '../components/Manage/ManagePicturePage'

export const Route = createFileRoute('/manage/picture')({
  component: ManagePicturePage,
})
