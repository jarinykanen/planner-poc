import { Button, ComboboxItem, Group, Modal, Stack, Table, Title } from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";
import { useAtom, useAtomValue } from "jotai";
import { Plus, X } from "lucide-react";
import { useMemo, useState } from "react";
import { v4 as uuid } from "uuid";
import { projectsAtom } from "../atoms/projects";
import { workersAtom } from "../atoms/workers";
import DataGroup from "../components/generic/data-group";
import { demoPhases, Project } from "../types";
import DateAndTimeUtils from "../utils/date-and-time-utils";

export const Route = createFileRoute("/projects")({
  component: RouteComponent,
})

function RouteComponent() {
  const [projects, setProjects] = useAtom(projectsAtom);
  const workers = useAtomValue(workersAtom);

  const [modalOpened, setModalOpened] = useState(false);
  const [pendingProject, setPendingProject] = useState<Project>();

  const workerOptions: ComboboxItem[] = useMemo(() => (
    workers.map((person) => ({ value: person.id || "", label: person.name }))
  ), [workers]);

  const phaseOptions: ComboboxItem[] = useMemo(() => (
    demoPhases.map((phase) => ({ value: phase.id, label: phase.name }))
  ), [demoPhases]);

  // useEffect(() => {
  //   setProjects([]);
  // }, []);

  const addNewClick = () => {
    setModalOpened(true);
    setPendingProject({
      name: "",
      start: new Date(),
      end: new Date(),
      workerIds: [],
    });
  }

  const onCloseModal = () => {
    setModalOpened(false);
    setPendingProject(undefined);
  };

  const onSave = () => {
    if (pendingProject) {
      const sortedProjectPhases = pendingProject.phaseIds?.sort((a, b) => Number(a) - Number(b));
      if (pendingProject.id) {
        setProjects(projects.map((project) => project.id === pendingProject.id ? {...pendingProject, phaseIds: sortedProjectPhases} : project));
      } else {
        setProjects([...projects, { ...pendingProject, id: uuid(), phaseIds: sortedProjectPhases }]);
      }
    }
    onCloseModal();
  };

  const onEditClick = (project: Project) => {
    setModalOpened(true);
    setPendingProject(project);
  }

  const renderModalContent = () => {
    return (
      <Stack>
        <DataGroup
          edit
          column
          title="Työnumero"
          inputType="text"
          value={pendingProject?.name}
          onChange={(value) => pendingProject && setPendingProject({ ...pendingProject, name: value as string })}
        />
        <DataGroup
          edit
          column
          title="Alkaa"
          dateProps={{
            dateValue: pendingProject?.start && new Date(pendingProject?.start)
          }}
          inputType="date"
          onChange={(value) => pendingProject && setPendingProject({ ...pendingProject, start: value as Date })}
        />
        <DataGroup
          edit
          column
          title="Loppuu"
          dateProps={{
            dateValue: pendingProject?.end && new Date(pendingProject?.end)
          }}
          inputType="date"
          onChange={(value) => pendingProject && setPendingProject({ ...pendingProject, end: value as Date })}
        />
        <DataGroup
          edit
          column
          title="Henkilöt"
          inputType="multiSelect"
          multiSelectProps={{
            multiSelectOptions: workerOptions,
            multiSelectValues: pendingProject?.workerIds,
            onMultiSelectChange: (value) => pendingProject && setPendingProject({ ...pendingProject, workerIds: value }),
          }}
        />
        <DataGroup
          edit
          column
          title="Vaiheet"
          inputType="multiSelect"
          multiSelectProps={{
            multiSelectOptions: phaseOptions,
            multiSelectValues: pendingProject?.phaseIds,
            onMultiSelectChange: (value) => pendingProject && setPendingProject({ ...pendingProject, phaseIds: value }),
          }}
        />
      </Stack>
    );
  }

  const renderModal = () => (
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
        <Title order={3}>Lisää projekti</Title>
        {renderModalContent()}
        <Group p={16}>
          <Button onClick={onCloseModal} variant="light">
            Sulje
          </Button>
          <Button onClick={onSave} variant="filled">
            Tallenna
          </Button>
        </Group>
      </Stack>
    </Modal>
  );

  const renderRow = (project: Project) => (
    <Table.Tr key={project.name}>
      <Table.Td>{project.name}</Table.Td>
      <Table.Td>{DateAndTimeUtils.formatToDisplayDateTime(project.start)}</Table.Td>
      <Table.Td>{DateAndTimeUtils.formatToDisplayDateTime(project.end)}</Table.Td>
      <Table.Td>{project.workerIds.length}</Table.Td>
      <Table.Td>
        <Group>
          <Button size="xs" variant="light" onClick={() => onEditClick(project)}>Muokkaa</Button>
          <Button size="xs" variant="filled" bg="red" onClick={() => setProjects(projects.filter((p) => p.id !== project.id))}>Poista</Button>
        </Group>
      </Table.Td>
    </Table.Tr>
  )

  return (
    <>
      <Stack flex={1}>
        <Group>
          <Button onClick={addNewClick} leftSection={<Plus size={18} />}>Lisää</Button>
          <Button onClick={() => setProjects([])} leftSection={<X size={18} />} bg="red">Tyhjennä</Button>
        </Group>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Työnumero</Table.Th>
              <Table.Th>Alkaa</Table.Th>
              <Table.Th>Loppuu</Table.Th>
              <Table.Th>Henkilöt</Table.Th>
              <Table.Th>Toiminnot</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{projects.map(renderRow)}</Table.Tbody>
        </Table>
      </Stack>
      {renderModal()}
    </>
  );
}
