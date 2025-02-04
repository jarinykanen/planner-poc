import { Container, Skeleton } from "@mantine/core";
import dayjs from "dayjs";
import dayjsLocale from "dayjs/locale/fi";
import { useCallback, useEffect, useReducer, useRef } from "react";
import { EventItem, Resource, Scheduler, SchedulerData, View, ViewType } from "react-big-schedule";
import "react-big-schedule/dist/css/style.css";
import { People, Phase, Project, ProjectTime } from "../types";

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
  people: People[];
  projectTimes: ProjectTime[];
  phases: Phase[];
}

const ChartView = ({projects, people, projectTimes, phases}: Props) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const parentRef = useRef<HTMLDivElement>(null);

  const createResources = useCallback(() => {
    const resources: Resource[] = projects.map((project, index) => {
      const phaseResources: Resource[] = project.phaseIds?.map((phaseId) => ({
        id: `r${index + 1}-${phaseId}`,
        name: phases.find(phase => phase.id === phaseId)?.name || '',
        parentId: `r${index + 1}`,
        groupOnly: false
      })) || [];

      const newResource: Resource = {
        id: `r${index + 1}`,
        name: project.name,
        parentId: 'r0'
      };

      return [newResource, ...phaseResources];
    }).flat();

    return [
      { id: 'r0', name: 'Projects', groupOnly: true },
      ...resources,
    ];
  }, [projects, phases]);

  const createEvents = useCallback(() => {
    const events: EventItem[] = projectTimes.map((projectTime, index) => {
      const projectIndex = projects.findIndex(project => project.id === projectTime.projectId);
      const person = people.find(person => person.id === projectTime.personId);
      return {
        id: index + 1,
        start: dayjs(projectTime.start).format("YYYY.MM.DD HH:mm:ss"),
        end: dayjs(projectTime.end).format("YYYY.MM.DD HH:mm:ss"),
        resourceId: projectTime.phaseId ? `r${projectIndex + 1}-${projectTime.phaseId}` : `r${projectIndex + 1}`,
        // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
        title: person?.name!,
        bgColor: person?.color
      }
    });

    return events;
  }, [people, projectTimes, projects]);

  useEffect(() => {
    schedulerData = new SchedulerData(dayjs().format("YYYY.MM.DD"), ViewType.Month);
    schedulerData.config.dragAndDropEnabled = false;
    schedulerData.config.responsiveByParent = true;
    schedulerData.setSchedulerLocale(dayjsLocale);
    schedulerData.setCalendarPopoverLocale("fi_FI");
    schedulerData.setResources(createResources());
    schedulerData.setEvents(createEvents());
    dispatch({ type: 'INITIALIZE', payload: schedulerData });
  }, [createEvents, createResources])

  const onPrevClick = (schedulerData: SchedulerData) => {
    schedulerData.prev();
    schedulerData.setEvents(createEvents());
    dispatch({ type: 'UPDATE_SCHEDULER', payload: schedulerData });
  };

  const onNextClick = (schedulerData: SchedulerData) => {
    schedulerData.next();
    schedulerData.setEvents(createEvents());
    dispatch({ type: 'UPDATE_SCHEDULER', payload: schedulerData });
  };

  const onChangeViewType = (_: SchedulerData<EventItem>, view: View) => {
    schedulerData.setViewType(view.viewType);
    schedulerData.setEvents(createEvents());
  }

  const newEvent = (schedulerData: SchedulerData, slotId: string, slotName: string, start: string, end: string, type: string, item: any) => {
    if (confirm(`Do you want to create a new event? {slotId: ${slotId}, slotName: ${slotName}, start: ${start}, end: ${end}, type: ${type}, item: ${item}}`)) {
      let newFreshId = 0;
      schedulerData.events.forEach(item => {
        if (Number(item.id) >= newFreshId) newFreshId = Number(item.id) + 1;
      });

      const newEvent = {
        id: newFreshId,
        title: `Tähän tulisi henkilön nimi...`,
        start,
        end,
        resourceId: slotId,
        bgColor: 'purple',
      };
      schedulerData.addEvent(newEvent);
      dispatch({ type: 'UPDATE_SCHEDULER', payload: schedulerData });
    }
  };

  if (!schedulerData || !state.showScheduler) return <Skeleton height={500} />;

  return (
    <Container ref={parentRef} fluid p={0} flex={1} w="100%">
      <Scheduler
        parentRef={parentRef}
        moveEvent={() => console.log('moveEvent')}
        schedulerData={state.viewModel}
        prevClick={onPrevClick}
        nextClick={onNextClick}
        onSelectDate={() => console.log('onSelectDate')}
        onViewChange={onChangeViewType}
        eventItemClick={() => console.log('eventItemClick')}
        newEvent={newEvent}
      />
    </Container>
  );
}

export default ChartView;