import { Button, Group, Stack, Text, Title } from "@mantine/core";
import dayjs from "dayjs";
import { useSetAtom } from "jotai";
import { EventItem, Resource } from "react-big-schedule";
import { projectTimesAtom } from "../atoms/project-times";

interface Props {
  event: EventItem;
  title: string;
  start: dayjs.Dayjs;
  end: dayjs.Dayjs;
  statusColor: string;
  resource?: Resource;
}

const ChartPopOver = ({ event, title, start, end, resource }: Props) => {
  const setProjectTimes = useSetAtom(projectTimesAtom);

  const onDeleteClick = () => {
    setProjectTimes((times) => times.filter((time) => time.id !== event.id));
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