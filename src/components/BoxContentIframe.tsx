import { memo } from 'react';
import { Box } from '@/types/box';

interface Props {
  box: Box;
}

const BoxContentIframe = memo(({ box }: Props) => {
  return (
    <iframe
      src={box.link}
      className="h-full w-full"
      style={{ padding: box.image?.padding }}
    />
  );
});

BoxContentIframe.displayName = 'BoxContentLink';

export default BoxContentIframe;
