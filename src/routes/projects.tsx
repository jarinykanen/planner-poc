import { Table } from '@mantine/core';
import { createFileRoute } from '@tanstack/react-router'
import { demoProjects } from '../types';

export const Route = createFileRoute('/projects')({
  component: RouteComponent,
})

function RouteComponent() {
  const rows = demoProjects.map((element) => (
    <Table.Tr key={element.name}>
      <Table.Td>{element.id}</Table.Td>
      <Table.Td>{element.name}</Table.Td>
      <Table.Td>{element.start.toDateString()}</Table.Td>
      <Table.Td>{element.end.toDateString()}</Table.Td>
    </Table.Tr>
  ));

  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>ID</Table.Th>
          <Table.Th>Työnumero</Table.Th>
          <Table.Th>Alkaa</Table.Th>
          <Table.Th>Loppuu</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  );
}
