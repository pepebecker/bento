'use client';

import { useCallback } from 'react';
import Markdown from 'react-markdown';
import { cn } from '@/lib/utils';
import { Box } from '@/types/box';
import { useLayout } from './LayoutProvider';

interface Props {
  box: Box;
}

export default function BoxContentText({ box }: Props) {
  const { editing, updateBox } = useLayout();

  const setTextContent = useCallback(
    (id: string, content: string) => {
      updateBox(id, (box) => ({ ...box, text: { ...box.text, content } }));
    },
    [updateBox]
  );

  if (!editing && box.type === 'markdown') {
    return (
      <Markdown
        className={cn(
          'markdown w-full overflow-y-scroll p-4',
          `align-${box.text?.align ?? 'left'}`
        )}
      >
        {box.text?.content}
      </Markdown>
    );
  }

  return (
    <textarea
      className={cn(
        'h-full w-full resize-none overflow-y-scroll bg-transparent p-4 focus:outline-none',
        { 'font-mono text-[0.9em]': box.type === 'markdown' }
      )}
      style={{
        color: box.text?.color,
        textAlign: box.text?.align,
      }}
      value={box.text?.content ?? ''}
      onChange={(e) => setTextContent(box.id, e.target.value)}
      disabled={!editing}
    />
  );
}
