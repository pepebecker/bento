'use client';

import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { ref, remove, set } from 'firebase/database';
import omitBy from 'lodash.omitby';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
  ItemCallback,
  Layout,
  Layouts,
  ResponsiveProps,
} from 'react-grid-layout';
import { auth, db } from '@/lib/firebase';
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
  updateBox: (id: string, fn: (box: Box) => Box) => void;
  removeBox: (id: string) => void;
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

export function omitUndefined<T extends object>(obj: T): T {
  if (Array.isArray(obj)) return obj.map((v) => omitUndefined(v)) as T;
  return omitBy(obj, (v) => typeof v === 'undefined') as T;
}

interface LayoutProviderProps {
  boxes?: Boxes;
  layouts?: Layouts;
  children: ReactNode;
}

export const LayoutProvider = (props: LayoutProviderProps) => {
  const [user] = useAuthState(auth);

  const [toolbarOpen, setToolbarOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [boxes, setBoxes] = useState<Record<string, Box>>(props.boxes ?? {});
  const [layouts, setLayouts] = useState<Layouts>(
    props.layouts ?? DEFAULT_LAYOUTS
  );
  const [currentBreakpoint, setCurrentBreakpoint] = useState<string>('xxs');
  const boxesList = useMemo(() => Object.values(boxes), [boxes]);

  // useEffect(() => {
  //   loadBoxes()
  //     .then((boxes) => boxes && setBoxes(boxes))
  //     .then(loadLayouts)
  //     .then((layouts) => layouts && setLayouts(layouts));
  // }, []);

  const onBreakpointChange = useCallback((breakpoint: string) => {
    setCurrentBreakpoint(breakpoint);
  }, []);

  const updateLayout = useCallback(
    (breakpoint: string, newLayout: Layout[]) => {
      newLayout = omitUndefined(newLayout);
      const newLayouts = { ...layouts, [breakpoint]: newLayout };
      setLayouts(newLayouts);
      saveLayouts(newLayouts);
      if (user) {
        set(ref(db, `users/${user.uid}/layouts/${breakpoint}`), newLayout);
      }
    },
    [layouts, user]
  );

  const onResizeStop: ItemCallback = useCallback(
    (newLayout) => updateLayout(currentBreakpoint, newLayout),
    [currentBreakpoint, updateLayout]
  );

  const onDragStop: ItemCallback = useCallback(
    (newLayout) => updateLayout(currentBreakpoint, newLayout),
    [currentBreakpoint, updateLayout]
  );

  const addBox = useCallback(
    (type: BoxType) => {
      const boxId = crypto.randomUUID();
      const newBox: Box = { id: boxId, type };

      if (type === 'heading') {
        newBox.text = { align: 'left', content: 'Heading' };
      }

      if (type === 'text') {
        newBox.text = { align: 'left', content: 'Text' };
      }

      if (type === 'markdown') {
        newBox.text = { align: 'left', content: '### Markdown' };
      }

      const newLayoutItem: Layout = {
        i: boxId.toString(),
        x: 0,
        y: 0,
        w: 1,
        h: 1,
      };

      console.log('addBox', newBox, newLayoutItem);

      setBoxes((boxes) => {
        const newBoxes = {
          ...boxes,
          [boxId.toString()]: newBox,
        };
        saveBoxes(newBoxes);
        return newBoxes;
      });

      setLayouts((layouts) => {
        layouts.xxs.push(newLayoutItem);
        saveLayouts(layouts);
        return { ...layouts };
      });

      if (user) {
        set(ref(db, `users/${user.uid}/boxes/${boxId}`), newBox);
      }
    },
    [user]
  );

  const updateBox = useCallback(
    (id: string, fn: (box: Box) => Box) => {
      console.log('updateBox:', id);
      setBoxes((boxes) => {
        boxes[id] = fn(boxes[id]);
        saveBoxes(boxes);
        if (user) {
          set(ref(db, `users/${user.uid}/boxes/${id}`), boxes[id]);
        }
        return { ...boxes };
      });
    },
    [user]
  );

  const removeBox = useCallback(
    (id: string) => {
      console.log('removeBox:', id);
      setBoxes((boxes) => {
        delete boxes[id];
        saveBoxes(boxes);
        return { ...boxes };
      });

      setLayouts((layouts) => {
        const newLayouts = { ...layouts };
        for (const key in layouts) {
          layouts[key] = layouts[key].filter(
            (item) => item.i !== id.toString()
          );
        }
        saveLayouts(newLayouts);
        return newLayouts;
      });

      if (user) {
        remove(ref(db, `users/${user.uid}/boxes/${id}`));
        for (const key in layouts) {
          set(
            ref(db, `users/${user.uid}/layouts/${key}`),
            layouts[key].filter((item) => item.i !== id.toString())
          );
        }
      }
    },
    [layouts, user]
  );

  const rglProps: ResponsiveProps = useMemo(
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
      props: rglProps,
      minWidth: MIN_WIDTH,
      setToolbarOpen,
      setEditing,
      addBox,
      updateBox,
      removeBox,
    }),
    [addBox, boxesList, editing, removeBox, rglProps, toolbarOpen, updateBox]
  );

  return (
    <LayoutContext.Provider value={value}>
      {props.children}
    </LayoutContext.Provider>
  );
};

export function useLayout() {
  return useContext(LayoutContext);
}

async function saveLayouts(layouts: Layouts) {
  const data = JSON.stringify(layouts);
  localStorage.setItem('layouts', data);
}

// async function loadLayouts(): Promise<Layouts | undefined> {
// const data = localStorage.getItem('layouts');
// if (!data) return;
// return JSON.parse(data);
// }

async function saveBoxes(boxes: Boxes) {
  const data = JSON.stringify(boxes);
  localStorage.setItem('boxes', data);
}

// async function loadBoxes(): Promise<Boxes | undefined> {
// const data = localStorage.getItem('boxes');
// if (!data) return;
// return JSON.parse(data);
// }
