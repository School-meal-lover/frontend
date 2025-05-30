import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/menu/congestion')({
  component: RouteComponent,
})

function RouteComponent() {
  return(
    <div className="flex justify-center">
        <img src="../Frame 33.svg" />
    </div>
  )
}
