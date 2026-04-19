import styled from 'styled-components';
import { GroupBox, Anchor, Button, Frame, Tabs, Tab, TabBody } from 'react95';
import { useState } from 'react';
import { projects } from '../../data/projects';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 8px;
  min-height: 0;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Cover = styled.div`
  width: 88px;
  height: 88px;
  border: 2px inset #c0c0c0;
  background: #000;
  background-size: cover;
  background-position: center;
  flex-shrink: 0;
`;

const Title = styled.div`
  font-size: 16px;
  font-weight: bold;
`;

const Summary = styled.div`
  font-size: 12px;
  color: #333;
  margin-top: 4px;
`;

const Body = styled.div`
  flex: 1;
  min-height: 0;
  overflow: auto;
  font-size: 13px;
  line-height: 1.5;
`;

const Pill = styled.span`
  display: inline-block;
  padding: 2px 8px;
  margin: 0 4px 4px 0;
  background: #e8e8e8;
  border: 1px solid #808080;
  font-size: 11px;
`;

const Buttons = styled.div`
  display: flex;
  gap: 6px;
  justify-content: flex-end;
  padding-top: 6px;
  border-top: 1px solid #808080;
`;

const ImpactList = styled.ul`
  margin: 4px 0 0 18px;
  & > li {
    list-style: square;
    margin-bottom: 4px;
  }
`;

interface Props {
  projectId: string;
}

export function ProjectWindow({ projectId }: Props) {
  const project = projects.find(p => p.id === projectId);
  const [tab, setTab] = useState(0);

  if (!project) {
    return (
      <Frame variant="field" style={{ padding: 16 }}>
        Project not found.
      </Frame>
    );
  }

  return (
    <Container>
      <Header>
        <Cover style={{ backgroundImage: `url(${project.image})` }} />
        <div>
          <Title>{project.title}</Title>
          <Summary>{project.summary}</Summary>
        </div>
      </Header>

      <Tabs value={tab} onChange={value => setTab(value as number)}>
        <Tab value={0}>General</Tab>
        <Tab value={1}>Impact</Tab>
        <Tab value={2}>Tech</Tab>
      </Tabs>
      <TabBody style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
        {tab === 0 && (
          <Body>
            <p>{project.longDescription}</p>
          </Body>
        )}
        {tab === 1 && (
          <Body>
            <GroupBox label="What it shipped">
              <ImpactList>
                {project.impact.map(i => (
                  <li key={i}>{i}</li>
                ))}
              </ImpactList>
            </GroupBox>
          </Body>
        )}
        {tab === 2 && (
          <Body>
            <div>
              {project.technologies.map(t => (
                <Pill key={t}>{t}</Pill>
              ))}
            </div>
          </Body>
        )}
      </TabBody>

      <Buttons>
        {project.liveUrl && (
          <Button onClick={() => window.open(project.liveUrl, '_blank', 'noopener')}>
            Live demo
          </Button>
        )}
        <Anchor href={project.githubUrl} target="_blank" rel="noopener noreferrer">
          <Button>View on GitHub</Button>
        </Anchor>
      </Buttons>
    </Container>
  );
}
