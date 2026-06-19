import { PageHeaderSkeleton, ProductGridSkeleton } from "@/components/Skeletons";

export default function ShopLoading() {
  return (
    <main>
      <PageHeaderSkeleton />
      <div className="max-w-6xl mx-auto px-5 py-8">
        <div className="h-12 bg-pastel-pink/20 rounded-2xl mb-6 animate-pulse" />
        <ProductGridSkeleton count={8} />
      </div>
    </main>
  );
}
