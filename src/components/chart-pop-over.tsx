import { Button, Group, Stack, Text, Title } from "@mantine/core";
import dayjs from "dayjs";
import { EventItem, Resource } from "react-big-schedule";

interface Props {
  event: EventItem;
  title: string;
  start: dayjs.Dayjs;
  end: dayjs.Dayjs;
  statusColor: string;
  resource?: Resource;
  onDeleteClick: (event: EventItem) => void;
}

const ChartPopOver = ({ event, title, start, end, resource, onDeleteClick }: Props) => {
  return (
    <Stack w={500}>
      <Title order={2}>{title}</Title>
      <Text>{resource?.name}</Text>
      <Group>
        <Text>Alkaa: {start.format("DD.MM.YYYY HH:mm")}</Text>
        <Text>Päättyy: {end.format("DD.MM.YYYY HH:mm")}</Text>
      </Group>
      <Group>
        <Button
          size="xs"
          variant="filled"
          bg="red"
          onClick={() => onDeleteClick(event)}
        >
          Poista
        </Button>
      </Group>
    </Stack>
  );
};

export default ChartPopOver;