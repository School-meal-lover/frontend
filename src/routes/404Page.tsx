import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/404Page')({
  component: RouteComponent,
})

function RouteComponent() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
            <p className="text-xl text-gray-600 mb-8">페이지를 찾을 수 없습니다</p>
            <a 
              href="/" 
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              홈으로 돌아가기
            </a>
          </div>
        </div>
    )
}
