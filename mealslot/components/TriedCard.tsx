"use client";

import React, { useState } from "react";

export default function TriedCard({ item, onDelete, onUpdate }: { item: any; onDelete?: () => void; onUpdate?: (notes?: string, rating?: number) => void }) {
  const [editing, setEditing] = useState(false);
  const [notes, setNotes] = useState(item.notes ?? "");
  const [rating, setRating] = useState<number | undefined>(item.rating ?? undefined);

  const save = async () => {
    try {
      const r = await fetch(`/api/tried/${item.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ notes, rating }) });
      if (r.ok) {
        setEditing(false);
        onUpdate?.(notes, rating);
      }
    } catch (e) { console.error(e); }
  };

  const remove = async () => {
    try {
      const r = await fetch(`/api/tried/${item.id}`, { method: "DELETE" });
      if (r.ok) onDelete?.();
    } catch (e) { console.error(e); }
  };

  return (
    <div className="rounded-2xl border bg-white p-3 shadow-sm dark:bg-neutral-900 dark:border-neutral-800">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm font-semibold">{item.dish?.name ?? item.dishName}</div>
          <div className="text-xs text-neutral-500">{new Date(item.dateTried).toLocaleString()}</div>
        </div>
        <div className="text-sm text-neutral-600">{item.rating ? `★ ${item.rating}` : null}</div>
      </div>

      <div className="mt-2 text-sm text-neutral-700 dark:text-neutral-300">{!editing ? (item.notes ?? <span className="opacity-60">No notes</span>) : (
        <textarea className="w-full rounded border p-2" value={notes} onChange={(e)=>setNotes(e.target.value)} />
      )}</div>

      <div className="mt-3 flex items-center gap-2">
        {editing ? (
          <>
            <button onClick={save} className="rounded bg-sky-600 px-3 py-1 text-white">Save</button>
            <button onClick={()=>setEditing(false)} className="rounded border px-3 py-1">Cancel</button>
          </>
        ) : (
          <>
            <button onClick={()=>setEditing(true)} className="rounded border px-3 py-1">Edit</button>
            <button onClick={remove} className="rounded border px-3 py-1 text-red-600">Remove</button>
          </>
        )}
      </div>
    </div>
  );
}
