'use client';

import { useMemo, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  Search, ChevronDown, ChevronRight, Check, Trash2, Plus, Loader2, AlertCircle,
} from 'lucide-react';

export interface AdminItem {
  id: number;
  name: string;
  description: string;
  price: number | null;
  is_available: boolean;
  needs_review: boolean;
}
export interface AdminSubsection {
  id: number;
  name: string;
  items: AdminItem[];
}
export interface AdminSection {
  id: number;
  name: string;
  subsections: AdminSubsection[];
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'item';
}

export default function MenuManager({ initialSections }: { initialSections: AdminSection[] }) {
  const supabase = useMemo(() => createClient(), []);
  const [sections, setSections] = useState(initialSections);
  const [search, setSearch] = useState('');
  const [openSections, setOpenSections] = useState<Set<number>>(new Set());
  const [savingId, setSavingId] = useState<number | null>(null);
  const [savedId, setSavedId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const query = search.trim().toLowerCase();

  const toggleSection = (id: number) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const patchItem = (itemId: number, patch: Partial<AdminItem>) => {
    setSections((prev) =>
      prev.map((sec) => ({
        ...sec,
        subsections: sec.subsections.map((sub) => ({
          ...sub,
          items: sub.items.map((it) => (it.id === itemId ? { ...it, ...patch } : it)),
        })),
      })),
    );
  };

  const flashSaved = (id: number) => {
    setSavedId(id);
    setTimeout(() => setSavedId((cur) => (cur === id ? null : cur)), 1500);
  };

  const saveItem = async (item: AdminItem) => {
    setError(null);
    setSavingId(item.id);
    const { error } = await supabase
      .from('menu_items')
      .update({
        name: item.name,
        description: item.description || null,
        price: item.price,
        is_available: item.is_available,
      })
      .eq('id', item.id);
    setSavingId(null);
    if (error) {
      setError(`Could not save "${item.name}": ${error.message}`);
      return;
    }
    flashSaved(item.id);
  };

  const toggleAvailable = async (item: AdminItem) => {
    const next = !item.is_available;
    patchItem(item.id, { is_available: next });
    const { error } = await supabase
      .from('menu_items')
      .update({ is_available: next })
      .eq('id', item.id);
    if (error) {
      patchItem(item.id, { is_available: item.is_available });
      setError(`Could not update availability: ${error.message}`);
    }
  };

  const deleteItem = async (sectionId: number, subId: number, item: AdminItem) => {
    if (!confirm(`Delete "${item.name}"? This cannot be undone.`)) return;
    const { error } = await supabase.from('menu_items').delete().eq('id', item.id);
    if (error) {
      setError(`Could not delete: ${error.message}`);
      return;
    }
    setSections((prev) =>
      prev.map((sec) =>
        sec.id !== sectionId
          ? sec
          : {
              ...sec,
              subsections: sec.subsections.map((sub) =>
                sub.id !== subId
                  ? sub
                  : { ...sub, items: sub.items.filter((it) => it.id !== item.id) },
              ),
            },
      ),
    );
  };

  const addItem = async (sectionId: number, sub: AdminSubsection, name: string, price: string) => {
    setError(null);
    const priceNum = price.trim() === '' ? null : Number(price);
    if (priceNum != null && Number.isNaN(priceNum)) {
      setError('Price must be a number.');
      return;
    }
    const { data, error } = await supabase
      .from('menu_items')
      .insert({
        subsection_id: sub.id,
        slug: slugify(name),
        name,
        price: priceNum,
        needs_review: true,
        display_order: 999,
      })
      .select('id, name, description, price, is_available, needs_review')
      .single();
    if (error || !data) {
      setError(`Could not add item: ${error?.message ?? 'unknown error'}`);
      return;
    }
    setSections((prev) =>
      prev.map((sec) =>
        sec.id !== sectionId
          ? sec
          : {
              ...sec,
              subsections: sec.subsections.map((s) =>
                s.id !== sub.id
                  ? s
                  : {
                      ...s,
                      items: [
                        ...s.items,
                        {
                          id: data.id,
                          name: data.name,
                          description: data.description ?? '',
                          price: data.price,
                          is_available: data.is_available,
                          needs_review: data.needs_review,
                        },
                      ],
                    },
              ),
            },
      ),
    );
  };

  // Auto-expand sections that contain a search hit
  const sectionMatches = (sec: AdminSection) =>
    sec.subsections.some((sub) =>
      sub.items.some((it) => it.name.toLowerCase().includes(query)),
    );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-charcoal">Menu</h1>
          <p className="text-rich-brown/60 text-sm mt-1">
            Edit prices, availability, and items. Changes go live on the website within a minute.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search items…"
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
        />
      </div>

      {error && (
        <div className="flex items-start gap-2 text-sm text-red-700 bg-red-50 rounded-lg px-3 py-2 mb-4">
          <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-3">
        {sections.map((sec) => {
          const isOpen = openSections.has(sec.id) || (query !== '' && sectionMatches(sec));
          const itemCount = sec.subsections.reduce((n, s) => n + s.items.length, 0);
          return (
            <div key={sec.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <button
                onClick={() => toggleSection(sec.id)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
              >
                <span className="flex items-center gap-2 font-semibold text-charcoal">
                  {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                  {sec.name}
                  <span className="text-xs text-rich-brown/50 font-normal">({itemCount})</span>
                </span>
              </button>

              {isOpen && (
                <div className="px-4 pb-4 space-y-4">
                  {sec.subsections.map((sub) => {
                    const items = query
                      ? sub.items.filter((it) => it.name.toLowerCase().includes(query))
                      : sub.items;
                    if (query && items.length === 0) return null;
                    return (
                      <div key={sub.id}>
                        <p className="text-xs uppercase tracking-wide text-rich-brown/40 font-semibold mb-2">
                          {sub.name}
                        </p>
                        <div className="space-y-2">
                          {items.map((item) => (
                            <ItemRow
                              key={item.id}
                              item={item}
                              saving={savingId === item.id}
                              saved={savedId === item.id}
                              onChange={(patch) => patchItem(item.id, patch)}
                              onSave={() => saveItem(item)}
                              onToggleAvailable={() => toggleAvailable(item)}
                              onDelete={() => deleteItem(sec.id, sub.id, item)}
                            />
                          ))}
                          {!query && <AddItemRow onAdd={(n, p) => addItem(sec.id, sub, n, p)} />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ItemRow({
  item, saving, saved, onChange, onSave, onToggleAvailable, onDelete,
}: {
  item: AdminItem;
  saving: boolean;
  saved: boolean;
  onChange: (patch: Partial<AdminItem>) => void;
  onSave: () => void;
  onToggleAvailable: () => void;
  onDelete: () => void;
}) {
  const [dirty, setDirty] = useState(false);

  const edit = (patch: Partial<AdminItem>) => {
    setDirty(true);
    onChange(patch);
  };
  const save = () => {
    setDirty(false);
    onSave();
  };

  return (
    <div
      className={`rounded-lg border p-3 ${
        item.is_available ? 'border-gray-200 bg-white' : 'border-gray-200 bg-gray-50 opacity-70'
      }`}
    >
      <div className="flex items-center gap-3">
        <input
          value={item.name}
          onChange={(e) => edit({ name: e.target.value })}
          className="flex-1 min-w-0 font-medium text-charcoal bg-transparent border-b border-transparent hover:border-gray-200 focus:border-primary outline-none py-1"
        />
        {item.needs_review && (
          <span className="text-[10px] font-semibold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded whitespace-nowrap">
            review
          </span>
        )}
        <div className="flex items-center gap-1">
          <span className="text-rich-brown/50">£</span>
          <input
            type="number"
            step="0.01"
            value={item.price ?? ''}
            onChange={(e) =>
              edit({ price: e.target.value === '' ? null : Number(e.target.value) })
            }
            placeholder="—"
            className="w-20 text-right rounded border border-gray-200 focus:border-primary outline-none px-2 py-1"
          />
        </div>

        <label className="flex items-center gap-1 cursor-pointer select-none" title="Available">
          <input
            type="checkbox"
            checked={item.is_available}
            onChange={onToggleAvailable}
            className="w-4 h-4 accent-primary"
          />
        </label>

        {dirty ? (
          <button
            onClick={save}
            disabled={saving}
            className="btn btn-sm btn-primary inline-flex items-center"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : 'Save'}
          </button>
        ) : saved ? (
          <span className="text-green-600 inline-flex items-center text-sm px-2">
            <Check size={16} />
          </span>
        ) : (
          <span className="w-[44px]" />
        )}

        <button
          onClick={onDelete}
          className="text-gray-300 hover:text-red-500 transition p-1"
          title="Delete item"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <input
        value={item.description}
        onChange={(e) => edit({ description: e.target.value })}
        placeholder="Description (optional)"
        className="w-full mt-2 text-sm text-rich-brown/70 bg-transparent border-b border-transparent hover:border-gray-200 focus:border-primary outline-none py-1"
      />
    </div>
  );
}

function AddItemRow({ onAdd }: { onAdd: (name: string, price: string) => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-1"
      >
        <Plus size={14} /> Add item
      </button>
    );
  }

  const submit = () => {
    if (!name.trim()) return;
    onAdd(name.trim(), price);
    setName('');
    setPrice('');
    setOpen(false);
  };

  return (
    <div className="flex items-center gap-2 rounded-lg border border-dashed border-primary/40 p-2">
      <input
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="New item name"
        className="flex-1 min-w-0 px-2 py-1 rounded border border-gray-200 outline-none focus:border-primary"
      />
      <div className="flex items-center gap-1">
        <span className="text-rich-brown/50">£</span>
        <input
          type="number"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="0.00"
          className="w-20 text-right rounded border border-gray-200 px-2 py-1 outline-none focus:border-primary"
        />
      </div>
      <button onClick={submit} className="btn btn-sm btn-primary">Add</button>
      <button onClick={() => setOpen(false)} className="text-sm text-gray-400 px-2">Cancel</button>
    </div>
  );
}
