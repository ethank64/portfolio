import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react';
import styled, { keyframes } from 'styled-components';
import { useWindowManager } from '../WindowManager';
import {
  bootBanner,
  completePath,
  getCommandNames,
  runLine,
  type CommandContext,
  type Line,
} from './msdos/commands';
import { HOME_PATH, buildVfs, dosifyPath, type VDir } from './msdos/vfs';

const blink = keyframes`
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
`;

const Screen = styled.div`
  flex: 1;
  background: #000;
  color: #e6e6e6;
  font-family: 'Consolas', 'Lucida Console', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.25;
  padding: 8px 10px;
  overflow-y: auto;
  overflow-x: hidden;
  white-space: pre-wrap;
  word-break: break-word;
  cursor: text;

  &::-webkit-scrollbar {
    width: 14px;
  }
  &::-webkit-scrollbar-track {
    background: #000;
  }
  &::-webkit-scrollbar-thumb {
    background: #555;
  }
`;

const LineRow = styled.div<{ $kind: 'out' | 'err' | 'prompt' | 'system' }>`
  white-space: pre-wrap;
  color: ${({ $kind }) =>
    $kind === 'err' ? '#ff8a8a' : $kind === 'system' ? '#a0c0ff' : '#e6e6e6'};
`;

const InputRow = styled.div`
  display: flex;
  align-items: baseline;
  white-space: pre-wrap;
`;

const PromptText = styled.span`
  color: #e6e6e6;
  white-space: pre;
`;

const Typed = styled.span`
  color: #e6e6e6;
  white-space: pre;
`;

const Cursor = styled.span`
  display: inline-block;
  width: 0.6em;
  background: #e6e6e6;
  color: #000;
  animation: ${blink} 1.06s steps(2, start) infinite;
`;

const HiddenInput = styled.input`
  position: absolute;
  left: -9999px;
  top: -9999px;
  width: 1px;
  height: 1px;
  opacity: 0;
`;

interface Props {
  winId: string;
}

export function MsDos({ winId }: Props) {
  const { openWindow, closeWindow, activeId } = useWindowManager();
  const vfsRef = useRef<VDir | null>(null);
  if (vfsRef.current === null) {
    vfsRef.current = buildVfs();
  }
  const vfs = vfsRef.current;

  const [cwd, setCwd] = useState<string>(HOME_PATH);
  const [lines, setLines] = useState<Line[]>(() =>
    bootBanner().map(text => ({ kind: 'out' as const, text })),
  );
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState<number | null>(null);

  const screenRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const promptText = useMemo(() => `${dosifyPath(cwd)}>`, [cwd]);

  useEffect(() => {
    if (screenRef.current) {
      screenRef.current.scrollTop = screenRef.current.scrollHeight;
    }
  }, [lines, input]);

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    focusInput();
  }, [focusInput]);

  useEffect(() => {
    if (activeId === winId) focusInput();
  }, [activeId, winId, focusInput]);

  const print = useCallback((text: string, kind: Line['kind'] = 'out') => {
    setLines(prev => [...prev, { kind, text }]);
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const submit = useCallback(
    (raw: string) => {
      const promptLine: Line = { kind: 'prompt', text: `${promptText}${raw}` };
      setLines(prev => [...prev, promptLine]);

      const trimmed = raw.trim();
      if (trimmed.length > 0) {
        setHistory(prev => [...prev, trimmed]);
      }
      setHistoryIdx(null);

      const ctx: CommandContext = {
        cwd,
        setCwd,
        print,
        clear,
        vfs,
        history,
        openWindow,
        closeSelf: () => closeWindow(winId),
      };
      runLine(raw, ctx);
    },
    [promptText, cwd, history, vfs, openWindow, closeWindow, winId, print, clear],
  );

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const value = input;
      setInput('');
      submit(value);
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const next = historyIdx === null ? history.length - 1 : Math.max(0, historyIdx - 1);
      setHistoryIdx(next);
      setInput(history[next]);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx === null) return;
      const next = historyIdx + 1;
      if (next >= history.length) {
        setHistoryIdx(null);
        setInput('');
      } else {
        setHistoryIdx(next);
        setInput(history[next]);
      }
      return;
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      handleTab();
      return;
    }
    if (e.key === 'l' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      clear();
      return;
    }
    if (e.key === 'c' && e.ctrlKey) {
      e.preventDefault();
      setLines(prev => [...prev, { kind: 'prompt', text: `${promptText}${input}^C` }]);
      setInput('');
      setHistoryIdx(null);
      return;
    }
  };

  const handleTab = () => {
    const tokens = input.split(/(\s+)/);
    if (tokens.length === 1 || tokens.every(t => /^\s*$/.test(t))) {
      const prefix = input.trim();
      const cmds = getCommandNames().filter(c => c.startsWith(prefix));
      if (cmds.length === 1) {
        setInput(cmds[0] + ' ');
      } else if (cmds.length > 1) {
        print(`${promptText}${input}`, 'prompt');
        print(cmds.join('  '));
      }
      return;
    }

    const lastIdx = tokens.length - 1;
    const last = tokens[lastIdx];
    const { completion, candidates } = completePath({ cwd, vfs }, last);
    if (candidates.length === 0) return;
    if (candidates.length === 1) {
      tokens[lastIdx] = completion;
      setInput(tokens.join(''));
    } else {
      tokens[lastIdx] = completion;
      setInput(tokens.join(''));
      print(`${promptText}${input}`, 'prompt');
      print(candidates.join('  '));
    }
  };

  return (
    <Screen ref={screenRef} onMouseDown={focusInput} onClick={focusInput}>
      {lines.map((l, i) => (
        <LineRow key={i} $kind={l.kind}>
          {l.text || ' '}
        </LineRow>
      ))}
      <InputRow>
        <PromptText>{promptText}</PromptText>
        <Typed>{input}</Typed>
        <Cursor>&nbsp;</Cursor>
      </InputRow>
      <HiddenInput
        ref={inputRef}
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        autoFocus
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
      />
    </Screen>
  );
}
