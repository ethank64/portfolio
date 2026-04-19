import styled from 'styled-components';
import { Frame } from 'react95';
import { APPS } from './appCatalog';
import { useWindowManager } from '../windows/WindowManager';

const Menu = styled(Frame).attrs({ shadow: true })`
  position: absolute;
  bottom: 36px;
  left: 0;
  width: 220px;
  display: flex;
  background: #c0c0c0;
  z-index: 100000;
  padding: 2px;
`;

const SideBar = styled.div`
  width: 26px;
  background: linear-gradient(to top, #000080, #1084d0);
  color: #fff;
  font-weight: bold;
  font-size: 16px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 8px 0;
  letter-spacing: 1px;
  overflow: hidden;

  & > span {
    writing-mode: vertical-rl;
    transform: rotate(180deg);
    white-space: nowrap;
    line-height: 1;
  }
`;

const Items = styled.ul`
  flex: 1;
  list-style: none;
  margin: 0;
  padding: 0;
`;

const Item = styled.li`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  font-size: 13px;
  cursor: default;
  user-select: none;

  &:hover {
    background: #000080;
    color: #fff;
  }
`;

const Divider = styled.li`
  height: 1px;
  background: #808080;
  margin: 2px 0;
  border-bottom: 1px solid #fff;
`;

interface Props {
  onClose: () => void;
}

export function StartMenu({ onClose }: Props) {
  const { openWindow } = useWindowManager();

  const handleOpen = (appId: (typeof APPS)[number]) => {
    openWindow({
      appId: appId.appId,
      title: appId.title,
      size: appId.size,
      singleton: true,
    });
    onClose();
  };

  return (
    <Menu>
      <SideBar>
        <span>EthanOS 95</span>
      </SideBar>
      <Items>
        {APPS.map(app => (
          <Item key={app.appId} onClick={() => handleOpen(app)}>
            <span style={{ width: 16, height: 16, display: 'inline-flex' }}>
              {app.icon16}
            </span>
            <span>{app.label}</span>
          </Item>
        ))}
        <Divider />
        <Item
          onClick={() => {
            onClose();
            window.alert(
              'It is now safe to turn off your computer.\n\n(Or just keep clicking around.)',
            );
          }}
        >
          <span>Shut Down...</span>
        </Item>
      </Items>
    </Menu>
  );
}
