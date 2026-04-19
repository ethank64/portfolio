import { useState } from 'react';
import styled from 'styled-components';
import { Frame, Toolbar, Button, Window, WindowHeader, WindowContent } from 'react95';
import { FileFind, RecycleFull } from '@react95/icons';
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

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
`;

const DialogText = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 12px;
  font-size: 13px;
  max-width: 320px;
`;

export function RecycleBin() {
  const [dialog, setDialog] = useState<string | null>(null);

  const items: IconGridItem[] = [
    {
      id: 'old',
      label: 'old_portfolio.html',
      icon: <FileFind variant="32x32_4" />,
      onOpen: () =>
        setDialog(
          'This file cannot be recovered.\n\nIts vibes were incompatible with the Windows 95 shell.',
        ),
    },
    {
      id: 'soul',
      label: 'soul.dll',
      icon: <FileFind variant="32x32_4" />,
      onOpen: () =>
        setDialog(
          'soul.dll has been moved here from the previous build.\n\n(Don\'t worry, the new portfolio came with a fresh one.)',
        ),
    },
    {
      id: 'corp',
      label: 'corporate-jargon.txt',
      icon: <FileFind variant="32x32_4" />,
      onOpen: () =>
        setDialog(
          'corporate-jargon.txt has been permanently deleted.\n\nWords like "synergy" and "leverage" are not allowed in this directory.',
        ),
    },
  ];

  return (
    <Container>
      <Toolbar>
        <Button disabled>File</Button>
        <Button disabled>Edit</Button>
        <Button disabled>View</Button>
        <Button onClick={() => setDialog('Recycle Bin emptied. (Just kidding.)')}>
          Empty Recycle Bin
        </Button>
      </Toolbar>
      <Frame variant="field" style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        <IconGrid items={items} />
      </Frame>
      <StatusBar>{items.length} object(s)</StatusBar>

      {dialog && (
        <Backdrop onClick={() => setDialog(null)}>
          <Window
            shadow
            style={{ width: 380 }}
            onClick={e => e.stopPropagation()}
          >
            <WindowHeader active>
              <span>Recycle Bin</span>
            </WindowHeader>
            <WindowContent>
              <DialogText>
                <RecycleFull variant="32x32_4" />
                <div style={{ whiteSpace: 'pre-wrap' }}>{dialog}</div>
              </DialogText>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button onClick={() => setDialog(null)} style={{ minWidth: 70 }}>
                  OK
                </Button>
              </div>
            </WindowContent>
          </Window>
        </Backdrop>
      )}
    </Container>
  );
}
