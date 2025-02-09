import { AppShell, Group, Tabs } from "@mantine/core";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import navTabClasses from "../styles/navtabs.module.css";
const TopBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [currentTab, setCurrentTab] = useState("");

  useEffect(() => {
    if (currentTab !== location.pathname) {
      setCurrentTab(location.pathname);
    }
  }, [location, currentTab]);

  const onTabChange = (value: string) => {
    setCurrentTab(value);
    navigate({ to: value });
  };

  return (
    <AppShell.Header bg="#1d1f25">
      <Group h="100%" justify="space-between" ml="md" mr="md">
        <Group justify="flex-end" h="100%">
          <Tabs
            variant="unstyled"
            value={currentTab}
            h="100%"
            classNames={navTabClasses}
            onChange={(value) => value && onTabChange(value)}
          >
            <Tabs.List h="100%">
              <Tabs.Tab value={`/planner-poc/overview`}>Yleiskatsaus</Tabs.Tab>
              <Tabs.Tab value={`/planner-poc/projects`}>Projekti</Tabs.Tab>
              <Tabs.Tab value={`/planner-poc/workers`}>Työntekijät</Tabs.Tab>
              <Tabs.Tab value={`/planner-poc/workspaces`}>Työtilat</Tabs.Tab>
              <Tabs.Tab value={`/planner-poc/phases`}>Työvaiheet</Tabs.Tab>
            </Tabs.List>
          </Tabs>
        </Group>
      </Group>
    </AppShell.Header>
  );
};

export default TopBar;
