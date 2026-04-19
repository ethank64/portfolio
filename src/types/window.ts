export type AppId =
  | 'mycomputer'
  | 'aboutme'
  | 'projects'
  | 'project'
  | 'resume'
  | 'contact'
  | 'ie'
  | 'recycle'
  | 'minesweeper'
  | 'paint';

export interface WindowInstance {
  id: string;
  appId: AppId;
  title: string;
  zIndex: number;
  minimized: boolean;
  position: { x: number; y: number };
  size?: { width: number; height: number };
  payload?: Record<string, unknown>;
}
