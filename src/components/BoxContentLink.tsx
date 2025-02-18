/* eslint-disable @next/next/no-img-element */
import { memo, useEffect, useState } from 'react';
import { getWebsiteData } from '@/actions/website-data';
import { Box } from '@/types/box';

interface Props {
  box: Box;
}

const BoxContentLink = memo(({ box }: Props) => {
  const [data, setData] =
    useState<Awaited<ReturnType<typeof getWebsiteData>>>();

  useEffect(() => {
    getWebsiteData(box.link).then((data) => setData(data));
  }, [box.link]);

  return (
    <div className="h-full w-full" style={{ padding: box.image?.padding }}>
      <img
        className="h-full w-full"
        src={
          (box.image?.src ?? '') || (data?.image ?? '') || '/placeholder.svg'
        }
        alt={box.id.toString()}
        style={{
          objectFit: box.image?.objectFit ?? 'cover',
        }}
      />
    </div>
  );
});

BoxContentLink.displayName = 'BoxContentLink';

export default BoxContentLink;
