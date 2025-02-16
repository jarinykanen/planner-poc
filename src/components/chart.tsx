import { Box, Button, ComboboxItem, Container, Group, Modal, Skeleton, Stack, Title } from "@mantine/core";
import dayjs, { Dayjs } from "dayjs";
import dayjsLocale from "dayjs/locale/fi";
import { useAtomValue, useSetAtom } from "jotai";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { CellUnit, DATE_FORMAT, EventItem, Resource, Scheduler, SchedulerData, View, ViewType } from "react-big-schedule";
import "react-big-schedule/dist/css/style.css";
import { v4 as uuid } from "uuid";
import { projectTimesAtom } from "../atoms/project-times";
import { projectsAtom } from "../atoms/projects";
import { workspacesAtom } from "../atoms/workspaces";
import "../styles/scheduler.css";
import { Phase, Project, ProjectTime, Worker } from "../types";
import { calculateTotalHours } from "../utils/calculations";
import ChartPopOver from "./chart-pop-over";
import DataGroup from "./generic/data-group";

let schedulerData: SchedulerData;

const initialState = {
  showScheduler: false,
  viewModel: {},
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function reducer(state: any, action: { type: any; payload: any; }) {
  switch (action.type) {
    case "INITIALIZE":
      return { showScheduler: true, viewModel: action.payload };
    case "UPDATE_SCHEDULER":
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
  const setProjects = useSetAtom(projectsAtom);
  const workspaces = useAtomValue(workspacesAtom);

  const [mounted, setMounted] = useState(false);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [modalOpened, setModalOpened] = useState(false);
  const [pendingProjectTime, setPendingProjectTime] = useState<ProjectTime>();
  const [selectedWorkers, setSelectedWorkers] = useState<string[]>([]);

  const parentRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   setProjectTimes([]);
  // }, []);

  // useEffect(() => {
  //   if (schedulerData) {
  //     schedulerData.setResources(createResources());
  //     schedulerData.setEvents(createEvents());
  //     dispatch({ type: "UPDATE_SCHEDULER", payload: schedulerData });
  //   }
  // }, [parentRef.current]);

  const createResources = useCallback(() => {
    const groupByWorkspace: Record<string, Project[]> = {};

    projects.forEach((project) => {
      const workspaceId = project.workspaceId || "";
      if (!groupByWorkspace[workspaceId]) {
        groupByWorkspace[workspaceId] = [];
      }

      groupByWorkspace[workspaceId].push(project);
    });

    const resources: Resource[] = [];

    Object.entries(groupByWorkspace).map(([workspaceId, projects]) => {

      const workspaceResource: Resource = {
        id: workspaceId,
        name: workspaces.find(workspace => workspace.id === workspaceId)?.name || "",
        groupOnly: true
      };

      resources.push(workspaceResource);

      projects.forEach((project) => {
        const projectId = project.id!;
        const phaseResources: Resource[] = project.phaseIds?.sort((a, b) => Number(a) - Number(b))?.map((phaseId) => ({
          id: `${projectId}_${phaseId}`,
          name: phases.find(phase => phase.id === phaseId)?.name || "",
          parentId: projectId,
          groupOnly: false
        })) || [];

        const newResource: Resource = {
          id: projectId,
          name: project.name,
          parentId: workspaceId,
          groupOnly: true
        };

        resources.push(newResource, ...phaseResources)
      });
    });

    return [
      ...resources,
    ];
  }, [projects, phases]);

  const createEvents = useCallback(() => {
    const workerAllocations: EventItem[] = projectTimes.map((projectTime) => {
      return {
        id: projectTime.id,
        start: dayjs(projectTime.start).format("YYYY.MM.DD HH:mm:ss"),
        end: dayjs(projectTime.end).format("YYYY.MM.DD HH:mm:ss"),
        resourceId: projectTime.projectId,
        title: projectTime.title || "",
        bgColor: projectTime.bgColor,
        groupId: projectTime.phaseId
      }
    });

    const projectAllocations: EventItem[] = projects.map((project) => {
      return {
        id: `Project-${project.id}`,
        start: dayjs(project.start).format("YYYY.MM.DD HH:mm:ss"),
        end: dayjs(project.end).format("YYYY.MM.DD HH:mm:ss"),
        resourceId: project.id!,
        title: `${project.name} (${project.allocatedHours}/${project.plannedTotalHours}h)`,
        bgColor: "blue",
        movable: false,
        resizable: false,
        groupOnly: true,
      }
    });

    return [...workerAllocations, ...projectAllocations];
  }, [projectTimes, projects]);

  useEffect(() => {
    if (!mounted || !state.showScheduler) return;
    const resources = createResources();
    const events = createEvents();

    schedulerData?.setResources(resources);
    schedulerData?.setEvents(events);
    dispatch({ type: "UPDATE_SCHEDULER", payload: schedulerData });
  }, [mounted]);

  useEffect(() => {
    schedulerData = new SchedulerData(dayjs().format("YYYY.MM.DD"), ViewType.Month, false, false, {
      besidesWidth: 20,
      dragAndDropEnabled: true,
      responsiveByParent: true,
      dayResourceTableWidth: 300,
      weekResourceTableWidth: 300,
      monthResourceTableWidth: 300,
      quarterResourceTableWidth: 300,
      yearResourceTableWidth: 300,
      schedulerContentHeight: window.innerHeight - 250,
      crossResourceMove: true,
      eventItemPopoverTrigger: "click",
      groupOnlySlotColor: "#f0f0f0",
      views: [
        {viewName: "One day", viewType: ViewType.Day, showAgenda: false, isEventPerspective: false},
        {viewName: "Two days", viewType: ViewType.Custom, showAgenda: false, isEventPerspective: false},
        {viewName: "Week", viewType: ViewType.Week, showAgenda: false, isEventPerspective: false},
        {viewName: "Month", viewType: ViewType.Month, showAgenda: false, isEventPerspective: false},
        {viewName: "Quarter", viewType: ViewType.Quarter, showAgenda: false, isEventPerspective: false},
        {viewName: "Year", viewType: ViewType.Year, showAgenda: false, isEventPerspective: false},
      ],
    }, {
      getCustomDateFunc: getCustomDate
    });
    schedulerData.setSchedulerLocale(dayjsLocale);

    dispatch({ type: "INITIALIZE", payload: schedulerData });

    setTimeout(() => {
      setMounted(true);
    }, 1000);
  }, [])

  const getCustomDate = (schedulerData: SchedulerData<EventItem>, num: number, date?: string | Dayjs) => {
    const { viewType, localeDayjs, startDate } = schedulerData;
    const selectDate = date ?? startDate;
    let startDateFormatted: string | Dayjs, endDateFormatted: string | Dayjs, cellUnit = CellUnit.Hour;

    const baseDate = localeDayjs(selectDate);

    switch (viewType) {
      case ViewType.Custom1: {
        const monday = baseDate.startOf("week");
        startDateFormatted = num === 0 ? monday : monday.add(2 * num, "weeks");
        endDateFormatted = startDateFormatted.add(1, "weeks").endOf("week");
        cellUnit = CellUnit.Day;
        break;
      }
      case ViewType.Custom2: {
        const firstDayOfMonth = baseDate.startOf("month");
        startDateFormatted = num === 0 ? firstDayOfMonth : firstDayOfMonth.add(2 * num, "months");
        endDateFormatted = startDateFormatted.add(1, "months").endOf("month");
        cellUnit = CellUnit.Day;
        break;
      }
      default: {
        startDateFormatted = num === 0 ? baseDate : baseDate.add(2 * num, "days");
        endDateFormatted = startDateFormatted.add(1, "days");
        break;
      }
    }

    return {
      startDate: startDateFormatted.format(DATE_FORMAT),
      endDate: endDateFormatted.format(DATE_FORMAT),
      cellUnit,
    };
  };

  const onMoveEvent = (_schedulerData: SchedulerData<EventItem>, event: EventItem, slotId: string, slotName: string, start: string, end: string) => {
    const projectTime = projectTimes.find((projectTime) => projectTime.id === event.id);
    if (projectTime) {
      const updatedProjectTime = { ...projectTime, projectId: slotId, start, end };
      setProjectTimes((projectTimes) => projectTimes.map((projectTime) => projectTime.id === updatedProjectTime.id ? updatedProjectTime : projectTime));

      schedulerData.moveEvent(event, slotId, slotName, start, end);
      dispatch({ type: "UPDATE_SCHEDULER", payload: schedulerData });
    }
  };

  const onPrevClick = () => {
    schedulerData.prev();
    schedulerData.setEvents(createEvents());
    dispatch({ type: "UPDATE_SCHEDULER", payload: schedulerData });
  };

  const onNextClick = () => {
    schedulerData.next();
    schedulerData.setEvents(createEvents());
    dispatch({ type: "UPDATE_SCHEDULER", payload: schedulerData });
  };

  const onSelectDate = (_: SchedulerData<EventItem>, date: string) => {
    schedulerData.setDate(date);
    schedulerData.setResources(createResources());
    schedulerData.setEvents(createEvents());
    dispatch({ type: "UPDATE_SCHEDULER", payload: schedulerData });
  };

  const onChangeViewType = (_: SchedulerData<EventItem>, view: View) => {
    schedulerData.setViewType(view.viewType);
    schedulerData.setEvents(createEvents());
    schedulerData.config.customCellWidth = view.viewType === ViewType.Custom ? 30 : 80;
    dispatch({ type: "UPDATE_SCHEDULER", payload: schedulerData });
  }

  const onNewEventAdd = (_schedulerData: SchedulerData<EventItem>, slotId: string, _slotName: string, start: string, end: string) => {
    setModalOpened(true);
    const newEvent: ProjectTime = {
      id: uuid(),
      projectId: slotId,
      title: "",
      start,
      end,
      resourceId: slotId.split("_")[0],
      bgColor: "purple",
    };

    setPendingProjectTime(newEvent);
  };

  const updateProjectTotal = (projectId: string, workTimes: ProjectTime[]) => {
    const project = projects.find(project => project.id === projectId);
    if (project) {
      const newTotal = calculateTotalHours(workTimes.filter(time => time.resourceId === project.id));
      setProjects((projects) => projects.map((project) => project.id === projectId ? { ...project, allocatedHours: newTotal } : project));

      const event = schedulerData.events.find((event) => event.resourceId === projectId);
      if (!event) return;

      schedulerData.updateEventEnd({
        ...event,
        title: `${project.name} (${newTotal}/${project.plannedTotalHours}h)`
      }, event?.end || "");
      dispatch({ type: "UPDATE_SCHEDULER", payload: schedulerData });
    }
  }

  const onUpdateEventStart = (_: SchedulerData<EventItem>, event: EventItem, newStart: string) => {
    const projectTime = projectTimes.find((projectTime) => projectTime.id === event.id);
    if (projectTime) {
      const updatedProjectTime = { ...projectTime, start: newStart };
      const newTimes = projectTimes.map((projectTime) => projectTime.id === updatedProjectTime.id ? updatedProjectTime : projectTime);
      setProjectTimes(newTimes);
      updateProjectTotal(updatedProjectTime.resourceId, newTimes);

      schedulerData.updateEventStart(event, newStart);
      dispatch({ type: "UPDATE_SCHEDULER", payload: schedulerData });
    }
  }

  const onUpdateEventEnd = (_: SchedulerData<EventItem>, event: EventItem, newEnd: string) => {
    const projectTime = projectTimes.find((projectTime) => projectTime.id === event.id);
    if (projectTime) {
      const updatedProjectTime = { ...projectTime, end: newEnd };
      const newTimes = projectTimes.map((projectTime) => projectTime.id === updatedProjectTime.id ? updatedProjectTime : projectTime);
      setProjectTimes(newTimes);
      updateProjectTotal(updatedProjectTime.resourceId, newTimes);

      schedulerData.updateEventEnd(event, newEnd);
      dispatch({ type: "UPDATE_SCHEDULER", payload: schedulerData });
    }
  };

  const onToggleExpand = (_: SchedulerData<EventItem>, slotId: string) => {
    schedulerData.toggleExpandStatus(slotId);
    dispatch({ type: "UPDATE_SCHEDULER", payload: schedulerData });
  };

  const onCloseModal = () => {
    setModalOpened(false);
  };

  const onConfirmProjectTime = () => {
    if (pendingProjectTime) {

      const workersSelectedForProjectTime = selectedWorkers.map(workerId => workers.find(worker => worker.id === workerId));

      if (workersSelectedForProjectTime.length === 0) {
        return;
      }

      const createdTimes: ProjectTime[] = [];
      const currentViewType = schedulerData.viewType;

      workersSelectedForProjectTime.forEach((worker) => {
        if (worker) {
          const { name, color } = worker;

          if (currentViewType !== ViewType.Day && currentViewType !== ViewType.Custom) {
            // If the view is not day or custom, we need to create a new event for each day
            const startDate = dayjs(pendingProjectTime.start);
            const endDate = dayjs(pendingProjectTime.end);

            const days = endDate.diff(startDate, "days") + 1;
            for (let i = 0; i < days; i++) {
              // Each day should be 8h in length from 8am to 4pm
              const startTime = startDate.add(i, "days").startOf("day").add(8, "hours");
              const endTime = startDate.add(i, "days").startOf("day").add(16, "hours");
              const newTime = {
                ...pendingProjectTime,
                id: uuid(),
                title: name,
                start: startTime.format("YYYY.MM.DD HH:mm:ss"),
                end: endTime.format("YYYY.MM.DD HH:mm:ss"),
                bgColor: color
              }
              createdTimes.push(newTime);

              schedulerData.addEvent({
                id: uuid(),
                start: newTime.start,
                end: newTime.end,
                resourceId: newTime.projectId,
                title: name,
                bgColor: color
              });
            }
          } else {
            const newTime = {...pendingProjectTime, id: uuid(), title: name, bgColor: color };
            createdTimes.push(newTime);

            schedulerData.addEvent({
              id: uuid(),
              start: pendingProjectTime.start,
              end: pendingProjectTime.end,
              resourceId: pendingProjectTime.projectId,
              title: name,
              bgColor: color
            });
          }
        }
      });

      const newWorkTimes = [...projectTimes, ...createdTimes];

      setProjectTimes(newWorkTimes);

      const project = projects.find(project => project.id === pendingProjectTime.resourceId);
      if (project) {
        const newTotal = calculateTotalHours(newWorkTimes.filter(time => time.resourceId === project.id));
        const updatedProject = { ...project, allocatedHours: newTotal };
        setProjects((projects) => projects.map((project) => project.id === updatedProject.id ? updatedProject : project));
      }

      setModalOpened(false);
      setPendingProjectTime(undefined);
      setSelectedWorkers([]);
      dispatch({ type: "UPDATE_SCHEDULER", payload: schedulerData });
    }
  };

  const onDeleteClick = (event: EventItem) => {
    const projectTimeToDelete = projectTimes.find((time) => time.id === event.id);
    if (!projectTimeToDelete) return;

    const newProjectTimes = projectTimes.filter((time) => time.id !== projectTimeToDelete.id);
    setProjectTimes(newProjectTimes);

    updateProjectTotal(projectTimeToDelete.resourceId, newProjectTimes);

    schedulerData.removeEvent(event);
    dispatch({ type: "UPDATE_SCHEDULER", payload: schedulerData });
  };

  const renderTimeInputs = (projectTime: ProjectTime) => {
    const { start, end } = projectTime;

    const minDate = dayjs(start).startOf("day").toDate();
    const maxDate = dayjs(end).endOf("day").toDate();

    return (
      <>
        <DataGroup
          edit
          column
          title="Alkaa"
          inputType="dateTime"
          dateProps={{
            dateValue: new Date(start),
            minDate: minDate,
            maxDate: maxDate
          }}
          onChange={(value) => setPendingProjectTime({ ...projectTime, start: value as string })}
        />
        <DataGroup
          edit
          column
          title="Loppuu"
          inputType="dateTime"
          dateProps={{
            dateValue: new Date(end),
            minDate: minDate,
            maxDate: maxDate
          }}
          onChange={(value) => setPendingProjectTime({ ...projectTime, end: value as string })}
        />
      </>
    );
  };

  const renderModalContent = () => {
    const resourceId = pendingProjectTime?.resourceId;
    if (!resourceId) return null;
    const project = projects.find((project) => project.id === resourceId);
    if (!project) return null;
    const projectWorkers = project.workerIds?.map((workerId) => workers.find((worker) => worker.id === workerId)) || [];
    const workerOptions: ComboboxItem[] = projectWorkers.filter(worker => !!worker).map((worker) => ({ value: worker.id || "", label: worker.name }));

    const shouldShowTimeInputs = schedulerData.viewType === ViewType.Day || schedulerData.viewType === ViewType.Custom;

    return (
      <Stack>
        <DataGroup
          edit
          column
          title="Työntekijä"
          inputType="multiSelect"
          multiSelectProps={{
            multiSelectOptions: workerOptions,
            multiSelectValues: selectedWorkers,
            onMultiSelectChange: (value) => setSelectedWorkers(value as string[])
          }}
        />
        {shouldShowTimeInputs && (
          renderTimeInputs(pendingProjectTime!)
        )}
      </Stack>
    );
  }

  const renderModal = (title: string) => {
    const shouldShowTimeInputs = schedulerData?.viewType === ViewType.Day || schedulerData?.viewType === ViewType.Custom;

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
          {!shouldShowTimeInputs && (
            <Title order={6} style={{ color: "red" }}>
              Uudet allokaatiot luodaan automaattisesti klo 8:00 - 16:00 välille valitulle päivälle!
            </Title>
          )}
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
      key={`popover-${event.id}`}
      event={event}
      title={title}
      start={start}
      end={end}
      statusColor={statusColor}
      resource={schedulerData.getSlots().find((slot) => slot.id === event.resourceId) as Resource}
      onDeleteClick={onDeleteClick}
    />
  );

  const renderItem = (
    schedulerData: SchedulerData<EventItem>,
    event: EventItem,
    bgColor: string,
    isStart: boolean,
    _isEnd: boolean,
    mustAddCssClass: string,
    mustBeHeight: number
  ) => {
    const borderWidth = isStart ? '2' : '1';
    const borderColor =  'black', backgroundColor = bgColor;;
    const titleText = schedulerData.behaviors.getEventTextFunc?.(schedulerData, event);
    const divStyle = {
      borderLeft: borderWidth + 'px solid ' + borderColor,
      backgroundColor: backgroundColor,
      height: mustBeHeight
    };

    return (
      <div key={event.id} className={mustAddCssClass} style={divStyle}>
        <span style={{marginLeft: '4px', lineHeight: `${mustBeHeight}px` }}>
          {titleText}
        </span>
      </div>
    );
  };

  const renderContent = () => {
    if (!schedulerData || !state.showScheduler || !parentRef.current || !mounted) return <Skeleton height={600} />;

    return (
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
        eventItemTemplateResolver={renderItem}
      />
    );
  }

  return (
    <Container flex={1} maw="100%" mah="100%" style={{ overflow: "hidden", "scheduler-container tbody": { backgroundColor: "#1d1f25" } }}>
      <Box ref={parentRef} id="scheduler-container">
        {renderContent()}
      </Box>
      {renderModal("Lisää työaika")}
    </Container>
  );
}

export default ChartView;