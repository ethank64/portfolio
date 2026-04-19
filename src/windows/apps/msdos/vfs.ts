import type { AppId } from '../../../types/window';
import { bio } from '../../../data/bio';
import { projects } from '../../../data/projects';
import { contact } from '../../../data/contact';

export interface VFileAction {
  appId: AppId;
  payload?: Record<string, unknown>;
  title?: string;
  size?: { width: number; height: number };
}

export interface VFile {
  type: 'file';
  name: string;
  content: string;
  action?: VFileAction;
}

export interface VDir {
  type: 'dir';
  name: string;
  children: VNode[];
}

export type VNode = VFile | VDir;

export const HOME_PATH = '/home/ethan';

export function splitPath(p: string): string[] {
  return p.split('/').filter(seg => seg.length > 0);
}

export function joinPath(segments: string[]): string {
  return '/' + segments.join('/');
}

export function resolvePath(cwd: string, input: string): string {
  if (!input || input === '.') return normalizePath(cwd);
  let working = input;
  if (working === '~') working = HOME_PATH;
  else if (working.startsWith('~/')) working = HOME_PATH + working.slice(1);

  const isAbsolute = working.startsWith('/');
  const base = isAbsolute ? [] : splitPath(cwd);
  const parts = splitPath(working);
  const out: string[] = [...base];
  for (const seg of parts) {
    if (seg === '.') continue;
    if (seg === '..') {
      if (out.length > 0) out.pop();
      continue;
    }
    out.push(seg);
  }
  return joinPath(out);
}

function normalizePath(p: string): string {
  return joinPath(splitPath(p));
}

export function findNode(root: VDir, absPath: string): VNode | undefined {
  const segs = splitPath(absPath);
  let cur: VNode = root;
  for (const seg of segs) {
    if (cur.type !== 'dir') return undefined;
    const next: VNode | undefined = cur.children.find(c => c.name === seg);
    if (!next) return undefined;
    cur = next;
  }
  return cur;
}

export function findParent(
  root: VDir,
  absPath: string,
): { parent: VDir; name: string } | undefined {
  const segs = splitPath(absPath);
  if (segs.length === 0) return undefined;
  const name = segs[segs.length - 1];
  const parentPath = joinPath(segs.slice(0, -1));
  const parent = findNode(root, parentPath);
  if (!parent || parent.type !== 'dir') return undefined;
  return { parent, name };
}

export function dirname(absPath: string): string {
  const segs = splitPath(absPath);
  return joinPath(segs.slice(0, -1));
}

export function basename(absPath: string): string {
  const segs = splitPath(absPath);
  return segs[segs.length - 1] ?? '';
}

export function dosifyPath(absPath: string): string {
  const segs = splitPath(absPath);
  if (segs.length === 0) return 'C:\\';
  return 'C:\\' + segs.join('\\').toUpperCase();
}

function file(name: string, content: string, action?: VFileAction): VFile {
  return { type: 'file', name, content, action };
}

function dir(name: string, children: VNode[]): VDir {
  return { type: 'dir', name, children };
}

function buildAboutTxt(): string {
  const lines: string[] = [];
  lines.push(bio.name);
  lines.push(bio.title);
  lines.push('='.repeat(Math.max(bio.name.length, bio.title.length)));
  lines.push('');
  for (const p of bio.paragraphs) {
    lines.push(p);
    lines.push('');
  }
  lines.push('Technical Skills');
  lines.push('----------------');
  for (const [group, items] of Object.entries(bio.skills)) {
    lines.push(`${group}:`);
    for (const item of items) lines.push(`  - ${item}`);
    lines.push('');
  }
  return lines.join('\n');
}

function buildWhoamiTxt(): string {
  return `${bio.name}\n${bio.title}\n`;
}

function buildContactTxt(): string {
  const lines: string[] = [];
  lines.push('Contact');
  lines.push('=======');
  for (const m of contact.methods) lines.push(`${m.label}: ${m.value}`);
  lines.push('');
  lines.push('Socials');
  lines.push('-------');
  for (const s of contact.socials) lines.push(`${s.label}: ${s.value}`);
  return lines.join('\n') + '\n';
}

function buildProjectReadme(p: (typeof projects)[number]): string {
  const lines: string[] = [];
  lines.push(p.title);
  lines.push('='.repeat(p.title.length));
  lines.push('');
  lines.push(p.summary);
  lines.push('');
  lines.push(p.longDescription);
  lines.push('');
  lines.push('Impact');
  lines.push('------');
  for (const i of p.impact) lines.push(`  - ${i}`);
  return lines.join('\n') + '\n';
}

function buildProjectLinks(p: (typeof projects)[number]): string {
  const lines: string[] = [];
  lines.push(`GitHub: ${p.githubUrl}`);
  if (p.liveUrl) lines.push(`Live:   ${p.liveUrl}`);
  return lines.join('\n') + '\n';
}

interface AppShortcut {
  fileName: string;
  appId: AppId;
  title: string;
  size: { width: number; height: number };
  description: string;
}

const APP_SHORTCUTS: AppShortcut[] = [
  {
    fileName: 'mycomputer.lnk',
    appId: 'mycomputer',
    title: 'My Computer',
    size: { width: 540, height: 420 },
    description: 'My Computer - browse drives and folders.',
  },
  {
    fileName: 'aboutme.lnk',
    appId: 'aboutme',
    title: 'AboutMe.txt - Notepad',
    size: { width: 520, height: 480 },
    description: 'AboutMe.txt opened in Notepad.',
  },
  {
    fileName: 'projects.lnk',
    appId: 'projects',
    title: 'Projects',
    size: { width: 520, height: 380 },
    description: 'Projects folder.',
  },
  {
    fileName: 'resume.lnk',
    appId: 'resume',
    title: 'Resume.pdf - Acrobat Reader',
    size: { width: 720, height: 600 },
    description: 'Resume.pdf opened in Acrobat Reader.',
  },
  {
    fileName: 'contact.lnk',
    appId: 'contact',
    title: 'Inbox - Outlook Express',
    size: { width: 720, height: 540 },
    description: 'Outlook Express inbox.',
  },
  {
    fileName: 'ie.lnk',
    appId: 'ie',
    title: 'Welcome - Microsoft Internet Explorer',
    size: { width: 640, height: 500 },
    description: 'Microsoft Internet Explorer.',
  },
  {
    fileName: 'minesweeper.lnk',
    appId: 'minesweeper',
    title: 'Minesweeper',
    size: { width: 240, height: 320 },
    description: 'Classic Minesweeper game.',
  },
  {
    fileName: 'paint.lnk',
    appId: 'paint',
    title: 'untitled - Paint',
    size: { width: 560, height: 480 },
    description: 'MS Paint - draw something.',
  },
  {
    fileName: 'recycle.lnk',
    appId: 'recycle',
    title: 'Recycle Bin',
    size: { width: 460, height: 320 },
    description: 'Recycle Bin contents.',
  },
];

export function getAppShortcuts(): AppShortcut[] {
  return APP_SHORTCUTS;
}

export function findAppShortcut(name: string): AppShortcut | undefined {
  const lower = name.toLowerCase();
  return APP_SHORTCUTS.find(
    s => s.appId === lower || s.fileName === lower || s.fileName.replace('.lnk', '') === lower,
  );
}

export function buildVfs(): VDir {
  const projectDirs: VNode[] = projects.map(p =>
    dir(p.id, [
      file('README.md', buildProjectReadme(p)),
      file('tech.txt', p.technologies.join('\n') + '\n'),
      file('links.txt', buildProjectLinks(p)),
      file(
        'open',
        `Shortcut: opens "${p.title}" project window.\nUse: open ${p.id}/open\n`,
        {
          appId: 'project',
          title: p.title,
          size: { width: 720, height: 540 },
          payload: { projectId: p.id },
        },
      ),
    ]),
  );

  const appsDir = dir(
    'apps',
    APP_SHORTCUTS.map(s =>
      file(s.fileName, `${s.description}\nLaunch: open ${s.appId}\n`, {
        appId: s.appId,
        title: s.title,
        size: s.size,
      }),
    ),
  );

  const ethanDir = dir('ethan', [
    file('about.txt', buildAboutTxt()),
    file('whoami.txt', buildWhoamiTxt()),
    file('contact.txt', buildContactTxt()),
    file('resume.pdf', 'Binary file (PDF). Use: open resume.pdf\n', {
      appId: 'resume',
      title: 'Resume.pdf - Acrobat Reader',
      size: { width: 720, height: 600 },
    }),
    dir('projects', projectDirs),
    appsDir,
  ]);

  const root = dir('', [dir('home', [ethanDir])]);
  return root;
}

export function makeDir(root: VDir, absPath: string): { ok: boolean; error?: string } {
  if (findNode(root, absPath)) return { ok: false, error: 'File exists' };
  const info = findParent(root, absPath);
  if (!info) return { ok: false, error: 'No such file or directory' };
  info.parent.children.push(dir(info.name, []));
  return { ok: true };
}

export function touchFile(root: VDir, absPath: string): { ok: boolean; error?: string } {
  const existing = findNode(root, absPath);
  if (existing) return { ok: true };
  const info = findParent(root, absPath);
  if (!info) return { ok: false, error: 'No such file or directory' };
  info.parent.children.push(file(info.name, ''));
  return { ok: true };
}

export function writeFile(
  root: VDir,
  absPath: string,
  content: string,
  append: boolean,
): { ok: boolean; error?: string } {
  const existing = findNode(root, absPath);
  if (existing && existing.type === 'dir') {
    return { ok: false, error: 'Is a directory' };
  }
  if (existing && existing.type === 'file') {
    existing.content = append ? existing.content + content : content;
    return { ok: true };
  }
  const info = findParent(root, absPath);
  if (!info) return { ok: false, error: 'No such file or directory' };
  info.parent.children.push(file(info.name, content));
  return { ok: true };
}

export function removeNode(
  root: VDir,
  absPath: string,
  recursive: boolean,
): { ok: boolean; error?: string } {
  const node = findNode(root, absPath);
  if (!node) return { ok: false, error: 'No such file or directory' };
  if (node.type === 'dir' && !recursive && node.children.length > 0) {
    return { ok: false, error: 'Directory not empty (use -r)' };
  }
  const info = findParent(root, absPath);
  if (!info) return { ok: false, error: 'Cannot remove root' };
  info.parent.children = info.parent.children.filter(c => c.name !== info.name);
  return { ok: true };
}

export function moveNode(
  root: VDir,
  fromPath: string,
  toPath: string,
  copy: boolean,
): { ok: boolean; error?: string } {
  const src = findNode(root, fromPath);
  if (!src) return { ok: false, error: 'No such file or directory' };
  const srcInfo = findParent(root, fromPath);
  if (!srcInfo) return { ok: false, error: 'Cannot move root' };

  let destPath = toPath;
  const destNode = findNode(root, destPath);
  if (destNode && destNode.type === 'dir') {
    destPath = (destPath === '/' ? '' : destPath) + '/' + src.name;
    if (findNode(root, destPath)) {
      return { ok: false, error: 'Destination exists' };
    }
  } else if (destNode) {
    return { ok: false, error: 'Destination exists' };
  }

  const destInfo = findParent(root, destPath);
  if (!destInfo) return { ok: false, error: 'Invalid destination' };

  const cloned = copy ? cloneNode(src, destInfo.name) : { ...src, name: destInfo.name };
  destInfo.parent.children.push(cloned);
  if (!copy) {
    srcInfo.parent.children = srcInfo.parent.children.filter(c => c.name !== srcInfo.name);
  }
  return { ok: true };
}

function cloneNode(node: VNode, newName: string): VNode {
  if (node.type === 'file') {
    return { type: 'file', name: newName, content: node.content, action: node.action };
  }
  return {
    type: 'dir',
    name: newName,
    children: node.children.map(c => cloneNode(c, c.name)),
  };
}
