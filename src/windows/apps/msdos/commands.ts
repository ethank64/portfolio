import type { AppId } from '../../../types/window';
import {
  HOME_PATH,
  basename,
  buildVfs,
  dirname,
  findAppShortcut,
  findNode,
  getAppShortcuts,
  joinPath,
  makeDir,
  moveNode,
  removeNode,
  resolvePath,
  splitPath,
  touchFile,
  writeFile,
  type VDir,
  type VFileAction,
  type VNode,
} from './vfs';

export type LineKind = 'out' | 'err' | 'prompt' | 'system';

export interface Line {
  kind: LineKind;
  text: string;
}

export interface OpenWindowFn {
  (options: {
    appId: AppId;
    title: string;
    payload?: Record<string, unknown>;
    size?: { width: number; height: number };
    singleton?: boolean;
  }): string;
}

export interface CommandContext {
  cwd: string;
  setCwd: (next: string) => void;
  print: (text: string, kind?: LineKind) => void;
  clear: () => void;
  vfs: VDir;
  history: string[];
  openWindow: OpenWindowFn;
  closeSelf: () => void;
}

interface CommandDef {
  name: string;
  help: string;
  run: (ctx: CommandContext, args: string[]) => void;
}

function pad(s: string, n: number): string {
  if (s.length >= n) return s;
  return s + ' '.repeat(n - s.length);
}

function parseFlags(args: string[]): { flags: Set<string>; positional: string[] } {
  const flags = new Set<string>();
  const positional: string[] = [];
  for (const a of args) {
    if (a.startsWith('-') && a.length > 1 && !a.startsWith('--')) {
      for (const ch of a.slice(1)) flags.add(ch);
    } else {
      positional.push(a);
    }
  }
  return { flags, positional };
}

function listChildren(dir: VDir, showHidden: boolean): VNode[] {
  const items = [...dir.children];
  items.sort((a, b) => {
    if (a.type !== b.type) return a.type === 'dir' ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
  return showHidden ? items : items.filter(c => !c.name.startsWith('.'));
}

function fileSize(node: VNode): number {
  if (node.type === 'dir') return 0;
  return node.content.length;
}

const COMMANDS: Record<string, CommandDef> = {
  help: {
    name: 'help',
    help: 'show this help message',
    run: ctx => {
      const names = Object.keys(COMMANDS).sort();
      const width = Math.max(...names.map(n => n.length)) + 2;
      ctx.print('Available commands:');
      for (const n of names) {
        ctx.print(`  ${pad(n, width)}${COMMANDS[n].help}`);
      }
      ctx.print('');
      ctx.print('Tips: Tab completes paths and commands. Up/Down walks history.');
      ctx.print('      Try: ls, cd projects, cat about.txt, open paint, exit');
    },
  },

  ls: {
    name: 'ls',
    help: 'list directory contents (-l long, -a all)',
    run: (ctx, args) => {
      const { flags, positional } = parseFlags(args);
      const target = positional[0] ?? '.';
      const abs = resolvePath(ctx.cwd, target);
      const node = findNode(ctx.vfs, abs);
      if (!node) {
        ctx.print(`ls: cannot access '${target}': No such file or directory`, 'err');
        return;
      }
      const items: VNode[] = node.type === 'dir' ? listChildren(node, flags.has('a')) : [node];
      if (flags.has('l')) {
        for (const it of items) {
          const t = it.type === 'dir' ? 'd' : '-';
          const size = fileSize(it).toString();
          const display = it.type === 'dir' ? it.name + '/' : it.name;
          ctx.print(`${t}rw-r--r--  1 ethan  ethan  ${pad(size, 6)} ${display}`);
        }
      } else {
        const labels = items.map(it => (it.type === 'dir' ? it.name + '/' : it.name));
        ctx.print(labels.join('  '));
      }
    },
  },

  cd: {
    name: 'cd',
    help: 'change directory (cd, cd ~, cd .., cd <path>)',
    run: (ctx, args) => {
      const target = args[0] ?? HOME_PATH;
      const abs = resolvePath(ctx.cwd, target);
      const node = findNode(ctx.vfs, abs);
      if (!node) {
        ctx.print(`cd: no such file or directory: ${target}`, 'err');
        return;
      }
      if (node.type !== 'dir') {
        ctx.print(`cd: not a directory: ${target}`, 'err');
        return;
      }
      ctx.setCwd(abs);
    },
  },

  pwd: {
    name: 'pwd',
    help: 'print working directory',
    run: ctx => {
      ctx.print(ctx.cwd === '' ? '/' : ctx.cwd);
    },
  },

  cat: {
    name: 'cat',
    help: 'print file contents',
    run: (ctx, args) => {
      if (args.length === 0) {
        ctx.print('cat: missing operand', 'err');
        return;
      }
      for (const target of args) {
        const abs = resolvePath(ctx.cwd, target);
        const node = findNode(ctx.vfs, abs);
        if (!node) {
          ctx.print(`cat: ${target}: No such file or directory`, 'err');
          continue;
        }
        if (node.type === 'dir') {
          ctx.print(`cat: ${target}: Is a directory`, 'err');
          continue;
        }
        const text = node.content.endsWith('\n') ? node.content.slice(0, -1) : node.content;
        for (const line of text.split('\n')) ctx.print(line);
        if (node.action) {
          ctx.print('');
          ctx.print(`(Hint: this is a launcher. Try: open ${target})`, 'system');
        }
      }
    },
  },

  echo: {
    name: 'echo',
    help: 'print text; supports > and >> redirection',
    run: (ctx, args) => {
      let redirIdx = -1;
      let append = false;
      for (let i = 0; i < args.length; i++) {
        if (args[i] === '>' || args[i] === '>>') {
          redirIdx = i;
          append = args[i] === '>>';
          break;
        }
      }
      if (redirIdx >= 0) {
        const text = args.slice(0, redirIdx).join(' ') + '\n';
        const target = args[redirIdx + 1];
        if (!target) {
          ctx.print('echo: missing redirection target', 'err');
          return;
        }
        const abs = resolvePath(ctx.cwd, target);
        const res = writeFile(ctx.vfs, abs, text, append);
        if (!res.ok) ctx.print(`echo: ${target}: ${res.error}`, 'err');
        return;
      }
      ctx.print(args.join(' '));
    },
  },

  clear: {
    name: 'clear',
    help: 'clear the screen',
    run: ctx => ctx.clear(),
  },

  cls: {
    name: 'cls',
    help: 'clear the screen (DOS)',
    run: ctx => ctx.clear(),
  },

  whoami: {
    name: 'whoami',
    help: 'print effective user name',
    run: ctx => ctx.print('ethan'),
  },

  date: {
    name: 'date',
    help: 'print the current date and time',
    run: ctx => ctx.print(new Date().toString()),
  },

  uname: {
    name: 'uname',
    help: 'print system info (-a for all)',
    run: (ctx, args) => {
      if (args.includes('-a')) {
        ctx.print(
          'MS-DOS 6.22 IBM-PC 1.0 Mon Jan 1 00:00:00 1996 i486 EthanOS/95',
        );
      } else {
        ctx.print('MS-DOS');
      }
    },
  },

  mkdir: {
    name: 'mkdir',
    help: 'create a directory',
    run: (ctx, args) => {
      if (args.length === 0) {
        ctx.print('mkdir: missing operand', 'err');
        return;
      }
      for (const a of args) {
        const abs = resolvePath(ctx.cwd, a);
        const res = makeDir(ctx.vfs, abs);
        if (!res.ok) ctx.print(`mkdir: cannot create '${a}': ${res.error}`, 'err');
      }
    },
  },

  touch: {
    name: 'touch',
    help: 'create an empty file (or update timestamp)',
    run: (ctx, args) => {
      if (args.length === 0) {
        ctx.print('touch: missing operand', 'err');
        return;
      }
      for (const a of args) {
        const abs = resolvePath(ctx.cwd, a);
        const res = touchFile(ctx.vfs, abs);
        if (!res.ok) ctx.print(`touch: cannot touch '${a}': ${res.error}`, 'err');
      }
    },
  },

  rm: {
    name: 'rm',
    help: 'remove files (-r recursive)',
    run: (ctx, args) => {
      const { flags, positional } = parseFlags(args);
      if (positional.length === 0) {
        ctx.print('rm: missing operand', 'err');
        return;
      }
      const recursive = flags.has('r') || flags.has('R') || flags.has('f');
      for (const a of positional) {
        const abs = resolvePath(ctx.cwd, a);
        const res = removeNode(ctx.vfs, abs, recursive);
        if (!res.ok) ctx.print(`rm: cannot remove '${a}': ${res.error}`, 'err');
      }
    },
  },

  mv: {
    name: 'mv',
    help: 'move or rename a file',
    run: (ctx, args) => {
      if (args.length < 2) {
        ctx.print('mv: missing file operand', 'err');
        return;
      }
      const from = resolvePath(ctx.cwd, args[0]);
      const to = resolvePath(ctx.cwd, args[1]);
      const res = moveNode(ctx.vfs, from, to, false);
      if (!res.ok) ctx.print(`mv: ${res.error}`, 'err');
    },
  },

  cp: {
    name: 'cp',
    help: 'copy a file or directory',
    run: (ctx, args) => {
      if (args.length < 2) {
        ctx.print('cp: missing file operand', 'err');
        return;
      }
      const from = resolvePath(ctx.cwd, args[0]);
      const to = resolvePath(ctx.cwd, args[1]);
      const res = moveNode(ctx.vfs, from, to, true);
      if (!res.ok) ctx.print(`cp: ${res.error}`, 'err');
    },
  },

  tree: {
    name: 'tree',
    help: 'recursive directory listing',
    run: (ctx, args) => {
      const target = args[0] ?? '.';
      const abs = resolvePath(ctx.cwd, target);
      const node = findNode(ctx.vfs, abs);
      if (!node) {
        ctx.print(`tree: ${target}: No such file or directory`, 'err');
        return;
      }
      ctx.print(basename(abs) || '/');
      if (node.type === 'dir') walkTree(node, '', ctx.print);
    },
  },

  history: {
    name: 'history',
    help: 'show command history',
    run: ctx => {
      ctx.history.forEach((line, i) => {
        ctx.print(`${pad(String(i + 1), 4)}  ${line}`);
      });
    },
  },

  open: {
    name: 'open',
    help: 'open a file or app (e.g. open paint, open resume.pdf)',
    run: (ctx, args) => openImpl(ctx, args),
  },

  start: {
    name: 'start',
    help: 'launch an app (DOS-style alias of open)',
    run: (ctx, args) => openImpl(ctx, args),
  },

  exit: {
    name: 'exit',
    help: 'close the command prompt',
    run: ctx => ctx.closeSelf(),
  },
};

function walkTree(node: VDir, prefix: string, print: (s: string) => void) {
  const items = listChildren(node, false);
  items.forEach((child, i) => {
    const last = i === items.length - 1;
    const branch = last ? '└── ' : '├── ';
    const label = child.type === 'dir' ? child.name + '/' : child.name;
    print(prefix + branch + label);
    if (child.type === 'dir') {
      walkTree(child, prefix + (last ? '    ' : '│   '), print);
    }
  });
}

function openImpl(ctx: CommandContext, args: string[]) {
  if (args.length === 0) {
    ctx.print('open: missing operand (try `open paint` or `open resume.pdf`)', 'err');
    return;
  }
  const target = args[0];

  const shortcut = findAppShortcut(target);
  if (shortcut) {
    ctx.openWindow({
      appId: shortcut.appId,
      title: shortcut.title,
      size: shortcut.size,
      singleton: true,
    });
    ctx.print(`Launching ${shortcut.title}...`, 'system');
    return;
  }

  const abs = resolvePath(ctx.cwd, target);
  const node = findNode(ctx.vfs, abs);
  if (!node) {
    ctx.print(`open: ${target}: No such file or directory`, 'err');
    return;
  }
  if (node.type === 'dir') {
    ctx.print(`open: ${target}: Is a directory`, 'err');
    return;
  }
  const action: VFileAction | undefined = node.action;
  if (!action) {
    ctx.print(`open: ${target}: not a launcher (try: cat ${target})`, 'err');
    return;
  }
  ctx.openWindow({
    appId: action.appId,
    title: action.title ?? node.name,
    payload: action.payload,
    size: action.size,
    singleton: action.appId !== 'project',
  });
  ctx.print(`Launching ${action.title ?? node.name}...`, 'system');
}

export function getCommandNames(): string[] {
  return Object.keys(COMMANDS).sort();
}

export function tokenize(input: string): string[] {
  const out: string[] = [];
  let cur = '';
  let quote: '"' | "'" | null = null;
  for (const ch of input) {
    if (quote) {
      if (ch === quote) {
        quote = null;
      } else {
        cur += ch;
      }
      continue;
    }
    if (ch === '"' || ch === "'") {
      quote = ch;
      continue;
    }
    if (ch === ' ' || ch === '\t') {
      if (cur.length > 0) {
        out.push(cur);
        cur = '';
      }
      continue;
    }
    cur += ch;
  }
  if (cur.length > 0) out.push(cur);
  return out;
}

export function runLine(input: string, ctx: CommandContext): void {
  const trimmed = input.trim();
  if (trimmed.length === 0) return;
  const tokens = tokenize(trimmed);
  const [cmd, ...args] = tokens;
  const def = COMMANDS[cmd.toLowerCase()];
  if (!def) {
    ctx.print(`'${cmd}' is not recognized as an internal or external command,`, 'err');
    ctx.print('operable program or batch file.', 'err');
    return;
  }
  def.run(ctx, args);
}

export function completePath(
  ctx: { cwd: string; vfs: VDir },
  input: string,
): { completion: string; candidates: string[] } {
  const lastSlash = input.lastIndexOf('/');
  const dirPart = lastSlash >= 0 ? input.slice(0, lastSlash + 1) : '';
  const namePart = lastSlash >= 0 ? input.slice(lastSlash + 1) : input;
  const baseAbs = resolvePath(ctx.cwd, dirPart || '.');
  const baseNode = findNode(ctx.vfs, baseAbs);
  if (!baseNode || baseNode.type !== 'dir') return { completion: input, candidates: [] };
  const matches = baseNode.children.filter(c => c.name.startsWith(namePart));
  if (matches.length === 0) return { completion: input, candidates: [] };
  if (matches.length === 1) {
    const m = matches[0];
    const suffix = m.type === 'dir' ? '/' : '';
    return { completion: dirPart + m.name + suffix, candidates: [m.name + suffix] };
  }
  const common = longestCommonPrefix(matches.map(m => m.name));
  const candidates = matches.map(m => (m.type === 'dir' ? m.name + '/' : m.name));
  return { completion: dirPart + common, candidates };
}

function longestCommonPrefix(strs: string[]): string {
  if (strs.length === 0) return '';
  let prefix = strs[0];
  for (let i = 1; i < strs.length; i++) {
    while (!strs[i].startsWith(prefix)) {
      prefix = prefix.slice(0, -1);
      if (!prefix) return '';
    }
  }
  return prefix;
}

export function bootBanner(): string[] {
  return [
    'Microsoft(R) MS-DOS(R) Version 6.22',
    '          (C) Copyright Microsoft Corp 1981-1994.',
    '',
    'Type HELP for a list of commands.',
    '',
  ];
}

export function listAppShortcutNames(): string[] {
  return getAppShortcuts().map(s => s.appId);
}

export function getAllCompletionTargets(ctx: { cwd: string; vfs: VDir }, prefix: string): string[] {
  const dirHits = completePath(ctx, prefix).candidates;
  const cmdHits = getCommandNames().filter(c => c.startsWith(prefix));
  return [...new Set([...cmdHits, ...dirHits])];
}

export const _internal = {
  joinPath,
  splitPath,
  dirname,
  resolvePath,
  buildVfs,
};
