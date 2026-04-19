import { useEffect, useRef, useState, type ReactNode } from 'react';
import Draggable, { type DraggableData, type DraggableEvent } from 'react-draggable';
import { Window, WindowHeader, WindowContent, Button } from 'react95';
import styled from 'styled-components';
import type { WindowInstance } from '../types/window';
import { useWindowManager } from './WindowManager';

const MOBILE_BREAKPOINT = 768;

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < MOBILE_BREAKPOINT : false,
  );
  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    setIsMobile(mql.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);
  return isMobile;
}

const PositionedWindow = styled(Window)<{ $w?: number; $h?: number; $mobile?: boolean }>`
  width: ${({ $w, $mobile }) => ($mobile ? '100%' : $w ? `${$w}px` : '520px')};
  height: ${({ $h, $mobile }) => ($mobile ? '100%' : $h ? `${$h}px` : '380px')};
  max-width: 100%;
  max-height: 100%;
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
  const isMobile = useIsMobile();

  const handleStop = (_e: DraggableEvent, data: DraggableData) => {
    updatePosition(win.id, { x: data.x, y: data.y });
  };

  if (win.minimized) return null;

  const windowChrome = (
    <PositionedWindow
      $w={win.size?.width}
      $h={win.size?.height}
      $mobile={isMobile}
      shadow={!isMobile}
    >
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
  );

  if (isMobile) {
    return (
      <div
        ref={nodeRef}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: win.zIndex,
          display: 'flex',
        }}
        onMouseDown={() => {
          if (!isActive) focusWindow(win.id);
        }}
        onTouchStart={() => {
          if (!isActive) focusWindow(win.id);
        }}
      >
        {windowChrome}
      </div>
    );
  }

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
        {windowChrome}
      </div>
    </Draggable>
  );
}
