import { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { useLayout } from './LayoutProvider';

interface Props extends ButtonHTMLAttributes<HTMLDivElement> {
  editing?: boolean;
}

export default function BoxItem(props: Props) {
  const { editing } = useLayout();
  return (
    <div
      {...props}
      className={cn(
        'relative z-10 rounded border-[.5px] backdrop-blur-sm active:z-50',
        '[&>.react-resizable-handle]:invisible',
        {
          '[&:hover>.react-resizable-handle]:visible': editing,
          'cursor-grab active:cursor-grabbing': editing,
          'hover:bg-white hover:bg-opacity-20': editing,
          'border-transparent': !editing,
        },
        props.className
      )}
    />
  );
}
