import { Container } from '@mantine/core';
import { createFileRoute } from '@tanstack/react-router';
import ChartView from '../components/chart';
import { demoPeople, demoPhases, demoProjects, demoProjectTimes } from '../types';

export const Route = createFileRoute('/overview')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Container fluid p={0} flex={1} w="100%">
      <ChartView
        projects={demoProjects}
        people={demoPeople}
        projectTimes={demoProjectTimes}
        phases={demoPhases}
      />
    </Container>
  );
}
