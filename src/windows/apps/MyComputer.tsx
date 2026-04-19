import styled from 'styled-components';
import {
  Computer,
  Notepad,
  FolderFile,
  Mailnews2,
  RecycleEmpty,
  Mspaint,
  Winmine1,
  Wininet32546,
} from '@react95/icons';
import { Frame, Toolbar, Button } from 'react95';
import { useWindowManager } from '../WindowManager';
import { IconGrid, type IconGridItem } from './IconGrid';

const AddressBar = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  font-size: 12px;
`;

const StatusBar = styled(Frame).attrs({ variant: 'status' })`
  padding: 2px 8px;
  font-size: 11px;
  display: flex;
  justify-content: space-between;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
`;

export function MyComputer() {
  const { openWindow } = useWindowManager();

  const items: IconGridItem[] = [
    {
      id: 'aboutme',
      label: 'AboutMe.txt',
      icon: <Notepad variant="32x32_4" />,
      onOpen: () =>
        openWindow({
          appId: 'aboutme',
          title: 'AboutMe.txt - Notepad',
          singleton: true,
          size: { width: 520, height: 480 },
        }),
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: <FolderFile variant="32x32_4" />,
      onOpen: () =>
        openWindow({
          appId: 'projects',
          title: 'Projects',
          singleton: true,
          size: { width: 520, height: 380 },
        }),
    },
    {
      id: 'resume',
      label: 'Resume.pdf',
      icon: <Notepad variant="32x32_4" />,
      onOpen: () =>
        openWindow({
          appId: 'resume',
          title: 'Resume.pdf - Acrobat Reader',
          singleton: true,
          size: { width: 720, height: 600 },
        }),
    },
    {
      id: 'contact',
      label: 'Contact',
      icon: <Mailnews2 variant="32x32_4" />,
      onOpen: () =>
        openWindow({
          appId: 'contact',
          title: 'Inbox - Outlook Express',
          singleton: true,
          size: { width: 720, height: 540 },
        }),
    },
    {
      id: 'paint',
      label: 'Paint',
      icon: <Mspaint variant="32x32_4" />,
      onOpen: () =>
        openWindow({
          appId: 'paint',
          title: 'untitled - Paint',
          singleton: true,
          size: { width: 560, height: 480 },
        }),
    },
    {
      id: 'minesweeper',
      label: 'Minesweeper',
      icon: <Winmine1 variant="32x32_4" />,
      onOpen: () =>
        openWindow({
          appId: 'minesweeper',
          title: 'Minesweeper',
          singleton: true,
          size: { width: 240, height: 320 },
        }),
    },
    {
      id: 'ie',
      label: 'Internet Explorer',
      icon: <Wininet32546 variant="32x32_4" />,
      onOpen: () =>
        openWindow({
          appId: 'ie',
          title: 'Welcome - Microsoft Internet Explorer',
          singleton: true,
          size: { width: 640, height: 500 },
        }),
    },
    {
      id: 'recycle',
      label: 'Recycle Bin',
      icon: <RecycleEmpty variant="32x32_4" />,
      onOpen: () =>
        openWindow({
          appId: 'recycle',
          title: 'Recycle Bin',
          singleton: true,
          size: { width: 460, height: 320 },
        }),
    },
  ];

  return (
    <Container>
      <Toolbar>
        <Button disabled>File</Button>
        <Button disabled>Edit</Button>
        <Button disabled>View</Button>
        <Button disabled>Help</Button>
      </Toolbar>
      <AddressBar>
        <Computer variant="16x16_4" />
        <span>C:\</span>
      </AddressBar>
      <Frame variant="field" style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        <IconGrid items={items} />
      </Frame>
      <StatusBar>
        <span>{items.length} object(s)</span>
        <span>0 bytes</span>
      </StatusBar>
    </Container>
  );
}
