/**
 * @vitest-environment node
 *
 * Unit tests for the live-menu integration.
 *
 * Coverage:
 * 1. mapApiMenu: sections→categories, subsection flattening, string→number
 *    price, null price/description defaults, empty-category drop, image
 *    preference (DB image_url over static name-matched fallback).
 * 2. getMenuCategories: safe-by-default fallback to the static menu whenever
 *    the flag is off, the url is unset, the fetch is unhealthy, or the live
 *    menu is empty — and the mapped live menu when healthy.
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { mapApiMenu, getMenuCategories } from './liveMenu';
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

describe('mapApiMenu', () => {
  it('maps sections to categories and parses price to a number', () => {
    const out = mapApiMenu({ sections: [section('Coffee', [item()])] });
    expect(out).toHaveLength(1);
    expect(out[0]).toMatchObject({ id: 1, name: 'Coffee' });
    expect(out[0].items[0]).toMatchObject({ id: 1, name: 'Americano', description: 'Bold', price: 3.84 });
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

  it('defaults null price to 0 and null description to empty string', () => {
    const out = mapApiMenu({ sections: [section('C', [item({ price: null, description: null })])] });
    expect(out[0].items[0].price).toBe(0);
    expect(out[0].items[0].description).toBe('');
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

  it('returns the mapped live menu when the fetch is healthy and non-empty', async () => {
    vi.stubEnv('LIVE_MENU', '1');
    vi.stubEnv('SINRA_PUBLIC_MENU_URL', 'https://admin.example/api');
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, json: async () => ({ sections: [section('Live', [item()])] }) })
    );
    const out = await getMenuCategories();
    expect(out.map((c) => c.name)).toEqual(['Live']);
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
