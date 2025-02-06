import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: RouteComponent,
  beforeLoad: () => {
    redirect({ to: '/planner-poc/overview' })
  }
})

function RouteComponent() {
  return <div>Hello "/"!</div>
}
