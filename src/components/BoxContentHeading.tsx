'use client';

import { useCallback } from 'react';
import { Box } from '@/types/box';
import { useLayout } from './LayoutProvider';
import { Input } from './ui/input';

interface Props {
  box: Box;
}

export default function BoxContentHeading({ box }: Props) {
  const { editing, updateBox } = useLayout();

  const setText = useCallback(
    (id: number, content: string) => {
      updateBox(id, (box) => ({ ...box, text: { ...box.text, content } }));
    },
    [updateBox]
  );

  return (
    <label className="flex h-full w-full">
      <Input
        className="mt-auto h-min w-full border-none px-4 py-0 !text-lg font-semibold shadow-none focus-visible:ring-0 disabled:cursor-default disabled:opacity-100"
        style={{ textAlign: box.text?.align }}
        value={box.text?.content ?? ''}
        onChange={(e) => setText(box.id, e.target.value)}
        disabled={!editing}
      />
    </label>
  );
}
