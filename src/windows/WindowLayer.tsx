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
import { useWindowManager } from './WindowManager';
import { DraggableWindow } from './DraggableWindow';
import { MyComputer } from './apps/MyComputer';
import { AboutMe } from './apps/AboutMe';
import { ProjectsFolder } from './apps/ProjectsFolder';
import { ProjectWindow } from './apps/ProjectWindow';
import { Resume } from './apps/Resume';
import { Contact } from './apps/Contact';
import { InternetExplorer } from './apps/InternetExplorer';
import { RecycleBin } from './apps/RecycleBin';
import { Minesweeper } from './apps/Minesweeper';
import { Paint } from './apps/Paint';
import type { AppId } from '../types/window';
import type { JSX } from 'react';

const Layer = styled.div`
  position: absolute;
  inset: 0;
  bottom: 36px;
  pointer-events: none;

  & > * {
    pointer-events: auto;
  }
`;

function appIcon(appId: AppId): JSX.Element {
  const props = { variant: '16x16_4' as const };
  switch (appId) {
    case 'mycomputer':
      return <Computer {...props} />;
    case 'aboutme':
      return <Notepad {...props} />;
    case 'projects':
    case 'project':
      return <FolderFile {...props} />;
    case 'resume':
      return <Notepad {...props} />;
    case 'contact':
      return <Mailnews2 {...props} />;
    case 'ie':
      return <Wininet32546 {...props} />;
    case 'recycle':
      return <RecycleEmpty {...props} />;
    case 'minesweeper':
      return <Winmine1 {...props} />;
    case 'paint':
      return <Mspaint {...props} />;
  }
}

function renderApp(appId: AppId, payload?: Record<string, unknown>): JSX.Element {
  switch (appId) {
    case 'mycomputer':
      return <MyComputer />;
    case 'aboutme':
      return <AboutMe />;
    case 'projects':
      return <ProjectsFolder />;
    case 'project':
      return <ProjectWindow projectId={(payload?.projectId as string) ?? ''} />;
    case 'resume':
      return <Resume />;
    case 'contact':
      return <Contact />;
    case 'ie':
      return <InternetExplorer />;
    case 'recycle':
      return <RecycleBin />;
    case 'minesweeper':
      return <Minesweeper />;
    case 'paint':
      return <Paint />;
  }
}

export function WindowLayer() {
  const { windows } = useWindowManager();
  return (
    <Layer>
      {windows.map(w => (
        <DraggableWindow key={w.id} win={w} icon={appIcon(w.appId)}>
          {renderApp(w.appId, w.payload)}
        </DraggableWindow>
      ))}
    </Layer>
  );
}
