import { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { Frame, Button } from 'react95';

const ROWS = 9;
const COLS = 9;
const MINES = 10;

interface Cell {
  isMine: boolean;
  revealed: boolean;
  flagged: boolean;
  adjacent: number;
}

type Status = 'idle' | 'playing' | 'won' | 'lost';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 6px;
  gap: 6px;
  align-items: center;
`;

const TopBar = styled(Frame).attrs({ variant: 'well' })`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 6px;
  width: 100%;
`;

const Counter = styled.div`
  background: #000;
  color: #f00;
  font-family: 'Courier New', monospace;
  font-weight: bold;
  font-size: 18px;
  padding: 2px 6px;
  border: 1px inset #c0c0c0;
  min-width: 44px;
  text-align: center;
  letter-spacing: 1px;
`;

const FaceBtn = styled(Button)`
  width: 28px;
  height: 28px;
  min-width: 28px;
  padding: 0;
  font-size: 16px;
`;

const Board = styled.div`
  display: grid;
  grid-template-columns: repeat(${COLS}, 22px);
  grid-template-rows: repeat(${ROWS}, 22px);
  gap: 0;
`;

const CellBtn = styled.button<{ $revealed: boolean; $color: string }>`
  width: 22px;
  height: 22px;
  font-family: 'Courier New', monospace;
  font-weight: bold;
  font-size: 14px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #c0c0c0;
  color: ${({ $color }) => $color};
  border: ${({ $revealed }) =>
    $revealed
      ? '1px solid #808080'
      : '2px solid'};
  border-color: ${({ $revealed }) =>
    $revealed ? '#808080' : '#fff #808080 #808080 #fff'};
  cursor: default;
  user-select: none;
  padding: 0;
`;

const numberColor = ['', '#0000ff', '#008000', '#ff0000', '#000080', '#800000', '#008080', '#000', '#808080'];

function buildBoard(): Cell[][] {
  const board: Cell[][] = Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({
      isMine: false,
      revealed: false,
      flagged: false,
      adjacent: 0,
    })),
  );

  let placed = 0;
  while (placed < MINES) {
    const r = Math.floor(Math.random() * ROWS);
    const c = Math.floor(Math.random() * COLS);
    if (!board[r][c].isMine) {
      board[r][c].isMine = true;
      placed += 1;
    }
  }

  for (let r = 0; r < ROWS; r += 1) {
    for (let c = 0; c < COLS; c += 1) {
      if (board[r][c].isMine) continue;
      let count = 0;
      for (let dr = -1; dr <= 1; dr += 1) {
        for (let dc = -1; dc <= 1; dc += 1) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) continue;
          if (board[nr][nc].isMine) count += 1;
        }
      }
      board[r][c].adjacent = count;
    }
  }

  return board;
}

function flood(board: Cell[][], r: number, c: number) {
  const stack: [number, number][] = [[r, c]];
  while (stack.length) {
    const [cr, cc] = stack.pop()!;
    if (cr < 0 || cr >= ROWS || cc < 0 || cc >= COLS) continue;
    const cell = board[cr][cc];
    if (cell.revealed || cell.flagged || cell.isMine) continue;
    cell.revealed = true;
    if (cell.adjacent === 0) {
      for (let dr = -1; dr <= 1; dr += 1) {
        for (let dc = -1; dc <= 1; dc += 1) {
          if (dr === 0 && dc === 0) continue;
          stack.push([cr + dr, cc + dc]);
        }
      }
    }
  }
}

function isWon(board: Cell[][]): boolean {
  for (let r = 0; r < ROWS; r += 1) {
    for (let c = 0; c < COLS; c += 1) {
      const cell = board[r][c];
      if (!cell.isMine && !cell.revealed) return false;
    }
  }
  return true;
}

const pad = (n: number) => String(Math.max(0, Math.min(999, n))).padStart(3, '0');

export function Minesweeper() {
  const [board, setBoard] = useState<Cell[][]>(() => buildBoard());
  const [status, setStatus] = useState<Status>('idle');
  const [time, setTime] = useState(0);
  const startTime = useRef<number | null>(null);

  const flagsUsed = useMemo(
    () => board.flat().filter(c => c.flagged).length,
    [board],
  );

  useEffect(() => {
    if (status !== 'playing') return;
    const interval = window.setInterval(() => {
      if (startTime.current) {
        setTime(Math.floor((Date.now() - startTime.current) / 1000));
      }
    }, 250);
    return () => window.clearInterval(interval);
  }, [status]);

  const reset = () => {
    setBoard(buildBoard());
    setStatus('idle');
    setTime(0);
    startTime.current = null;
  };

  const reveal = (r: number, c: number) => {
    if (status === 'won' || status === 'lost') return;
    const cell = board[r][c];
    if (cell.revealed || cell.flagged) return;

    if (status === 'idle') {
      setStatus('playing');
      startTime.current = Date.now();
    }

    const next = board.map(row => row.map(cl => ({ ...cl })));
    if (next[r][c].isMine) {
      for (let i = 0; i < ROWS; i += 1) {
        for (let j = 0; j < COLS; j += 1) {
          if (next[i][j].isMine) next[i][j].revealed = true;
        }
      }
      setBoard(next);
      setStatus('lost');
      return;
    }
    flood(next, r, c);
    setBoard(next);
    if (isWon(next)) setStatus('won');
  };

  const flag = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (status === 'won' || status === 'lost') return;
    const cell = board[r][c];
    if (cell.revealed) return;
    const next = board.map(row => row.map(cl => ({ ...cl })));
    next[r][c].flagged = !next[r][c].flagged;
    setBoard(next);
  };

  const face = status === 'lost' ? 'X(' : status === 'won' ? '8)' : ':)';

  return (
    <Container>
      <TopBar>
        <Counter>{pad(MINES - flagsUsed)}</Counter>
        <FaceBtn onClick={reset}>{face}</FaceBtn>
        <Counter>{pad(time)}</Counter>
      </TopBar>
      <Frame variant="well" style={{ padding: 4 }}>
        <Board>
          {board.map((row, r) =>
            row.map((cell, c) => {
              const display = cell.flagged
                ? 'F'
                : !cell.revealed
                  ? ''
                  : cell.isMine
                    ? '*'
                    : cell.adjacent > 0
                      ? String(cell.adjacent)
                      : '';
              return (
                <CellBtn
                  key={`${r}-${c}`}
                  $revealed={cell.revealed}
                  $color={
                    cell.isMine && cell.revealed
                      ? '#000'
                      : numberColor[cell.adjacent] || '#000'
                  }
                  onClick={() => reveal(r, c)}
                  onContextMenu={e => flag(e, r, c)}
                >
                  {display}
                </CellBtn>
              );
            }),
          )}
        </Board>
      </Frame>
    </Container>
  );
}
