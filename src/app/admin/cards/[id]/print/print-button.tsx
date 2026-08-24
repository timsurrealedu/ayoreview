'use client';

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="px-4 py-2 bg-action hover:bg-action-hover text-white text-xs font-bold rounded shadow cursor-pointer transition"
    >
      Cetak Kartu Dudukan
    </button>
  );
}
