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
import type { JSX } from 'react';
import type { AppId } from '../types/window';

export interface AppDefinition {
  appId: AppId;
  label: string;
  title: string;
  size: { width: number; height: number };
  icon32: JSX.Element;
  icon16: JSX.Element;
}

export const APPS: AppDefinition[] = [
  {
    appId: 'mycomputer',
    label: 'My Computer',
    title: 'My Computer',
    size: { width: 540, height: 420 },
    icon32: <Computer variant="32x32_4" />,
    icon16: <Computer variant="16x16_4" />,
  },
  {
    appId: 'aboutme',
    label: 'AboutMe.txt',
    title: 'AboutMe.txt - Notepad',
    size: { width: 520, height: 480 },
    icon32: <Notepad variant="32x32_4" />,
    icon16: <Notepad variant="16x16_4" />,
  },
  {
    appId: 'projects',
    label: 'Projects',
    title: 'Projects',
    size: { width: 520, height: 380 },
    icon32: <FolderFile variant="32x32_4" />,
    icon16: <FolderFile variant="16x16_4" />,
  },
  {
    appId: 'resume',
    label: 'Resume.pdf',
    title: 'Resume.pdf - Acrobat Reader',
    size: { width: 720, height: 600 },
    icon32: <Notepad variant="32x32_4" />,
    icon16: <Notepad variant="16x16_4" />,
  },
  {
    appId: 'contact',
    label: 'Contact',
    title: 'Inbox - Outlook Express',
    size: { width: 720, height: 540 },
    icon32: <Mailnews2 variant="32x32_4" />,
    icon16: <Mailnews2 variant="16x16_4" />,
  },
  {
    appId: 'ie',
    label: 'Internet Explorer',
    title: 'Welcome - Microsoft Internet Explorer',
    size: { width: 640, height: 500 },
    icon32: <Wininet32546 variant="32x32_4" />,
    icon16: <Wininet32546 variant="16x16_4" />,
  },
  {
    appId: 'minesweeper',
    label: 'Minesweeper',
    title: 'Minesweeper',
    size: { width: 240, height: 320 },
    icon32: <Winmine1 variant="32x32_4" />,
    icon16: <Winmine1 variant="16x16_4" />,
  },
  {
    appId: 'paint',
    label: 'Paint',
    title: 'untitled - Paint',
    size: { width: 560, height: 480 },
    icon32: <Mspaint variant="32x32_4" />,
    icon16: <Mspaint variant="16x16_4" />,
  },
  {
    appId: 'recycle',
    label: 'Recycle Bin',
    title: 'Recycle Bin',
    size: { width: 460, height: 320 },
    icon32: <RecycleEmpty variant="32x32_4" />,
    icon16: <RecycleEmpty variant="16x16_4" />,
  },
];

export const APPS_BY_ID: Record<AppId, AppDefinition | undefined> = APPS.reduce(
  (acc, a) => {
    acc[a.appId] = a;
    return acc;
  },
  {} as Record<AppId, AppDefinition | undefined>,
);
