import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Frame, Button } from 'react95';

type Tool = 'pencil' | 'brush' | 'eraser';

const PALETTE = [
  '#000000',
  '#7f7f7f',
  '#880015',
  '#ed1c24',
  '#ff7f27',
  '#fff200',
  '#22b14c',
  '#00a2e8',
  '#3f48cc',
  '#a349a4',
  '#ffffff',
  '#c3c3c3',
  '#b97a57',
  '#ffaec9',
  '#ffc90e',
  '#efe4b0',
  '#b5e61d',
  '#99d9ea',
  '#7092be',
  '#c8bfe7',
];

const Container = styled.div`
  display: grid;
  grid-template-columns: 76px 1fr;
  grid-template-rows: 1fr auto;
  gap: 6px;
  flex: 1;
  min-height: 0;
  padding: 4px;
`;

const ToolColumn = styled(Frame).attrs({ variant: 'window' })`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 4px;
`;

const ToolBtn = styled(Button)<{ $active: boolean }>`
  width: 100%;
  height: 26px;
  padding: 0 4px;
  font-size: 12px;
  ${({ $active }) =>
    $active
      ? 'box-shadow: inset 1px 1px 0 #808080, inset -1px -1px 0 #fff;'
      : ''}
`;

const CanvasWrap = styled(Frame).attrs({ variant: 'field' })`
  background: #fff;
  display: flex;
  align-items: stretch;
  justify-content: stretch;
  min-height: 0;
  overflow: hidden;
`;

const PaintCanvas = styled.canvas`
  width: 100%;
  height: 100%;
  background: #fff;
  cursor: crosshair;
  display: block;
`;

const PaletteBar = styled(Frame).attrs({ variant: 'window' })`
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px;
`;

const ActiveSwatch = styled.div<{ $color: string }>`
  width: 28px;
  height: 28px;
  background: ${({ $color }) => $color};
  border: 2px inset #c0c0c0;
`;

const Swatches = styled.div`
  display: grid;
  grid-template-columns: repeat(10, 16px);
  grid-template-rows: repeat(2, 16px);
  gap: 2px;
`;

const Swatch = styled.button<{ $color: string }>`
  width: 16px;
  height: 16px;
  background: ${({ $color }) => $color};
  border: 1px solid #000;
  padding: 0;
  cursor: pointer;
`;

export function Paint() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);

  const [color, setColor] = useState<string>('#000000');
  const [tool, setTool] = useState<Tool>('pencil');

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const resize = () => {
      const { width, height } = wrap.getBoundingClientRect();
      const w = Math.max(100, Math.floor(width));
      const h = Math.max(100, Math.floor(height));
      if (canvas.width !== w || canvas.height !== h) {
        const tmp = document.createElement('canvas');
        tmp.width = canvas.width;
        tmp.height = canvas.height;
        const tctx = tmp.getContext('2d');
        if (tctx) tctx.drawImage(canvas, 0, 0);
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#fff';
          ctx.fillRect(0, 0, w, h);
          ctx.drawImage(tmp, 0, 0);
        }
      }
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, []);

  const getPos = (e: React.PointerEvent): { x: number; y: number } => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * canvas.width,
      y: ((e.clientY - rect.top) / rect.height) * canvas.height,
    };
  };

  const drawSegment = (from: { x: number; y: number }, to: { x: number; y: number }) => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
    ctx.lineWidth = tool === 'pencil' ? 2 : tool === 'brush' ? 6 : 14;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  };

  const handleDown = (e: React.PointerEvent) => {
    drawing.current = true;
    const pos = getPos(e);
    last.current = pos;
    drawSegment(pos, { x: pos.x + 0.01, y: pos.y + 0.01 });
    canvasRef.current?.setPointerCapture(e.pointerId);
  };

  const handleMove = (e: React.PointerEvent) => {
    if (!drawing.current || !last.current) return;
    const pos = getPos(e);
    drawSegment(last.current, pos);
    last.current = pos;
  };

  const handleUp = (e: React.PointerEvent) => {
    drawing.current = false;
    last.current = null;
    canvasRef.current?.releasePointerCapture(e.pointerId);
  };

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const save = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'untitled.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <Container>
      <ToolColumn>
        <ToolBtn $active={tool === 'pencil'} onClick={() => setTool('pencil')}>
          Pencil
        </ToolBtn>
        <ToolBtn $active={tool === 'brush'} onClick={() => setTool('brush')}>
          Brush
        </ToolBtn>
        <ToolBtn $active={tool === 'eraser'} onClick={() => setTool('eraser')}>
          Eraser
        </ToolBtn>
        <ToolBtn $active={false} onClick={clear}>
          Clear
        </ToolBtn>
        <ToolBtn $active={false} onClick={save}>
          Save
        </ToolBtn>
      </ToolColumn>

      <CanvasWrap ref={wrapRef}>
        <PaintCanvas
          ref={canvasRef}
          onPointerDown={handleDown}
          onPointerMove={handleMove}
          onPointerUp={handleUp}
          onPointerCancel={handleUp}
        />
      </CanvasWrap>

      <PaletteBar>
        <ActiveSwatch $color={color} />
        <Swatches>
          {PALETTE.map(c => (
            <Swatch
              key={c}
              $color={c}
              onClick={() => setColor(c)}
              aria-label={`Color ${c}`}
            />
          ))}
        </Swatches>
      </PaletteBar>
    </Container>
  );
}
