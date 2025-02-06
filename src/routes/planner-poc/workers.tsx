import { Button, Group, Modal, Stack, Table, Title } from '@mantine/core'
import { createFileRoute } from '@tanstack/react-router'
import { useAtom, useSetAtom } from 'jotai'
import { Plus, X } from 'lucide-react'
import { useState } from 'react'
import { v4 as uuid } from 'uuid'
import { workersAtom } from '../../atoms/workers'
import DataGroup from '../../components/generic/data-group'
import { Worker } from '../../types'
import { projectsAtom } from '../../atoms/projects'

export const Route = createFileRoute('/planner-poc/workers')({
  component: RouteComponent,
})

function RouteComponent() {
  const [workers, setWorkers] = useAtom(workersAtom)
  const setProjects = useSetAtom(projectsAtom)

  const [modalOpened, setModalOpened] = useState(false)
  const [pendingWorker, setPendingWorker] = useState<Worker>()

  const addNewClick = () => {
    setModalOpened(true)
    setPendingWorker({
      name: '',
      color: Math.floor(Math.random() * 16777215).toString(16),
    })
  }

  const onCloseModal = () => {
    setModalOpened(false)
    setPendingWorker(undefined)
  }

  const onSave = () => {
    if (pendingWorker) {
      if (pendingWorker.id) {
        setWorkers(
          workers.map((worker) =>
            worker.id === pendingWorker.id ? pendingWorker : worker,
          ),
        )
      } else {
        setWorkers([...workers, { ...pendingWorker, id: uuid() }])
      }
    }
    onCloseModal()
  }

  const onEditClick = (worker: Worker) => {
    setModalOpened(true)
    setPendingWorker(worker)
  }

  const onDeleteClick = (worker: Worker) => {
    setProjects((projects) =>
      projects.map((project) => ({
        ...project,
        workerIds: project.workerIds.filter((id) => id !== worker.id),
      })),
    )
    setWorkers(workers.filter((w) => w.id !== worker.id))
  }

  const renderModalContent = () => (
    <Stack>
      <DataGroup
        edit
        column
        title="Nimi"
        inputType="text"
        value={pendingWorker?.name}
        onChange={(value) =>
          pendingWorker &&
          setPendingWorker({ ...pendingWorker, name: value as string })
        }
      />
      <DataGroup
        edit
        column
        title="Väri"
        inputType="color"
        colorPickerProps={{
          colorValue: pendingWorker?.color,
          onColorChange: (value) =>
            pendingWorker &&
            setPendingWorker({ ...pendingWorker, color: value }),
        }}
      />
    </Stack>
  )

  const renderModal = () => (
    <Modal
      zIndex={200}
      opened={modalOpened}
      onClose={onCloseModal}
      size="lg"
      closeOnClickOutside
      transitionProps={{ transition: 'fade', duration: 200 }}
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
  )

  const renderRow = (worker: Worker) => (
    <Table.Tr key={worker.name}>
      <Table.Td>{worker.name}</Table.Td>
      <Table.Td>{worker.color}</Table.Td>
      <Table.Td>
        <Group>
          <Button size="xs" variant="light" onClick={() => onEditClick(worker)}>
            Muokkaa
          </Button>
          <Button
            size="xs"
            variant="filled"
            bg="red"
            onClick={() => onDeleteClick(worker)}
          >
            Poista
          </Button>
        </Group>
      </Table.Td>
    </Table.Tr>
  )

  return (
    <>
      <Stack flex={1}>
        <Group>
          <Button onClick={addNewClick} leftSection={<Plus size={18} />}>
            Lisää
          </Button>
          <Button
            onClick={() => setWorkers([])}
            leftSection={<X size={18} />}
            bg="red"
          >
            Tyhjennä
          </Button>
        </Group>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Nimi</Table.Th>
              <Table.Th>Väri</Table.Th>
              <Table.Th>Toiminnot</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{workers.map(renderRow)}</Table.Tbody>
        </Table>
      </Stack>
      {renderModal()}
    </>
  )
}
