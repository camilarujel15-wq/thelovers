import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PostCard } from "@/components/blog/PostCard";
import { PageHero } from "@/components/ui/PageHero";
import { BLOG_CATEGORIES, BLOG_POSTS } from "@/lib/blog";
import { cn } from "@/lib/utils";

const PER_PAGE = 6;

type Props = { searchParams: Promise<{ categoria?: string; pagina?: string }> };

function resolveCategory(value?: string) {
  return BLOG_CATEGORIES.find((c) => c.id === value);
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const category = resolveCategory((await searchParams).categoria);
  return {
    title: category ? `Blog: ${category.label}` : "Blog de regalos e ideas románticas",
    description: category
      ? `Artículos sobre ${category.label.toLowerCase()}: ideas de regalos personalizados y consejos de The Lovers Perú.`
      : "Ideas de regalos personalizados, regalos románticos y de aniversario en Perú. Guías y consejos de The Lovers Perú.",
    alternates: { canonical: category ? `/blog?categoria=${category.id}` : "/blog" },
  };
}

function href(categoria: string | undefined, pagina: number) {
  const params = new URLSearchParams();
  if (categoria) params.set("categoria", categoria);
  if (pagina > 1) params.set("pagina", String(pagina));
  const query = params.toString();
  return query ? `/blog?${query}` : "/blog";
}

export default async function BlogPage({ searchParams }: Props) {
  const sp = await searchParams;
  const category = resolveCategory(sp.categoria);
  const posts = BLOG_POSTS.filter((p) => !category || p.category === category.id).sort(
    (a, b) => b.date.localeCompare(a.date),
  );
  const pages = Math.max(1, Math.ceil(posts.length / PER_PAGE));
  const page = Math.min(pages, Math.max(1, Number.parseInt(sp.pagina ?? "1", 10) || 1));
  const visible = posts.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const chip = (active: boolean) =>
    cn(
      "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
      active
        ? "border-lavender-600 bg-lavender-600 text-white"
        : "border-lavender-200 bg-white text-ink-700 hover:border-lavender-400",
    );

  return (
    <>
      <PageHero
        title="Ideas para regalar con el corazón"
        description="Guías, consejos e inspiración para acertar con el regalo perfecto."
      />
      <section className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <nav aria-label="Categorías del blog" className="flex flex-wrap justify-center gap-2">
            <Link href="/blog" aria-current={!category ? "page" : undefined} className={chip(!category)}>
              Todas
            </Link>
            {BLOG_CATEGORIES.map((c) => (
              <Link
                key={c.id}
                href={href(c.id, 1)}
                aria-current={category?.id === c.id ? "page" : undefined}
                className={chip(category?.id === c.id)}
              >
                {c.label}
              </Link>
            ))}
          </nav>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>

          {pages > 1 && (
            <nav aria-label="Paginación del blog" className="mt-10 flex items-center justify-center gap-4">
              {page > 1 ? (
                <Link href={href(category?.id, page - 1)} className="inline-flex items-center gap-1 rounded-full border border-lavender-200 px-4 py-2 text-sm font-medium text-ink-700 hover:border-lavender-400">
                  <ChevronLeft className="h-4 w-4" /> Anterior
                </Link>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full border border-lavender-100 px-4 py-2 text-sm text-ink-300"><ChevronLeft className="h-4 w-4" /> Anterior</span>
              )}
              <span className="text-sm text-ink-500">Página {page} de {pages}</span>
              {page < pages ? (
                <Link href={href(category?.id, page + 1)} className="inline-flex items-center gap-1 rounded-full border border-lavender-200 px-4 py-2 text-sm font-medium text-ink-700 hover:border-lavender-400">
                  Siguiente <ChevronRight className="h-4 w-4" />
                </Link>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full border border-lavender-100 px-4 py-2 text-sm text-ink-300">Siguiente <ChevronRight className="h-4 w-4" /></span>
              )}
            </nav>
          )}
        </div>
      </section>
    </>
  );
}
