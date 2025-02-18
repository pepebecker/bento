import { Box } from '@/types/box';

/* eslint-disable @next/next/no-img-element */

interface Props {
  box: Box;
}

export default function BoxContentImage({ box }: Props) {
  return (
    <div className="h-full w-full" style={{ padding: box.image?.padding }}>
      <img
        src={(box.image?.src ?? '') || '/placeholder.svg'}
        alt={box.id.toString()}
        className="h-full w-full"
        style={{
          borderRadius: box.image?.radius,
          objectFit: box.image?.objectFit ?? 'cover',
        }}
      />
    </div>
  );
}
