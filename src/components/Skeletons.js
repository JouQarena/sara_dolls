export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-pastel-pink/40 animate-pulse">
      <div className="aspect-square bg-pastel-pink/20" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-pastel-pink/20 rounded w-3/4" />
        <div className="h-4 bg-pastel-pink/20 rounded w-1/2" />
        <div className="h-5 bg-pastel-pink/30 rounded w-1/3 mt-2" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function PageHeaderSkeleton() {
  return (
    <div className="bg-gradient-to-b from-pastel-pink/40 to-cream border-b border-pastel-pink/40">
      <div className="max-w-3xl mx-auto px-5 py-12 text-center animate-pulse">
        <div className="h-10 bg-pastel-pink/30 rounded-2xl w-1/2 mx-auto" />
      </div>
    </div>
  );
}
