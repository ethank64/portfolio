import styled from 'styled-components';
import { Frame, Toolbar, Button } from 'react95';
import { FolderFile } from '@react95/icons';
import { projects } from '../../data/projects';
import { useWindowManager } from '../WindowManager';
import { IconGrid, type IconGridItem } from './IconGrid';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
`;

const StatusBar = styled(Frame).attrs({ variant: 'status' })`
  padding: 2px 8px;
  font-size: 11px;
`;

export function ProjectsFolder() {
  const { openWindow } = useWindowManager();

  const items: IconGridItem[] = projects.map(p => ({
    id: p.id,
    label: p.title,
    icon: <FolderFile variant="32x32_4" />,
    onOpen: () =>
      openWindow({
        appId: 'project',
        title: `${p.title} - Properties`,
        payload: { projectId: p.id },
        size: { width: 560, height: 480 },
      }),
  }));

  return (
    <Container>
      <Toolbar>
        <Button disabled>File</Button>
        <Button disabled>Edit</Button>
        <Button disabled>View</Button>
        <Button disabled>Help</Button>
      </Toolbar>
      <Frame variant="field" style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        <IconGrid items={items} />
      </Frame>
      <StatusBar>{items.length} object(s)</StatusBar>
    </Container>
  );
}
