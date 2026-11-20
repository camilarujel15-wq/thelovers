import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PostCard } from "@/components/blog/PostCard";
import { LinkButton } from "@/components/ui/Button";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { BLOG_POSTS, getCategoryLabel, getPostBySlug, getRelatedPosts } from "@/lib/blog";
import { ORDER_HREF, SITE } from "@/lib/data";

type Props = { params: Promise<{ slug: string }> };

const dateFormat = new Intl.DateTimeFormat("es-PE", { dateStyle: "long" });

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPostBySlug((await params).slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.keywords,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.date,
      url: `/blog/${post.slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = getPostBySlug((await params).slug);
  if (!post) notFound();

  const related = getRelatedPosts(post.slug, 3);
  const category = getCategoryLabel(post.category);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    inLanguage: "es-PE",
    author: { "@type": "Organization", name: SITE.name },
    publisher: { "@type": "Organization", name: SITE.name },
    mainEntityOfPage: `${SITE.url}/blog/${post.slug}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <article className="bg-white">
        <header className="bg-lavender-50">
          <div className="mx-auto max-w-3xl px-5 pb-10 pt-10 sm:px-8 sm:pt-14">
            <nav aria-label="Migas de pan" className="text-xs text-ink-500">
              <Link href="/blog" className="hover:text-lavender-700">Blog</Link>
              {" › "}
              <Link href={`/blog?categoria=${post.category}`} className="hover:text-lavender-700">{category}</Link>
            </nav>
            <h1 className="mt-4 font-display text-3xl font-semibold text-ink-900 sm:text-5xl">{post.title}</h1>
            <p className="mt-4 text-lg text-ink-500">{post.excerpt}</p>
            <p className="mt-4 text-xs text-ink-500">
              <time dateTime={post.date}>{dateFormat.format(new Date(post.date))}</time>, {post.readingMinutes} min de lectura
            </p>
          </div>
          <div className="mx-auto max-w-3xl px-5 sm:px-8">
            <PlaceholderImage emoji={post.emoji} gradient={post.gradient} className="h-56 w-full rounded-3xl sm:h-72" />
          </div>
        </header>

        <div className="mx-auto flex max-w-3xl flex-col gap-5 px-5 py-12 sm:px-8">
          {post.content.map((block, i) => {
            if (block.type === "h2") {
              return <h2 key={i} className="mt-4 font-display text-2xl font-semibold text-ink-900">{block.text}</h2>;
            }
            if (block.type === "ul") {
              return (
                <ul key={i} className="flex list-disc flex-col gap-2 pl-6 text-ink-700 marker:text-lavender-400">
                  {block.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              );
            }
            return <p key={i} className="leading-relaxed text-ink-700">{block.text}</p>;
          })}
        </div>
      </article>

      <section className="bg-lavender-700 py-14 text-white">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-5 px-5 text-center sm:px-8">
          <h2 className="font-display text-3xl font-semibold">¿Te inspiró alguna idea?</h2>
          <p className="text-lavender-50">Conviértela en un regalo personalizado en pocos pasos.</p>
          <LinkButton href={ORDER_HREF} variant="secondary" size="lg">Hacer Pedido</LinkButton>
        </div>
      </section>

      {related.length > 0 && (
        <section className="bg-cream py-14">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <h2 className="mb-8 text-center font-display text-2xl font-semibold text-ink-900">Te puede interesar</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {related.map((p) => <PostCard key={p.slug} post={p} />)}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
