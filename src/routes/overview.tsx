import { createFileRoute } from '@tanstack/react-router'
import ChartView from '../components/chart';
import { demoProjects } from '../types';
import { Container, Flex } from '@mantine/core';

export const Route = createFileRoute('/overview')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Container fluid p={0} flex={1} w="100%">
      <ChartView
        projects={demoProjects}
      />
    </Container>
  );
}
