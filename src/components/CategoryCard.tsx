import Link from "next/link";

export type CategoryCardProps = {
  label: string;
  slug: string;
  imageUrl?: string;
};

export default function CategoryCard({ label, slug }: CategoryCardProps) {
  return (
    <Link href={`/category/${encodeURIComponent(slug)}`} className="card p-3 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.06)] transition-all">
      <div className="h-32 w-full overflow-hidden rounded-md bg-white/5" />
      <div className="mt-3 font-medium leading-tight line-clamp-2">{label}</div>
      <div className="text-xs text-white/60">Explore {label}</div>
    </Link>
  );
}
