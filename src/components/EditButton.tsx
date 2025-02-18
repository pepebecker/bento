'use client';

import { CSSProperties, useCallback, useState } from 'react';
import {
  DotsThree,
  Image,
  Link,
  MarkdownLogo,
  TextAlignCenter,
  TextAlignJustify,
  TextAlignLeft,
  TextAlignRight,
  TextH,
  TextT,
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Box, BoxType } from '@/types/box';
import { useLayout } from './LayoutProvider';
import { Input } from './ui/input';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { ToggleGroup, ToggleGroupItem } from './ui/toggle-group';

export default function EditButton({ box }: { box: Box }) {
  const [open, setOpen] = useState(false);
  const { updateBox } = useLayout();

  const setType = useCallback(
    (type: BoxType) => {
      updateBox(box.id, (box) => ({ ...box, type }));
    },
    [box.id, updateBox]
  );

  const setBorderWidth = useCallback(
    (width: string) => {
      updateBox(box.id, (box) => ({
        ...box,
        border: { ...box.border, width },
      }));
    },
    [box.id, updateBox]
  );

  const setBorderColor = useCallback(
    (color: string) => {
      updateBox(box.id, (box) => ({
        ...box,
        border: { ...box.border, color },
      }));
    },
    [box.id, updateBox]
  );

  const setBorderRadius = useCallback(
    (radius: number) => {
      updateBox(box.id, (box) => ({
        ...box,
        border: { ...box.border, radius },
      }));
    },
    [box.id, updateBox]
  );

  const setLink = useCallback(
    (link: string) => {
      updateBox(box.id, (box) => ({ ...box, link }));
    },
    [box.id, updateBox]
  );

  const setImage = useCallback(
    (src: string) => {
      updateBox(box.id, (box) => ({ ...box, image: { ...box.image, src } }));
    },
    [box.id, updateBox]
  );

  const setImageFit = useCallback(
    (objectFit: 'contain' | 'cover' | 'fill') => {
      updateBox(box.id, (box) => ({
        ...box,
        image: { ...box.image, objectFit },
      }));
    },
    [box.id, updateBox]
  );

  const setImageRadius = useCallback(
    (radius: number) => {
      console.log('setImageRadius:', radius);
      updateBox(box.id, (box) => {
        if (!box.image) return box;
        box.image.radius = radius;
        return { ...box };
      });
    },
    [box.id, updateBox]
  );

  const setImagePadding = useCallback(
    (padding: string) => {
      updateBox(box.id, (box) => {
        if (!box.image) return box;
        box.image.padding = padding;
        return { ...box };
      });
    },
    [box.id, updateBox]
  );

  const setTextAlign = useCallback(
    (align: CSSProperties['textAlign']) => {
      updateBox(box.id, (box) => ({ ...box, text: { ...box.text, align } }));
    },
    [box.id, updateBox]
  );

  const setTextColor = useCallback(
    (color: string) => {
      updateBox(box.id, (box) => ({
        ...box,
        text: { ...box.text, color },
      }));
    },
    [box.id, updateBox]
  );

  const setBackgroundColor = useCallback(
    (color: string) => {
      updateBox(box.id, (box) => ({
        ...box,
        background: { ...box.background, color },
      }));
    },
    [box.id, updateBox]
  );

  const setBackgroundOpacity = useCallback(
    (opacity: number) => {
      updateBox(box.id, (box) => ({
        ...box,
        background: { ...box.background, opacity },
      }));
    },
    [box.id, updateBox]
  );

  const setBackgroundBlur = useCallback(
    (blur: number) => {
      updateBox(box.id, (box) => ({
        ...box,
        background: { ...box.background, blur },
      }));
    },
    [box.id, updateBox]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className={cn(
            'pointer-events-auto absolute -right-2 -top-2 z-20 h-8 w-8 rounded-full bg-white text-black group-hover:visible group-active:visible',
            { invisible: !open }
          )}
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        >
          <DotsThree size={32} weight="bold" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex w-min min-w-60 flex-col gap-4 overflow-y-scroll">
        <ToggleGroup
          className="flex w-full justify-between rounded bg-input p-1"
          defaultValue="text"
          value={box.type}
          type="single"
          size="sm"
          onValueChange={setType}
        >
          <ToggleGroupItem className="flex-grow" value="heading">
            <TextH size={24} weight="bold" />
          </ToggleGroupItem>
          <ToggleGroupItem className="flex-grow" value="text">
            <TextT size={24} weight="bold" />
          </ToggleGroupItem>
          <ToggleGroupItem className="flex-grow" value="markdown">
            <MarkdownLogo size={24} weight="bold" />
          </ToggleGroupItem>
          <ToggleGroupItem className="flex-grow" value="image">
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image size={24} weight="bold" />
          </ToggleGroupItem>
          <ToggleGroupItem className="flex-grow" value="link">
            <Link size={24} weight="bold" />
          </ToggleGroupItem>
        </ToggleGroup>
        {box.type === 'heading' ||
        box.type === 'text' ||
        box.type === 'markdown' ? (
          <div className="flex flex-wrap gap-1">
            <label className="w-full">Text</label>
            <ToggleGroup
              className="flex w-full justify-between rounded bg-input p-1"
              defaultValue="left"
              value={box.text?.align}
              type="single"
              size="sm"
              onValueChange={(value) =>
                setTextAlign(value as CSSProperties['textAlign'])
              }
            >
              <ToggleGroupItem className="flex-grow" value="left">
                <TextAlignLeft size={32} weight="bold" />
              </ToggleGroupItem>
              <ToggleGroupItem className="flex-grow" value="center">
                <TextAlignCenter size={32} weight="bold" />
              </ToggleGroupItem>
              <ToggleGroupItem className="flex-grow" value="right">
                <TextAlignRight size={32} weight="bold" />
              </ToggleGroupItem>
              <ToggleGroupItem className="flex-grow" value="justify">
                <TextAlignJustify size={32} weight="bold" />
              </ToggleGroupItem>
            </ToggleGroup>
            <ColorButton color="white" onSelect={setTextColor} />
            <ColorButton color="gray" onSelect={setTextColor} />
            <ColorButton color="black" onSelect={setTextColor} />
            <ColorButton color="tomato" onSelect={setTextColor} />
            <ColorButton color="red" onSelect={setTextColor} />
            <ColorButton color="orange" onSelect={setTextColor} />
            <ColorButton color="green" onSelect={setTextColor} />
            <ColorButton color="skyblue" onSelect={setTextColor} />
          </div>
        ) : null}
        {box.type === 'link' ? (
          <div className="flex flex-wrap gap-1">
            <label className="w-full">Link</label>
            <Input
              placeholder="Link"
              value={box.link ?? ''}
              onChange={(e) => setLink(e.target.value)}
            />
          </div>
        ) : null}
        {box.type === 'image' || box.type === 'link' ? (
          <div className="flex flex-wrap gap-1">
            <label className="w-full">Image</label>
            <ToggleGroup
              className="flex w-full justify-between rounded bg-input p-1"
              defaultValue="cover"
              value={box.image?.objectFit}
              type="single"
              size="sm"
              onValueChange={(value) =>
                setImageFit(value as 'contain' | 'cover' | 'fill')
              }
            >
              <ToggleGroupItem className="flex-grow" value="contain">
                Contain
              </ToggleGroupItem>
              <ToggleGroupItem className="flex-grow" value="cover">
                Cover
              </ToggleGroupItem>
              <ToggleGroupItem className="flex-grow" value="fill">
                Fill
              </ToggleGroupItem>
            </ToggleGroup>
            <Input
              placeholder="Image URL"
              value={box.image?.src ?? ''}
              onChange={(e) => setImage(e.target.value)}
            />
            <Input
              placeholder="Image Radius"
              value={box.image?.radius ?? ''}
              onChange={(e) => setImageRadius(Number(e.target.value))}
              min={0}
              type="number"
            />
            <Input
              placeholder="Image Padding"
              value={box.image?.padding ?? ''}
              onChange={(e) => setImagePadding(e.target.value)}
            />
          </div>
        ) : null}
        <div className="flex flex-wrap gap-1">
          <label className="w-full">Border</label>
          <Input
            placeholder="Border Width"
            value={box.border?.width ?? ''}
            onChange={(e) => setBorderWidth(e.target.value)}
          />
          <Input
            placeholder="Border Color"
            value={box.border?.color ?? ''}
            onChange={(e) => setBorderColor(e.target.value)}
          />
          <Input
            placeholder="Corner Radius"
            value={box.border?.radius ?? ''}
            onChange={(e) => setBorderRadius(Number(e.target.value))}
            min={0}
            type="number"
          />
        </div>
        <div className="flex flex-wrap gap-1">
          <label className="w-full">Background</label>
          <ColorButton color="white" onSelect={setBackgroundColor} />
          <ColorButton color="#eeeeee" onSelect={setBackgroundColor} />
          <ColorButton color="#EA5455" onSelect={setBackgroundColor} />
          <ColorButton color="#F07B3F" onSelect={setBackgroundColor} />
          <ColorButton color="#FFD460" onSelect={setBackgroundColor} />
          <ColorButton color="#DDEB9D" onSelect={setBackgroundColor} />
          <ColorButton color="#A0C878" onSelect={setBackgroundColor} />
          <ColorButton color="#27667B" onSelect={setBackgroundColor} />
          <ColorButton color="#143D60" onSelect={setBackgroundColor} />
          <ColorButton color="#2D4059" onSelect={setBackgroundColor} />
          <ColorButton color="#3674B5" onSelect={setBackgroundColor} />
          <ColorButton color="#A1E3F9" onSelect={setBackgroundColor} />
          <Input
            placeholder="Opacity"
            value={box.background?.opacity ?? 100}
            onChange={(e) => setBackgroundOpacity(Number(e.target.value))}
            type="number"
            min={0}
            max={100}
          />
          <Input
            placeholder="Blur"
            value={box.background?.blur ?? 0}
            onChange={(e) => setBackgroundBlur(Number(e.target.value))}
            type="number"
            min={0}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}

interface ColorButtonProps {
  color: string;
  onSelect?: (color: string) => void;
}

function ColorButton({ color, onSelect, ...props }: ColorButtonProps) {
  return (
    <Button
      {...props}
      size="icon"
      className="h-6 w-6 rounded-full border"
      style={{ background: color }}
      onClick={() => onSelect?.(color)}
    />
  );
}
