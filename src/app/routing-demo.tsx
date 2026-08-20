'use client';

import { useState } from 'react';
import { Check, CornerDownRight } from 'lucide-react';

type Destination = { id: string; label: string; url: string };

export function RoutingDemo({ publicId, destinations }: { publicId: string; destinations: Destination[] }) {
  const [selectedId, setSelectedId] = useState(destinations[0]?.id ?? '');
  const [activeId, setActiveId] = useState(destinations[0]?.id ?? '');
  const active = destinations.find(({ id }) => id === activeId);
  const changed = selectedId !== activeId;

  return <div className="routing-demo"><div className="demo-form"><span className="sample-flag">DATA CONTOH</span><label htmlFor="destination">Pilih tujuan contoh</label><select id="destination" value={selectedId} onChange={(event) => setSelectedId(event.target.value)}>{destinations.map(({ id, label }) => <option key={id} value={id}>{label}</option>)}</select><button type="button" className="button" disabled={!changed} onClick={() => setActiveId(selectedId)}>Perbarui tujuan</button><p className="demo-status" role="status" aria-live="polite">{changed ? 'Rute contoh siap diperbarui.' : <><Check aria-hidden="true" /> Rute contoh sudah diperbarui.</>}</p></div><div className="demo-route"><div><small>TETAP PADA PERANGKAT</small><strong>reviewtap.id/q/{publicId}</strong></div><CornerDownRight aria-hidden="true" /><div className="route-result" key={activeId}><small>DIARAHKAN KE</small><strong>{active?.label}</strong><span>{active?.url}</span></div></div></div>;
}
