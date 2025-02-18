'use client';

import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  ItemCallback,
  Layout,
  Layouts,
  ResponsiveProps,
} from 'react-grid-layout';
import { Box, BoxType, Boxes } from '@/types/box';

const MIN_WIDTH = 200;
const MARGIN = 10;
const BREAKPOINTS = {
  xl: MIN_WIDTH * 6 + MARGIN * 8,
  lg: MIN_WIDTH * 5 + MARGIN * 7,
  md: MIN_WIDTH * 4 + MARGIN * 6,
  sm: MIN_WIDTH * 3 + MARGIN * 5,
  xs: MIN_WIDTH * 2 + MARGIN * 4,
  xxs: 0,
};
const COLUMNS = { xl: 6, lg: 5, md: 4, sm: 3, xs: 2, xxs: 1 };
const DEFAULT_LAYOUTS: Layouts = {
  xxs: [],
  xs: [],
  sm: [],
  md: [],
  lg: [],
  xl: [],
};

interface LayoutContextType {
  toolbarOpen: boolean;
  editing: boolean;
  boxes: Box[];
  props: ResponsiveProps;
  minWidth: number;
  setToolbarOpen: (open: boolean) => void;
  setEditing: (editing: boolean) => void;
  addBox: (type: BoxType) => void;
  updateBox: (id: number, fn: (box: Box) => Box) => void;
  removeBox: (id: number) => void;
}

const LayoutContext = createContext<LayoutContextType>({
  toolbarOpen: false,
  editing: false,
  boxes: [],
  props: {},
  minWidth: MIN_WIDTH,
  setToolbarOpen: () => {},
  setEditing: () => {},
  addBox: () => {},
  updateBox: () => {},
  removeBox: () => {},
});

interface LayoutProviderProps {
  children: ReactNode;
}

export const LayoutProvider = ({ children }: LayoutProviderProps) => {
  const [toolbarOpen, setToolbarOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [boxes, setBoxes] = useState<Record<string, Box>>({});
  const [currentBreakpoint, setCurrentBreakpoint] = useState<string>('xxs');
  const [layouts, setLayouts] = useState<Layouts>(DEFAULT_LAYOUTS);

  useEffect(() => {
    loadBoxes()
      .then((boxes) => boxes && setBoxes(boxes))
      .then(loadLayouts)
      .then((layouts) => layouts && setLayouts(layouts));
  }, []);

  const boxesList = useMemo(() => {
    return Object.values(boxes);
  }, [boxes]);

  const onBreakpointChange = useCallback((breakpoint: string) => {
    setCurrentBreakpoint(breakpoint);
  }, []);

  const onResizeStop: ItemCallback = useCallback(
    (newLayout) => {
      const newLayouts = { ...layouts };
      newLayouts[currentBreakpoint] = newLayout;
      setLayouts(newLayouts);
      saveLayouts(layouts);
    },
    [currentBreakpoint, layouts]
  );

  const onDragStop: ItemCallback = useCallback(
    (newLayout) => {
      const newLayouts = { ...layouts };
      newLayouts[currentBreakpoint] = newLayout;
      setLayouts(newLayouts);
      saveLayouts(layouts);
    },
    [currentBreakpoint, layouts]
  );

  const addBox = useCallback(
    (type: BoxType) => {
      const boxId = Math.max(...Object.keys(boxes).map(Number), 0) + 1;
      const box: Box = { id: boxId, type };

      if (type === 'heading') {
        box.text = { align: 'left', content: 'Heading' };
      }

      if (type === 'text') {
        box.text = { align: 'left', content: 'Text' };
      }

      if (type === 'markdown') {
        box.text = { align: 'left', content: '### Markdown' };
      }

      const newItem: Layout = {
        i: boxId.toString(),
        x: 0,
        y: 0,
        w: 1,
        h: 1,
      };

      console.log('addBox', box, newItem);

      setBoxes((boxes) => {
        const newBoxes = {
          ...boxes,
          [boxId.toString()]: box,
        };
        saveBoxes(newBoxes);
        return newBoxes;
      });

      setLayouts((layouts) => {
        layouts.xxs.push(newItem);
        saveLayouts(layouts);
        return { ...layouts };
      });
    },
    [boxes]
  );

  const updateBox = useCallback((id: number, fn: (box: Box) => Box) => {
    console.log('updateBox:', id);
    setBoxes((boxes) => {
      boxes[id] = fn(boxes[id]);
      saveBoxes(boxes);
      return { ...boxes };
    });
  }, []);

  const removeBox = useCallback((id: number) => {
    console.log('removeBox:', id);
    setBoxes((boxes) => {
      delete boxes[id];
      saveBoxes(boxes);
      return { ...boxes };
    });

    setLayouts((layouts) => {
      const newLayouts = { ...layouts };
      for (const key in layouts) {
        layouts[key] = layouts[key].filter((item) => item.i !== id.toString());
      }
      saveLayouts(newLayouts);
      return newLayouts;
    });
  }, []);

  const props: ResponsiveProps = useMemo(
    () => ({
      layouts,
      breakpoints: BREAKPOINTS,
      cols: COLUMNS,
      margin: [MARGIN, MARGIN],
      isDraggable: editing,
      onBreakpointChange,
      // handleLayoutChange,
      onDragStop,
      onResizeStop,
    }),
    [editing, layouts, onBreakpointChange, onDragStop, onResizeStop]
  );

  const value = useMemo(
    () => ({
      toolbarOpen,
      editing,
      boxes: boxesList,
      props,
      minWidth: MIN_WIDTH,
      setToolbarOpen,
      setEditing,
      addBox,
      updateBox,
      removeBox,
    }),
    [addBox, boxesList, editing, props, removeBox, toolbarOpen, updateBox]
  );

  return (
    <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
  );
};

export function useLayout() {
  return useContext(LayoutContext);
}

async function saveLayouts(layouts: Layouts) {
  const data = JSON.stringify(layouts);
  localStorage.setItem('layouts', data);
}

async function loadLayouts(): Promise<Layouts | undefined> {
  // const data = localStorage.getItem('layouts');
  // if (!data) return;
  // return JSON.parse(data);
  const res = await fetch('/data/layouts.json');
  const data = await res.json();
  return data;
}

async function saveBoxes(boxes: Boxes) {
  const data = JSON.stringify(boxes);
  localStorage.setItem('boxes', data);
}

async function loadBoxes(): Promise<Boxes | undefined> {
  // const data = localStorage.getItem('boxes');
  // if (!data) return;
  // return JSON.parse(data);
  const res = await fetch('/data/boxes.json');
  const data = await res.json();
  return data;
}
