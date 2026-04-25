export function Error({ error }) {
  return (
    <div className="flex items-center">
      <p className="font-mono text-sm text-stone-500">{error}...</p>
    </div>
  );
}
