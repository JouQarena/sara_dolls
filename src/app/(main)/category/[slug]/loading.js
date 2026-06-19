import { PageHeaderSkeleton, ProductGridSkeleton } from "@/components/Skeletons";

export default function CategoryLoading() {
  return (
    <main>
      <PageHeaderSkeleton />
      <div className="max-w-6xl mx-auto px-5 py-8">
        <ProductGridSkeleton count={8} />
      </div>
    </main>
  );
}
