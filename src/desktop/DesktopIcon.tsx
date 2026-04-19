import { useEffect } from 'react';
import styled from 'styled-components';
import type { ReactNode } from 'react';

const Tile = styled.button<{ $selected: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80px;
  padding: 4px;
  background: transparent;
  border: 1px dotted transparent;
  cursor: default;
  font-family: inherit;

  ${({ $selected }) =>
    $selected
      ? `
    border: 1px dotted #fff;
    & .di-icon {
      filter: brightness(0.6) sepia(1) hue-rotate(190deg) saturate(5);
    }
    & .di-label {
      background: #000080;
      color: #fff;
    }
  `
      : ''}

  &:focus {
    outline: none;
  }
`;

const IconBox = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Label = styled.span`
  font-size: 12px;
  margin-top: 4px;
  color: #fff;
  text-align: center;
  text-shadow: 1px 1px 0 #000;
  padding: 1px 3px;
  line-height: 1.15;
`;

interface Props {
  label: string;
  icon: ReactNode;
  selected: boolean;
  onSelect: () => void;
  onOpen: () => void;
}

export function DesktopIcon({ label, icon, selected, onSelect, onOpen }: Props) {
  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') onOpen();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected, onOpen]);

  return (
    <Tile
      $selected={selected}
      onClick={e => {
        e.stopPropagation();
        onSelect();
      }}
      onDoubleClick={e => {
        e.stopPropagation();
        onOpen();
      }}
    >
      <IconBox className="di-icon">{icon}</IconBox>
      <Label className="di-label">{label}</Label>
    </Tile>
  );
}
