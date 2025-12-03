import { createFileRoute } from '@tanstack/react-router'
import ManageSoldoutPage from '../components/Manage/ManageSoldoutPage'

export const Route = createFileRoute('/manage/soldout')({
    component: ManageSoldoutPage,
})
