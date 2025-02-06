import { Button, Group, Stack, Text, Title } from "@mantine/core";
import dayjs from "dayjs";
import { useAtom } from "jotai";
import { EventItem, Resource } from "react-big-schedule";
import { projectTimesAtom } from "../atoms/project-times";
import { projectsAtom } from "../atoms/projects";

interface Props {
  event: EventItem;
  title: string;
  start: dayjs.Dayjs;
  end: dayjs.Dayjs;
  statusColor: string;
  resource?: Resource;
}

const ChartPopOver = ({ event, title, start, end, resource }: Props) => {
  const [projectTimes, setProjectTimes] = useAtom(projectTimesAtom);
  const [projects, setProjects] = useAtom(projectsAtom);

  const onDeleteClick = () => {
    const projectTimeToDelete = projectTimes.find((time) => time.id === event.id);
    if (!projectTimeToDelete) return;
    setProjectTimes((times) => times.filter((time) => time.id !== event.id));

    const { start, end } = projectTimeToDelete;
    const numberOfFullDays = dayjs(end).diff(dayjs(start), "days") + 1;
    const project = projects.find(project => project.id === projectTimeToDelete.resourceId);
    if (project) {
      const updatedProject = { ...project, allocatedHours: project.allocatedHours - numberOfFullDays * 8 };
      setProjects((projects) => projects.map((project) => project.id === updatedProject.id ? updatedProject : project));
    }
  };

  return (
    <Stack w={500}>
      <Title order={2}>{title}</Title>
      <Text>{resource?.name}</Text>
      <Group>
        <Text>Alkaa: {start.format("DD.MM.YYYY")}</Text>
        <Text>Päättyy: {end.format("DD.MM.YYYY")}</Text>
      </Group>
      <Group>
        <Button
          size="xs"
          variant="filled"
          bg="red"
          onClick={onDeleteClick}
        >
          Poista
        </Button>
      </Group>
    </Stack>
  );
};

export default ChartPopOver;