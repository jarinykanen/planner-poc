import { Container, Skeleton } from "@mantine/core";
import dayjs from "dayjs";
import dayjsLocale from "dayjs/locale/fi";
import { useRef } from "react";
import { EventItem, Scheduler, SchedulerData, View, ViewType } from "react-big-schedule";
import "react-big-schedule/dist/css/style.css";
import { Project } from "../types";

interface Props {
  projects: Project[];
}

const ChartView = ({projects}: Props) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const schedulerData = new SchedulerData(dayjs().format("DD.MM.YYYY"), ViewType.Month);

  schedulerData.setSchedulerLocale(dayjsLocale);
  schedulerData.setCalendarPopoverLocale("fi_FI");

  schedulerData.setResources([
    { id: 'r0', name: 'Project 1', groupOnly: true },
    { id: 'r1', name: 'Phase 1', parentId: 'r0' },
    { id: 'r2', name: 'Phase 2', parentId: 'r0' },
    { id: 'r3', name: 'Phase 3', parentId: 'r0' },
  ]);
  schedulerData.config.dragAndDropEnabled = false;
  schedulerData.startDate = dayjs(new Date()).format("DD.MM.YYYY")
  schedulerData.config.responsiveByParent = true;
  // schedulerData.config.schedulerWidth = "100%";

  // the event array should be sorted in ascending order by event.start property
  // otherwise there will be some rendering errors
  schedulerData.setEvents([
    {
      id: 1,
      start: '2025-03-18 09:30:00',
      end: '2025-03-30 23:30:00',
      resourceId: 'r1',
      title: 'Testi',
      bgColor: 'red',
    },
    {
      id: 2,
      start: '2025-03-18 09:30:00',
      end: '2025-03-30 23:30:00',
      resourceId: 'r1',
      title: 'Test 2',
      bgColor: 'green',
    }
  ]);

  const onChangeViewType = (_: SchedulerData<EventItem>, view: View) => {
    schedulerData.setViewType(view.viewType);
  }

  if (!schedulerData) return <Skeleton height={500} />;

  return (
    <Container ref={parentRef} fluid p={0} flex={1} w="100%">
      <Scheduler
        parentRef={parentRef}
        moveEvent={() => console.log('moveEvent')}
        schedulerData={schedulerData}
        prevClick={() => console.log('prevClick')}
        nextClick={() => console.log('nextClick')}
        onSelectDate={() => console.log('onSelectDate')}
        onViewChange={onChangeViewType}
        eventItemClick={() => console.log('eventItemClick')}
      />
    </Container>
  );
}

export default ChartView;