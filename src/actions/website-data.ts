'use server';

import * as cheerio from 'cheerio';

export async function getWebsiteData(url?: string | null) {
  const result = {
    title: undefined as string | undefined,
    description: undefined as string | undefined,
    image: undefined as string | undefined,
  };
  if (!url) return result;
  try {
    const response = await fetch(url);
    const data = await response.text();
    const $ = cheerio.load(data);

    result.title = $('meta[property="og:title"]').attr('content');
    result.description = $('meta[property="og:description"]').attr('content');
    result.image = $('meta[property="og:image"]').attr('content');

    if (!result.title) {
      result.title = $('meta[name="twitter:title"]').attr('content');
    }

    if (!result.title) {
      result.title = $('title').text();
    }

    if (!result.description) {
      result.description = $('meta[name="twitter:description"]').attr(
        'content'
      );
    }

    if (!result.description) {
      result.description = $('meta[name="description"]').attr('content');
    }

    if (!result.image) {
      result.image = $('meta[name="twitter:image"]').attr('content');
    }

    if (!result.image) {
      result.image = $('link[rel="apple-touch-icon"]').attr('href');
    }

    if (!result.image) {
      const images = $('img')
        .toArray()
        .map((img) => img.attribs.src);
      images.sort((a, b) => {
        if (b?.toLowerCase().includes('logo')) return 1;
        if (b?.toLowerCase().includes('brand')) return 1;
        if (b?.toLowerCase().includes('icon')) return 1;
        if (a?.toLowerCase().includes('logo')) return -1;
        if (a?.toLowerCase().includes('brand')) return -1;
        if (a?.toLowerCase().includes('icon')) return -1;
        return 0;
      });
      result.image = images[0];
    }

    if (!result.image) {
      result.image = $('link[rel="icon"]').attr('href');
    }

    if (result.image) {
      const href = new URL(result.image, url).href;
      result.image = new URL(href, url).href;
    }

    return result;
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
    else console.log(error);
    return result;
  }
}
