import { useState } from 'react';
import styled from 'styled-components';
import { DesktopIcon } from './DesktopIcon';
import { APPS } from './appCatalog';
import { useWindowManager } from '../windows/WindowManager';

const Surface = styled.div`
  position: absolute;
  inset: 0;
  bottom: 36px;
  background: #008080;
  user-select: none;
`;

const IconColumn = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  display: grid;
  grid-template-columns: repeat(2, 84px);
  gap: 12px 6px;
`;

export function Desktop() {
  const { openWindow } = useWindowManager();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <Surface onClick={() => setSelectedId(null)}>
      <IconColumn>
        {APPS.map(app => (
          <DesktopIcon
            key={app.appId}
            label={app.label}
            icon={app.icon32}
            selected={selectedId === app.appId}
            onSelect={() => setSelectedId(app.appId)}
            onOpen={() =>
              openWindow({
                appId: app.appId,
                title: app.title,
                size: app.size,
                singleton: true,
              })
            }
          />
        ))}
      </IconColumn>
    </Surface>
  );
}
