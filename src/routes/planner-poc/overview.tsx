import { Container } from '@mantine/core'
import { createFileRoute } from '@tanstack/react-router'
import { useAtomValue } from 'jotai'
import { projectsAtom } from '../../atoms/projects'
import { workersAtom } from '../../atoms/workers'
import ChartView from '../../components/chart'
import { demoPhases } from '../../types'
import { projectTimesAtom } from '../../atoms/project-times'

export const Route = createFileRoute('/planner-poc/overview')({
  component: RouteComponent,
})

function RouteComponent() {
  const projects = useAtomValue(projectsAtom)
  const workers = useAtomValue(workersAtom)
  const projectTimes = useAtomValue(projectTimesAtom)

  return (
    <Container fluid p={0} flex={1} w="100%">
      <ChartView
        projects={projects}
        workers={workers}
        projectTimes={projectTimes}
        phases={demoPhases}
      />
    </Container>
  )
}
