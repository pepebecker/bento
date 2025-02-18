import { CSSProperties } from 'react';

export type BoxType = 'heading' | 'text' | 'markdown' | 'image' | 'link';

export interface Box {
  id: number;
  type: BoxType;
  link?: string;
  text?: {
    type?: string;
    content?: string;
    align?: CSSProperties['textAlign'];
    color?: string;
  };
  background?: {
    color?: string;
    opacity?: number;
    blur?: number;
  };
  border?: {
    color?: string;
    width?: string;
    radius?: number;
  };
  image?: {
    src?: string;
    alt?: string;
    padding?: string;
    radius?: number;
    objectFit?: 'contain' | 'cover' | 'fill';
    align?: string;
  };
}

export type Boxes = Record<string, Box>;
