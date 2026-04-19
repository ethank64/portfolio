import styled from 'styled-components';
import { bio } from '../../data/bio';

const NotepadArea = styled.div`
  flex: 1;
  background: #fff;
  border: 2px inset #c0c0c0;
  padding: 14px 16px;
  font-family: var(--font-content);
  font-size: 14px;
  line-height: 1.6;
  color: #000;
  overflow: auto;
  white-space: pre-wrap;
`;

const Heading = styled.div`
  font-weight: bold;
  margin-bottom: 4px;
`;

const Block = styled.div`
  margin-bottom: 14px;
`;

export function AboutMe() {
  return (
    <NotepadArea>
      <Block>
        <Heading>{bio.name.toUpperCase()} - readme.txt</Heading>
        <div>{bio.title}</div>
      </Block>

      {bio.paragraphs.map((p, i) => (
        <Block key={i}>{p}</Block>
      ))}

      <Block>
        <Heading>Technical Skills</Heading>
        {Object.entries(bio.skills).map(([group, items]) => (
          <div key={group} style={{ marginTop: 8 }}>
            <div style={{ textDecoration: 'underline' }}>{group}</div>
            <ul style={{ margin: '4px 0 0 18px', listStyle: 'square' }}>
              {items.map(item => (
                <li key={item} style={{ listStyle: 'square' }}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Block>

      <Block>
        <Heading>End of file.</Heading>
      </Block>
    </NotepadArea>
  );
}
