import { Button, ComboboxItem, Container, Group, Modal, Skeleton, Stack, Title } from "@mantine/core";
import dayjs from "dayjs";
import dayjsLocale from "dayjs/locale/fi";
import { useSetAtom } from "jotai";
import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { EventItem, Resource, Scheduler, SchedulerData, View, ViewType } from "react-big-schedule";
import "react-big-schedule/dist/css/style.css";
import { v4 as uuid } from "uuid";
import { projectTimesAtom } from "../atoms/project-times";
import { Phase, Project, ProjectTime, Worker } from "../types";
import ChartPopOver from "./chart-pop-over";
import DataGroup from "./generic/data-group";

let schedulerData: SchedulerData;

const initialState = {
  showScheduler: false,
  viewModel: {},
};

function reducer(state: any, action: { type: any; payload: any; }) {
  switch (action.type) {
    case 'INITIALIZE':
      return { showScheduler: true, viewModel: action.payload };
    case 'UPDATE_SCHEDULER':
      return { ...state, viewModel: action.payload };
    default:
      return state;
  }
}

interface Props {
  projects: Project[];
  workers: Worker[];
  projectTimes: ProjectTime[];
  phases: Phase[];
}

const ChartView = ({projects, workers, projectTimes, phases}: Props) => {
  const setProjectTimes = useSetAtom(projectTimesAtom);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [modalOpened, setModalOpened] = useState(false);
  const [pendingProjectTime, setPendingProjectTime] = useState<ProjectTime>();

  const parentRef = useRef<HTMLDivElement>(null);

  const workerOptions: ComboboxItem[] = useMemo(() => (
    workers.map((person) => ({ value: person.id || "", label: person.name }))
  ), [workers]);

  // useEffect(() => {
  //   setProjectTimes([]);
  // }, []);

  const createResources = useCallback(() => {
    const resources: Resource[] = projects.map((project) => {
      const projectId = project.id!;
      const phaseResources: Resource[] = project.phaseIds?.map((phaseId) => ({
        id: `${projectId}-${phaseId}`,
        name: phases.find(phase => phase.id === phaseId)?.name || '',
        parentId: projectId,
        groupOnly: false
      })) || [];

      const newResource: Resource = {
        id: projectId,
        name: project.name,
        parentId: 'root'
      };

      return [newResource, ...phaseResources];
    }).flat();

    return [
      { id: 'root', name: 'Projektit', groupOnly: true },
      ...resources,
    ];
  }, [projects, phases]);

  const createEvents = useCallback(() => {
    const events: EventItem[] = projectTimes.map((projectTime) => {
      return {
        id: projectTime.id,
        start: dayjs(projectTime.start).format("YYYY.MM.DD HH:mm:ss"),
        end: dayjs(projectTime.end).format("YYYY.MM.DD HH:mm:ss"),
        resourceId: projectTime.projectId,
        title: projectTime.title || "",
        bgColor: `#${projectTime.bgColor}`
      }
    });

    return events;
  }, [projectTimes]);

  useEffect(() => {
    if (schedulerData) {
      schedulerData.setEvents(createEvents());
      dispatch({ type: 'UPDATE_SCHEDULER', payload: schedulerData });
    }
  }, [projectTimes, createEvents]);

  useEffect(() => {
    schedulerData = new SchedulerData(dayjs().format("YYYY.MM.DD"), ViewType.Month);
    schedulerData.config.dragAndDropEnabled = true;
    schedulerData.config.responsiveByParent = true;
    schedulerData.setSchedulerLocale(dayjsLocale);
    schedulerData.setCalendarPopoverLocale("fi_FI");
    schedulerData.config.dayResourceTableWidth = 160;
    schedulerData.config.monthResourceTableWidth = 300;
    schedulerData.setResources(createResources());
    schedulerData.setEvents(createEvents());
    dispatch({ type: 'INITIALIZE', payload: schedulerData });
  }, [createEvents, createResources])

  const onMoveEvent = (schedulerData: SchedulerData<EventItem>, event: EventItem, slotId: string, slotName: string, start: string, end: string) => {
    const projectTime = projectTimes.find((projectTime) => projectTime.id === event.id);
    if (projectTime) {
      const updatedProjectTime = { ...projectTime, projectId: slotId, start, end };
      setProjectTimes((projectTimes) => projectTimes.map((projectTime) => projectTime.id === updatedProjectTime.id ? updatedProjectTime : projectTime));
    }
  };

  const onPrevClick = (_: SchedulerData) => {
    schedulerData.prev();
    schedulerData.setEvents(createEvents());
    dispatch({ type: 'UPDATE_SCHEDULER', payload: schedulerData });
  };

  const onNextClick = (_: SchedulerData) => {
    schedulerData.next();
    schedulerData.setEvents(createEvents());
    dispatch({ type: 'UPDATE_SCHEDULER', payload: schedulerData });
  };

  const onSelectDate = (_: SchedulerData<EventItem>, date: string) => {
    schedulerData.setDate(date);
    schedulerData.setResources(createResources());
    schedulerData.setEvents(createEvents());
  };

  const onChangeViewType = (_: SchedulerData<EventItem>, view: View) => {
    schedulerData.setViewType(view.viewType);
    schedulerData.setEvents(createEvents());
  }

  const onNewEventAdd = (schedulerData: SchedulerData<EventItem>, slotId: string, slotName: string, start: string, end: string, type: string, item: EventItem) => {
    setModalOpened(true);
      const newEvent: ProjectTime = {
        id: uuid(),
        projectId: slotId,
        title: "",
        start,
        end,
        resourceId: slotId,
        bgColor: "purple",
      };

    setPendingProjectTime(newEvent);
  };

  const onUpdateEventStart = (_: SchedulerData<EventItem>, event: EventItem, newStart: string) => {
    const projectTime = projectTimes.find((projectTime) => projectTime.id === event.id);
    if (projectTime) {
      const updatedProjectTime = { ...projectTime, start: newStart };
      setProjectTimes((projectTimes) => projectTimes.map((projectTime) => projectTime.id === updatedProjectTime.id ? updatedProjectTime : projectTime));
    }
  }

  const onUpdateEventEnd = (_: SchedulerData<EventItem>, event: EventItem, newEnd: string) => {
    const projectTime = projectTimes.find((projectTime) => projectTime.id === event.id);
    if (projectTime) {
      const updatedProjectTime = { ...projectTime, end: newEnd };
      setProjectTimes((projectTimes) => projectTimes.map((projectTime) => projectTime.id === updatedProjectTime.id ? updatedProjectTime : projectTime));
    }
  };

  const onToggleExpand = (_: SchedulerData<EventItem>, slotId: string) => {
    console.log("onToggleExpand", slotId, schedulerData.getSlots());
    const found = schedulerData.getSlots().find((slot) => slot.id === slotId);
    console.log("found", found);
    schedulerData.toggleExpandStatus(slotId);
    schedulerData.setEvents(createEvents());
  };

  if (!schedulerData || !state.showScheduler) return <Skeleton height={500} />;

  const onCloseModal = () => {
    setModalOpened(false);
  };

  const onConfirmProjectTime = () => {
    if (pendingProjectTime) {
      const worker = workers.find(worker => worker.id === pendingProjectTime.workerId);
      if (!worker) return
      const { name, color } = worker;
      setProjectTimes((projectTimes) => [...projectTimes, {...pendingProjectTime, title: name, bgColor: color }]);
      setModalOpened(false);
      setPendingProjectTime(undefined);
    }
  };

  const renderModalContent = () => (
    <Stack>
      <DataGroup
        edit
        column
        title="Työntekijä"
        inputType="select"
        onChange={(value) => pendingProjectTime && setPendingProjectTime({ ...pendingProjectTime, workerId: value as string })}
        selectProps={{
          selectValue: pendingProjectTime?.workerId,
          selectOptions: workerOptions
        }}
      />
    </Stack>
  );

  const renderModal = (title: string) => {
    return (
      <Modal
        zIndex={200}
        opened={modalOpened}
        onClose={onCloseModal}
        size="lg"
        closeOnClickOutside
        transitionProps={{ transition: "fade", duration: 200 }}
        withCloseButton={false}
      >
        <Stack p={8}>
          <Title order={3}>{title}</Title>
          {renderModalContent()}
          <Group p={16}>
            <Button onClick={onCloseModal} variant="light">
              Sulje
            </Button>
            <Button variant="filled" onClick={onConfirmProjectTime}>
              Tallenna
            </Button>
          </Group>
        </Stack>
      </Modal>
    );
  };

  const renderPopOver = (_: SchedulerData<EventItem>, event: EventItem, title: string, start: dayjs.Dayjs, end: dayjs.Dayjs, statusColor: string) => (
    <ChartPopOver
      event={event}
      title={title}
      start={start}
      end={end}
      statusColor={statusColor}
      resource={schedulerData.getSlots().find((slot) => slot.id === event.resourceId) as Resource}
    />
  );

  return (
    <Container ref={parentRef} fluid p={0} flex={1} w="100%">
      <Scheduler
        parentRef={parentRef}
        moveEvent={onMoveEvent}
        schedulerData={state.viewModel}
        prevClick={onPrevClick}
        nextClick={onNextClick}
        onSelectDate={onSelectDate}
        onViewChange={onChangeViewType}
        newEvent={onNewEventAdd}
        updateEventEnd={onUpdateEventEnd}
        updateEventStart={onUpdateEventStart}
        toggleExpandFunc={onToggleExpand}
        eventItemPopoverTemplateResolver={renderPopOver}
      />
      {renderModal("Lisää työaika")}
    </Container>
  );
}

export default ChartView;