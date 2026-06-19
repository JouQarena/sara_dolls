export default function ProductLoading() {
  return (
    <main className="max-w-6xl mx-auto px-5 py-8">
      <div className="h-4 bg-pastel-pink/20 rounded w-1/3 mb-6 animate-pulse" />
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 animate-pulse">
        <div className="aspect-square rounded-3xl bg-pastel-pink/20" />
        <div className="space-y-4">
          <div className="h-6 bg-pastel-pink/20 rounded w-1/4" />
          <div className="h-8 bg-pastel-pink/30 rounded w-3/4" />
          <div className="h-8 bg-pastel-pink/30 rounded w-1/3" />
          <div className="h-24 bg-pastel-pink/15 rounded-2xl" />
          <div className="h-14 bg-pastel-pink/30 rounded-2xl" />
        </div>
      </div>
    </main>
  );
}
