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
    <AppShell.Header>
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
              <Tabs.Tab value={`/planner-poc/overview`}>Overview</Tabs.Tab>
              <Tabs.Tab value={`/planner-poc/projects`}>Projects</Tabs.Tab>
              <Tabs.Tab value={`/planner-poc/workers`}>Workers</Tabs.Tab>
            </Tabs.List>
          </Tabs>
        </Group>
      </Group>
    </AppShell.Header>
  );
};

export default TopBar;
