import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { AppId, WindowInstance } from '../types/window';

interface OpenOptions {
  appId: AppId;
  title: string;
  payload?: Record<string, unknown>;
  size?: { width: number; height: number };
  position?: { x: number; y: number };
  singleton?: boolean;
}

interface WindowManagerContextValue {
  windows: WindowInstance[];
  activeId: string | null;
  openWindow: (options: OpenOptions) => string;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  toggleMinimize: (id: string) => void;
  updatePosition: (id: string, position: { x: number; y: number }) => void;
}

const WindowManagerContext = createContext<WindowManagerContextValue | null>(null);

const DEFAULT_SIZE = { width: 520, height: 380 };

export function WindowManagerProvider({ children }: { children: ReactNode }) {
  const [windows, setWindows] = useState<WindowInstance[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const zCounter = useRef(10);
  const idCounter = useRef(0);
  const cascadeOffset = useRef(0);

  const focusWindow = useCallback((id: string) => {
    zCounter.current += 1;
    const newZ = zCounter.current;
    setWindows(prev =>
      prev.map(w => (w.id === id ? { ...w, zIndex: newZ, minimized: false } : w)),
    );
    setActiveId(id);
  }, []);

  const openWindow = useCallback(
    ({ appId, title, payload, size, position, singleton }: OpenOptions) => {
      let resultId = '';
      setWindows(prev => {
        if (singleton) {
          const existing = prev.find(w => w.appId === appId);
          if (existing) {
            resultId = existing.id;
            zCounter.current += 1;
            const newZ = zCounter.current;
            return prev.map(w =>
              w.id === existing.id ? { ...w, zIndex: newZ, minimized: false } : w,
            );
          }
        }
        idCounter.current += 1;
        const id = `${appId}-${idCounter.current}`;
        resultId = id;
        zCounter.current += 1;
        cascadeOffset.current = (cascadeOffset.current + 24) % 200;
        const offset = cascadeOffset.current;
        const finalSize = size ?? DEFAULT_SIZE;
        const fallbackPos = {
          x: Math.max(40, Math.round(window.innerWidth / 2 - finalSize.width / 2 + offset - 100)),
          y: Math.max(20, Math.round(window.innerHeight / 2 - finalSize.height / 2 + offset - 100)),
        };
        const next: WindowInstance = {
          id,
          appId,
          title,
          zIndex: zCounter.current,
          minimized: false,
          position: position ?? fallbackPos,
          size: finalSize,
          payload,
        };
        return [...prev, next];
      });
      setActiveId(resultId);
      return resultId;
    },
    [],
  );

  const closeWindow = useCallback((id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
    setActiveId(prev => (prev === id ? null : prev));
  }, []);

  const toggleMinimize = useCallback((id: string) => {
    setWindows(prev =>
      prev.map(w => (w.id === id ? { ...w, minimized: !w.minimized } : w)),
    );
    setActiveId(prev => (prev === id ? null : prev));
  }, []);

  const updatePosition = useCallback(
    (id: string, position: { x: number; y: number }) => {
      setWindows(prev => prev.map(w => (w.id === id ? { ...w, position } : w)));
    },
    [],
  );

  const value = useMemo<WindowManagerContextValue>(
    () => ({
      windows,
      activeId,
      openWindow,
      closeWindow,
      focusWindow,
      toggleMinimize,
      updatePosition,
    }),
    [windows, activeId, openWindow, closeWindow, focusWindow, toggleMinimize, updatePosition],
  );

  return (
    <WindowManagerContext.Provider value={value}>
      {children}
    </WindowManagerContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useWindowManager() {
  const ctx = useContext(WindowManagerContext);
  if (!ctx) throw new Error('useWindowManager must be used within WindowManagerProvider');
  return ctx;
}
