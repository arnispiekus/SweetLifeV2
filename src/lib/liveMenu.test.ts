/**
 * @vitest-environment node
 *
 * Unit tests for the live-menu integration.
 *
 * Coverage:
 * 1. mapApiMenu: sections→categories, subsection flattening, price parsing,
 *    variant ("from") pricing, invalid-price drops (no £NaN / £0.00), null
 *    description default, empty-category drop, image preference, seasonal
 *    passthrough, and available_at location filtering.
 * 2. isCompleteEnough: the sparse-menu gate.
 * 3. getMenuCategories: safe-by-default fallback to the static menu whenever the
 *    flag is off, the url is unset, the fetch is unhealthy, or the live menu is
 *    empty/sparse — and the mapped live menu when healthy AND complete.
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  mapApiMenu,
  getMenuCategories,
  isCompleteEnough,
  MIN_LIVE_ITEMS,
  MIN_LIVE_CATEGORIES,
} from './liveMenu';
import { menuData } from '@/data/menuData';

function item(overrides: Record<string, unknown> = {}) {
  return {
    id: 1,
    slug: 'americano',
    name: 'Americano',
    description: 'Bold',
    price: '3.84',
    is_available: true,
    image_url: null,
    ...overrides,
  };
}

function section(name: string, items: ReturnType<typeof item>[], id = 1) {
  return { id, name, subsections: [{ id: id * 10, menu_items: items }] };
}

// Build a live API response large enough to clear the completeness gate.
function completeSections() {
  const perCat = Math.ceil(MIN_LIVE_ITEMS / MIN_LIVE_CATEGORIES) + 1;
  return Array.from({ length: MIN_LIVE_CATEGORIES }, (_, s) =>
    section(
      `Cat${s}`,
      Array.from({ length: perCat }, (_, i) => item({ id: s * 1000 + i })),
      s + 1
    )
  );
}

describe('mapApiMenu', () => {
  it('maps sections to categories and parses price to a number', () => {
    const out = mapApiMenu({ sections: [section('Coffee', [item()])] });
    expect(out).toHaveLength(1);
    expect(out[0]).toMatchObject({ id: 1, name: 'Coffee' });
    expect(out[0].items[0]).toMatchObject({ id: 1, name: 'Americano', description: 'Bold', price: 3.84 });
    expect(out[0].items[0].priceFrom).toBeUndefined();
  });

  it('drops categories with no items', () => {
    const out = mapApiMenu({
      sections: [
        { id: 1, name: 'Empty', subsections: [] },
        section('Has', [item({ id: 2 })], 2),
      ],
    });
    expect(out.map((c) => c.name)).toEqual(['Has']);
  });

  it('defaults null description to an empty string', () => {
    const out = mapApiMenu({ sections: [section('C', [item({ description: null })])] });
    expect(out[0].items[0].description).toBe('');
  });

  it('drops an item with no valid price and no variants (never renders £0.00 / £NaN)', () => {
    const out = mapApiMenu({
      sections: [
        section('C', [
          item({ id: 1, price: null }),
          item({ id: 2, price: 'not-a-number' }),
          item({ id: 3, price: '4.20' }),
        ]),
      ],
    });
    expect(out[0].items.map((i) => i.id)).toEqual([3]);
    expect(out[0].items[0].price).toBe(4.2);
  });

  it('prices a variant-only item "from" the lowest variant price', () => {
    const out = mapApiMenu({
      sections: [
        section('C', [
          item({
            id: 1,
            price: null,
            item_variants: [
              { id: 1, name: 'Small', price: '5.00' },
              { id: 2, name: 'Large', price: '3.50' },
            ],
          }),
        ]),
      ],
    });
    expect(out[0].items[0].price).toBe(3.5);
    expect(out[0].items[0].priceFrom).toBe(true);
  });

  it('does not flag "from" when a single variant matches the base price', () => {
    const out = mapApiMenu({
      sections: [
        section('C', [item({ id: 1, price: '3.50', item_variants: [{ id: 1, name: 'Reg', price: '3.50' }] })]),
      ],
    });
    expect(out[0].items[0].price).toBe(3.5);
    expect(out[0].items[0].priceFrom).toBeUndefined();
  });

  it('skips invalid variant prices when deriving the "from" price', () => {
    const out = mapApiMenu({
      sections: [
        section('C', [
          item({
            id: 1,
            price: null,
            item_variants: [
              { id: 1, name: 'Bad', price: 'oops' },
              { id: 2, name: 'Good', price: '2.20' },
            ],
          }),
        ]),
      ],
    });
    expect(out[0].items[0].price).toBe(2.2);
    expect(out[0].items[0].priceFrom).toBeUndefined();
  });

  it('passes through a non-empty seasonal label and omits blank ones', () => {
    const out = mapApiMenu({
      sections: [
        section('C', [
          item({ id: 1, seasonal: '  Summer only  ' }),
          item({ id: 2, seasonal: '   ' }),
        ]),
      ],
    });
    expect(out[0].items[0].seasonal).toBe('Summer only');
    expect(out[0].items[1].seasonal).toBeUndefined();
  });

  it('filters out items not available at this location, keeping location-less items', () => {
    const out = mapApiMenu({
      sections: [
        section('C', [
          item({ id: 1, available_at: ['drogheda'] }),
          item({ id: 2, available_at: ['newry', 'drogheda'] }),
          item({ id: 3, available_at: [] }),
          item({ id: 4 }), // no available_at field at all
        ]),
      ],
    });
    expect(out[0].items.map((i) => i.id)).toEqual([2, 3, 4]);
  });

  it('prefers DB image_url, else falls back to a static image matched by name', () => {
    const known = menuData.flatMap((c) => c.items).find((i) => i.image)!;
    const out = mapApiMenu({
      sections: [
        section('Cat', [
          item({ id: 1, name: 'Has DB Image', image_url: '/db.webp' }),
          item({ id: 2, name: known.name, image_url: null }),
        ]),
      ],
    });
    expect(out[0].items[0].image).toBe('/db.webp');
    expect(out[0].items[1].image).toBe(known.image);
  });
});

describe('isCompleteEnough', () => {
  it('rejects a one-item live menu', () => {
    expect(isCompleteEnough(mapApiMenu({ sections: [section('Solo', [item()])] }))).toBe(false);
  });

  it('accepts a live menu meeting the category + item thresholds', () => {
    expect(isCompleteEnough(mapApiMenu({ sections: completeSections() }))).toBe(true);
  });
});

describe('getMenuCategories', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('returns the static menu when LIVE_MENU is off', async () => {
    vi.stubEnv('LIVE_MENU', '');
    vi.stubEnv('SINRA_PUBLIC_MENU_URL', 'https://admin.example/api');
    expect(await getMenuCategories()).toBe(menuData);
  });

  it('returns the static menu when the url is unset even if the flag is on', async () => {
    vi.stubEnv('LIVE_MENU', '1');
    vi.stubEnv('SINRA_PUBLIC_MENU_URL', '');
    expect(await getMenuCategories()).toBe(menuData);
  });

  it('returns the mapped live menu when the fetch is healthy and complete', async () => {
    vi.stubEnv('LIVE_MENU', '1');
    vi.stubEnv('SINRA_PUBLIC_MENU_URL', 'https://admin.example/api');
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, json: async () => ({ sections: completeSections() }) })
    );
    const out = await getMenuCategories();
    expect(out).not.toBe(menuData);
    expect(out).toHaveLength(MIN_LIVE_CATEGORIES);
    expect(out[0].name).toBe('Cat0');
  });

  it('falls back to the static menu when the live menu is too sparse', async () => {
    vi.stubEnv('LIVE_MENU', '1');
    vi.stubEnv('SINRA_PUBLIC_MENU_URL', 'https://admin.example/api');
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, json: async () => ({ sections: [section('Solo', [item()])] }) })
    );
    expect(await getMenuCategories()).toBe(menuData);
  });

  it('ISR-caches the fetch and asks the upstream CDN to revalidate on refetch', async () => {
    vi.stubEnv('LIVE_MENU', '1');
    vi.stubEnv('SINRA_PUBLIC_MENU_URL', 'https://admin.example/api');
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, json: async () => ({ sections: completeSections() }) });
    vi.stubGlobal('fetch', fetchMock);
    await getMenuCategories();
    const [, opts] = fetchMock.mock.calls[0];
    expect(opts.next).toMatchObject({ revalidate: 300 });
    expect(opts.headers).toMatchObject({ 'Cache-Control': 'no-cache' });
  });

  it('falls back to the static menu on a non-ok response', async () => {
    vi.stubEnv('LIVE_MENU', '1');
    vi.stubEnv('SINRA_PUBLIC_MENU_URL', 'https://admin.example/api');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, json: async () => ({}) }));
    expect(await getMenuCategories()).toBe(menuData);
  });

  it('falls back to the static menu when the fetch throws', async () => {
    vi.stubEnv('LIVE_MENU', '1');
    vi.stubEnv('SINRA_PUBLIC_MENU_URL', 'https://admin.example/api');
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network')));
    expect(await getMenuCategories()).toBe(menuData);
  });

  it('falls back to the static menu when the live menu is empty', async () => {
    vi.stubEnv('LIVE_MENU', '1');
    vi.stubEnv('SINRA_PUBLIC_MENU_URL', 'https://admin.example/api');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ sections: [] }) }));
    expect(await getMenuCategories()).toBe(menuData);
  });
});
