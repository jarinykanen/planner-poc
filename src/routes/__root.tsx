import { AppShell } from '@mantine/core';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import TopBar from '../components/topbar';

const RootLayout = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <AppShell
        header={{ height: 60 }}
        padding="md"
      >
        <TopBar />
        <AppShell.Main>
          <Outlet />
        </AppShell.Main>
      </AppShell>
    </DndProvider>

  );
}

export const Route = createRootRoute({
  component: RootLayout,
});