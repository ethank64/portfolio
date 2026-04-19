import { useState, type ReactNode } from 'react';
import styled from 'styled-components';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(96px, 1fr));
  gap: 14px;
  padding: 12px;
  align-content: start;
  flex: 1;
  overflow: auto;
`;

const Tile = styled.button<{ $selected: boolean }>`
  background: transparent;
  border: 1px dotted transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: default;
  padding: 4px 6px;
  width: 100%;
  text-align: center;
  font-family: inherit;

  ${({ $selected }) =>
    $selected
      ? `
    border: 1px dotted #fff;
    & .gi-icon {
      filter: brightness(0.6) sepia(1) hue-rotate(190deg) saturate(5);
    }
    & .gi-label {
      background: #000080;
      color: #fff;
    }
  `
      : ''}

  &:focus {
    outline: none;
  }
`;

const IconWrap = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Label = styled.span`
  font-size: 12px;
  line-height: 1.2;
  padding: 0 2px;
  word-break: break-word;
  color: #000;
`;

export interface IconGridItem {
  id: string;
  label: string;
  icon: ReactNode;
  onOpen: () => void;
}

export function IconGrid({ items }: { items: IconGridItem[] }) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <Grid onClick={() => setSelected(null)}>
      {items.map(it => (
        <Tile
          key={it.id}
          $selected={selected === it.id}
          onClick={e => {
            e.stopPropagation();
            setSelected(it.id);
          }}
          onDoubleClick={e => {
            e.stopPropagation();
            it.onOpen();
          }}
        >
          <IconWrap className="gi-icon">{it.icon}</IconWrap>
          <Label className="gi-label">{it.label}</Label>
        </Tile>
      ))}
    </Grid>
  );
}
