import { Button, Group, Modal, Stack, Table, Title } from '@mantine/core'
import { createFileRoute } from '@tanstack/react-router'
import { useAtom } from 'jotai'
import { Plus, X } from 'lucide-react'
import { useState } from 'react'
import { v4 as uuid } from 'uuid'
import { workspacesAtom } from '../../atoms/workspaces'
import DataGroup from '../../components/generic/data-group'
import { Workspace } from '../../types'

export const Route = createFileRoute('/planner-poc/workspaces')({
  component: RouteComponent,
})

function RouteComponent() {
  const [workspaces, setWorkspaces] = useAtom(workspacesAtom)

  const [modalOpened, setModalOpened] = useState(false)
  const [pendingWorkspace, setPendingWorkspace] = useState<Workspace>();

  console.log('workspaces', workspaces)

  const addNewClick = () => {
    setModalOpened(true)
    setPendingWorkspace({
      name: '',
    })
  }

  const onCloseModal = () => {
    setModalOpened(false)
    setPendingWorkspace(undefined)
  }

  const onSave = () => {
    if (pendingWorkspace) {
      if (pendingWorkspace.id) {
        setWorkspaces(
          workspaces.map((workspace) =>
            workspace.id === pendingWorkspace.id ? pendingWorkspace : workspace,
          ),
        )
      } else {
        setWorkspaces([...workspaces, { ...pendingWorkspace, id: uuid() }])
      }
    }
    onCloseModal()
  }

  const onEditClick = (workspace: Workspace) => {
    setModalOpened(true)
    setPendingWorkspace(workspace)
  }

  const onDeleteClick = (workspace: Workspace) => {
    setWorkspaces(workspaces.filter((w) => w.id !== workspace.id))
  }

  const renderModalContent = () => (
    <Stack>
      <DataGroup
        edit
        column
        title="Nimi"
        inputType="text"
        value={pendingWorkspace?.name}
        onChange={(value) =>
          pendingWorkspace &&
          setPendingWorkspace({ ...pendingWorkspace, name: value as string })
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

  const renderRow = (workspace: Workspace) => (
    <Table.Tr key={workspace.name}>
      <Table.Td>{workspace.name}</Table.Td>
      <Table.Td>
        <Group>
          <Button size="xs" variant="light" onClick={() => onEditClick(workspace)}>
            Muokkaa
          </Button>
          <Button
            size="xs"
            variant="filled"
            bg="red"
            onClick={() => onDeleteClick(workspace)}
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
            onClick={() => setWorkspaces([])}
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
          <Table.Tbody>{workspaces.map(renderRow)}</Table.Tbody>
        </Table>
      </Stack>
      {renderModal()}
    </>
  )
}
