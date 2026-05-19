import { useState } from 'react';
import styled from 'styled-components';
import { Button, TextInput, Toolbar, Frame } from 'react95';
import { contact } from '../../data/contact';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
`;

const AddressRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 0;
`;

const AddressLabel = styled.span`
  font-size: 12px;
  padding-left: 2px;
`;

const Bookmarks = styled(Toolbar)`
  flex-wrap: wrap;
`;

const Page = styled(Frame).attrs({ variant: 'field' })`
  flex: 1;
  background: #fff;
  padding: 18px 22px;
  overflow: auto;
  font-family: var(--font-content);
  font-size: 14px;
  line-height: 1.6;
  color: #000;
`;

const StatusBar = styled(Frame).attrs({ variant: 'status' })`
  padding: 2px 8px;
  font-size: 11px;
  display: flex;
  justify-content: space-between;
`;

const sites: { label: string; url: string }[] = [
  { label: 'GitHub', url: 'https://github.com/ethank64' },
  {
    label: 'LinkedIn',
    url: 'https://www.linkedin.com/in/ethan-knotts-4b349a2b6/',
  },
  { label: 'Email', url: `mailto:${contact.email}` },
];

export function InternetExplorer() {
  const [address, setAddress] = useState('http://www.ethanknotts.com/');
  const [status, setStatus] = useState('Done');

  const navigate = (url: string) => {
    setAddress(url);
    setStatus(`Opening ${url} in a new window...`);
    window.open(url, '_blank', 'noopener,noreferrer');
    window.setTimeout(() => setStatus('Done'), 2500);
  };

  const handleGo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) return;
    navigate(address);
  };

  return (
    <Wrapper>
      <Toolbar>
        <Button onClick={() => navigate('https://github.com/ethank64')}>Back</Button>
        <Button disabled>Forward</Button>
        <Button onClick={() => setAddress('http://www.ethanknotts.com/')}>Home</Button>
      </Toolbar>

      <form onSubmit={handleGo}>
        <AddressRow>
          <AddressLabel>Address:</AddressLabel>
          <TextInput
            value={address}
            onChange={e => setAddress(e.target.value)}
            fullWidth
          />
          <Button type="submit">Go</Button>
        </AddressRow>
      </form>

      <Bookmarks>
        {sites.map(s => (
          <Button key={s.label} onClick={() => navigate(s.url)}>
            {s.label}
          </Button>
        ))}
      </Bookmarks>

      <Page>
        <h2 style={{ margin: 0, fontSize: 22 }}>Welcome to ethanknotts.com</h2>
        <p style={{ marginTop: 4, color: '#555' }}>Best viewed at 800x600.</p>
        <hr style={{ margin: '12px 0', border: 'none', borderTop: '1px solid #c0c0c0' }} />

        <p>
          You can browse my online presence using the bookmarks above. Each one opens
          in a new browser window because, well, the real Web doesn't render inside
          frames anymore.
        </p>

        <p style={{ marginTop: 12 }}>
          Looking for something specific? Try one of these:
        </p>
        <ul style={{ marginLeft: 22, listStyle: 'square', marginTop: 6 }}>
          {sites.map(s => (
            <li key={s.url} style={{ listStyle: 'square' }}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#0000ee', textDecoration: 'underline' }}
              >
                {s.label} - {s.url}
              </a>
            </li>
          ))}
        </ul>
      </Page>

      <StatusBar>
        <span>{status}</span>
        <span>Internet zone</span>
      </StatusBar>
    </Wrapper>
  );
}
