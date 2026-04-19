import styled from 'styled-components';
import { WindowManagerProvider } from './windows/WindowManager';
import { Desktop } from './desktop/Desktop';
import { Taskbar } from './desktop/Taskbar';
import { WindowLayer } from './windows/WindowLayer';

const Shell = styled.div`
  position: fixed;
  inset: 0;
  overflow: hidden;
  background: #008080;
`;

function App() {
  return (
    <Shell>
      <WindowManagerProvider>
        <Desktop />
        <WindowLayer />
        <Taskbar />
      </WindowManagerProvider>
    </Shell>
  );
}

export default App;
