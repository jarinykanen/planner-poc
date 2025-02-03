import { AppShell, Burger, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'

const RootLayout = () => {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

  return (
    <DndProvider backend={HTML5Backend}>
      <AppShell
        header={{ height: 60 }}
        padding="md"
      >
        <AppShell.Header>
        </AppShell.Header>
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