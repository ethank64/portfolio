import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { AppBar, Button, Frame } from 'react95';
import { useWindowManager } from '../windows/WindowManager';
import { APPS_BY_ID } from './appCatalog';
import { StartMenu } from './StartMenu';

const Bar = styled(AppBar)`
  top: auto;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 36px;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding: 2px 4px;
  gap: 4px;
`;

const StartButton = styled(Button)<{ $open: boolean }>`
  font-weight: bold;
  height: 28px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 8px;
  ${({ $open }) =>
    $open
      ? 'box-shadow: inset 1px 1px 0 #808080, inset -1px -1px 0 #fff;'
      : ''}
`;

const StartIcon = styled.div`
  width: 18px;
  height: 18px;
  background:
    linear-gradient(45deg, #ff0000 25%, transparent 25%) -1px 0,
    linear-gradient(135deg, #00ff00 25%, transparent 25%) -1px 0,
    linear-gradient(225deg, #0000ff 25%, transparent 25%) -1px 0,
    linear-gradient(315deg, #ffff00 25%, transparent 25%) -1px 0,
    #fff;
  background-size: 9px 9px;
  background-repeat: no-repeat;
`;

const TaskList = styled.div`
  flex: 1;
  display: flex;
  gap: 4px;
  overflow: hidden;
  padding: 0 4px;
`;

const TaskBtn = styled(Button)<{ $active: boolean }>`
  height: 28px;
  flex: 0 1 160px;
  min-width: 80px;
  justify-content: flex-start;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 8px;
  overflow: hidden;
  ${({ $active }) =>
    $active
      ? 'box-shadow: inset 1px 1px 0 #808080, inset -1px -1px 0 #fff; font-weight: bold;'
      : ''}

  & > span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
    text-align: left;
  }
`;

const Tray = styled(Frame).attrs({ variant: 'well' })`
  height: 28px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  font-size: 12px;
  font-variant-numeric: tabular-nums;
`;

function useClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 15_000);
    return () => window.clearInterval(id);
  }, []);
  return now.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function Taskbar() {
  const { windows, activeId, focusWindow, toggleMinimize } = useWindowManager();
  const [startOpen, setStartOpen] = useState(false);
  const time = useClock();
  const startRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!startOpen) return;
    const onClick = (e: MouseEvent) => {
      if (startRef.current && !startRef.current.contains(e.target as Node)) {
        setStartOpen(false);
      }
    };
    window.addEventListener('mousedown', onClick);
    return () => window.removeEventListener('mousedown', onClick);
  }, [startOpen]);

  return (
    <div ref={startRef}>
      {startOpen && <StartMenu onClose={() => setStartOpen(false)} />}
      <Bar position="fixed">
        <StartButton
          $open={startOpen}
          onClick={() => setStartOpen(o => !o)}
        >
          <StartIcon />
          Start
        </StartButton>

        <TaskList>
          {windows.map(w => {
            const def = APPS_BY_ID[w.appId];
            const isActive = activeId === w.id && !w.minimized;
            return (
              <TaskBtn
                key={w.id}
                $active={isActive}
                onClick={() => {
                  if (isActive) {
                    toggleMinimize(w.id);
                  } else {
                    focusWindow(w.id);
                  }
                }}
              >
                {def && (
                  <span style={{ width: 16, height: 16, display: 'inline-flex', flex: 'none' }}>
                    {def.icon16}
                  </span>
                )}
                <span>{w.title}</span>
              </TaskBtn>
            );
          })}
        </TaskList>

        <Tray>{time}</Tray>
      </Bar>
    </div>
  );
}
