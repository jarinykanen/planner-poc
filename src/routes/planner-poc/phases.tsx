import { Button, Group, Modal, Stack, Table, Title } from '@mantine/core'
import { createFileRoute } from '@tanstack/react-router'
import { useAtom } from 'jotai'
import { Plus, X } from 'lucide-react'
import { useState } from 'react'
import { v4 as uuid } from 'uuid'
import DataGroup from '../../components/generic/data-group'
import { Phase } from '../../types'
import { phasesAtom } from '../../atoms/phases'

export const Route = createFileRoute('/planner-poc/phases')({
  component: RouteComponent,
})

function RouteComponent() {
  const [phases, setPhases] = useAtom(phasesAtom)

  const [modalOpened, setModalOpened] = useState(false)
  const [pendingPhase, setPendingPhase] = useState<Phase>()

  const addNewClick = () => {
    setModalOpened(true)
    setPendingPhase({
      name: '',
    })
  }

  const onCloseModal = () => {
    setModalOpened(false)
    setPendingPhase(undefined)
  }

  const onSave = () => {
    if (pendingPhase) {
      if (pendingPhase.id) {
        setPhases(
          phases.map((phase) =>
            phase.id === pendingPhase.id ? pendingPhase : phase,
          ),
        )
      } else {
        setPhases([...phases, { ...pendingPhase, id: uuid() }])
      }
    }
    onCloseModal()
  }

  const onEditClick = (phase: Phase) => {
    setModalOpened(true)
    setPendingPhase(phase)
  }

  const onDeleteClick = (phase: Phase) => {
    setPhases(phases.filter((w) => w.id !== phase.id))
  }

  const renderModalContent = () => (
    <Stack>
      <DataGroup
        edit
        column
        title="Nimi"
        inputType="text"
        value={pendingPhase?.name}
        onChange={(value) =>
          pendingPhase &&
          setPendingPhase({ ...pendingPhase, name: value as string })
        }
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
        <Title order={3}>Lisää työvaihe</Title>
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

  const renderRow = (phase: Phase) => (
    <Table.Tr key={phase.name}>
      <Table.Td>{phase.name}</Table.Td>
      <Table.Td>
        <Group>
          <Button
            size="xs"
            variant="light"
            onClick={() => onEditClick(phase)}
          >
            Muokkaa
          </Button>
          <Button
            size="xs"
            variant="filled"
            bg="red"
            onClick={() => onDeleteClick(phase)}
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
            onClick={() => setPhases([])}
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
              <Table.Th>Toiminnot</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{phases.map(renderRow)}</Table.Tbody>
        </Table>
      </Stack>
      {renderModal()}
    </>
  )
}
