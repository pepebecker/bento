'use client';

import { Suspense, memo, useEffect, useState } from 'react';
import { DotsSix, TrashSimple } from '@phosphor-icons/react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import BoxContentHeading from './BoxContentHeading';
import BoxContentIframe from './BoxContentIframe';
import BoxContentImage from './BoxContentImage';
import BoxContentLink from './BoxContentLink';
import BoxContentText from './BoxContentText';
import BoxItem from './BoxItem';
import EditButton from './EditButton';
import { useLayout } from './LayoutProvider';

const ReactGridLayout = WidthProvider(Responsive);

const GridLayout = memo(() => {
  const [mounted, setMounted] = useState(false);

  const { toolbarOpen, editing, minWidth, boxes, removeBox, props } =
    useLayout();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <ReactGridLayout
        {...props}
        className={cn('layout mb-12 max-w-full opacity-0', {
          'mb-60': toolbarOpen,
          animated: mounted,
          'animate-fadeIn opacity-100': mounted,
        })}
        style={{ minWidth }}
        rowHeight={48}
        draggableHandle=".drag-handle"
        useCSSTransforms
      >
        {boxes.map((box) => (
          <BoxItem key={box.id} className={cn('group flex')}>
            <div
              className={cn(
                'drag-handle invisible absolute -top-2 left-1/2 z-50 flex h-4 w-10 -translate-x-1/2 items-center justify-center rounded-full bg-white',
                { 'group-hover:visible': editing }
              )}
            >
              <DotsSix size={24} />
            </div>
            {editing ? (
              <Button
                size="icon"
                variant="outline"
                className="pointer-events-auto invisible absolute -left-2 -top-2 z-20 h-8 w-8 rounded-full bg-white text-black group-hover:visible group-active:visible"
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                onClick={() => {
                  removeBox(box.id);
                }}
              >
                <TrashSimple size={32} weight="bold" />
              </Button>
            ) : null}
            {editing ? <EditButton box={box} /> : null}
            <div
              className={cn('relative flex h-full w-full rounded-2xl', {
                'overflow-y-scroll': box.type !== 'image',
                'overflow-hidden': box.type === 'image',
                'items-end': box.type === 'heading',
              })}
              style={{
                borderWidth: box.border?.width,
                borderColor: box.border?.color,
                borderRadius: box.border?.radius,
                color: box.text?.color,
                textAlign: box.text?.align,
              }}
            >
              {box.background ? (
                <div
                  className="absolute inset-0 -z-10"
                  style={{
                    background: box.background.color,
                    opacity:
                      typeof box.background.opacity === 'number'
                        ? box.background.opacity / 100
                        : 1,
                    backdropFilter: `blur(${box.background.blur}px)`,
                  }}
                />
              ) : null}
              {box.type === 'image' ? (
                <Suspense fallback="Loading...">
                  <BoxContentImage box={box} />
                </Suspense>
              ) : null}
              {box.type === 'heading' ? (
                <Suspense fallback="Loading...">
                  <BoxContentHeading box={box} />
                </Suspense>
              ) : null}
              {box.type === 'text' || box.type === 'markdown' ? (
                <Suspense fallback="Loading...">
                  <BoxContentText box={box} />{' '}
                </Suspense>
              ) : null}
              {box.type === 'link' ? (
                <Suspense fallback="Loading...">
                  <BoxContentLink box={box} />
                </Suspense>
              ) : null}
              {box.type === 'iframe' ? (
                <Suspense fallback="Loading...">
                  <BoxContentIframe box={box} />
                </Suspense>
              ) : null}
            </div>
          </BoxItem>
        ))}
      </ReactGridLayout>
    </>
  );
});

GridLayout.displayName = 'GridLayout';

export default GridLayout;
