import { useRef, type ReactNode } from 'react';
import Draggable, { type DraggableData, type DraggableEvent } from 'react-draggable';
import { Window, WindowHeader, WindowContent, Button } from 'react95';
import styled from 'styled-components';
import type { WindowInstance } from '../types/window';
import { useWindowManager } from './WindowManager';

const PositionedWindow = styled(Window)<{ $w?: number; $h?: number }>`
  width: ${({ $w }) => ($w ? `${$w}px` : '520px')};
  height: ${({ $h }) => ($h ? `${$h}px` : '380px')};
  display: flex;
  flex-direction: column;
`;

const Header = styled(WindowHeader)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: move;
  user-select: none;
`;

const HeaderTitle = styled.span`
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 2px;
`;

const ActionBtn = styled(Button)`
  width: 22px;
  min-width: 22px;
  height: 22px;
  padding: 0;
  font-weight: bold;
  line-height: 1;
`;

const Body = styled(WindowContent)`
  flex: 1;
  overflow: auto;
  display: flex;
  flex-direction: column;
`;

interface Props {
  win: WindowInstance;
  icon?: ReactNode;
  children: ReactNode;
}

export function DraggableWindow({ win, icon, children }: Props) {
  const { activeId, focusWindow, closeWindow, toggleMinimize, updatePosition } =
    useWindowManager();
  const isActive = activeId === win.id;
  const nodeRef = useRef<HTMLDivElement>(null);

  const handleStop = (_e: DraggableEvent, data: DraggableData) => {
    updatePosition(win.id, { x: data.x, y: data.y });
  };

  if (win.minimized) return null;

  return (
    <Draggable
      nodeRef={nodeRef as React.RefObject<HTMLElement>}
      handle=".window-drag-handle"
      cancel=".window-no-drag"
      position={win.position}
      onStop={handleStop}
      bounds="parent"
    >
      <div
        ref={nodeRef}
        style={{
          position: 'absolute',
          zIndex: win.zIndex,
        }}
        onMouseDown={() => {
          if (!isActive) focusWindow(win.id);
        }}
      >
        <PositionedWindow $w={win.size?.width} $h={win.size?.height} shadow>
          <Header className="window-drag-handle" active={isActive}>
            <HeaderTitle>
              {icon}
              <span>{win.title}</span>
            </HeaderTitle>
            <HeaderActions className="window-no-drag">
              <ActionBtn
                onClick={e => {
                  e.stopPropagation();
                  toggleMinimize(win.id);
                }}
                aria-label="Minimize"
              >
                _
              </ActionBtn>
              <ActionBtn
                onClick={e => {
                  e.stopPropagation();
                  closeWindow(win.id);
                }}
                aria-label="Close"
              >
                x
              </ActionBtn>
            </HeaderActions>
          </Header>
          <Body>{children}</Body>
        </PositionedWindow>
      </div>
    </Draggable>
  );
}
