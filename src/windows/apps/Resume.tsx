import styled from 'styled-components';
import { Button, Toolbar } from 'react95';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
`;

const PdfFrame = styled.iframe`
  flex: 1;
  width: 100%;
  border: 2px inset #c0c0c0;
  background: #fff;
  min-height: 300px;
`;

export function Resume() {
  return (
    <Wrapper>
      <Toolbar>
        <Button onClick={() => window.open('/resume.pdf', '_blank', 'noopener')}>
          Open in new tab
        </Button>
        <Button
          onClick={() => {
            const a = document.createElement('a');
            a.href = '/resume.pdf';
            a.download = 'Ethan-Knotts-Resume.pdf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          }}
        >
          Download
        </Button>
      </Toolbar>
      <PdfFrame src="/resume.pdf#toolbar=0&navpanes=0" title="Ethan Knotts Resume" />
    </Wrapper>
  );
}
