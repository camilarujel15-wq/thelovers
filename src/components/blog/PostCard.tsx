import Link from "next/link";
import { Clock } from "lucide-react";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { getCategoryLabel, type BlogPost } from "@/lib/blog";

const dateFormat = new Intl.DateTimeFormat("es-PE", { dateStyle: "long" });

export function PostCard({ post }: { post: BlogPost }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-lavender-100 bg-white shadow-sm transition-shadow hover:shadow-xl hover:shadow-lavender-200/40">
      <Link href={`/blog/${post.slug}`} className="flex h-full flex-col">
        <PlaceholderImage
          emoji={post.emoji}
          gradient={post.gradient}
          className="h-44 w-full transition-transform duration-500 group-hover:scale-105"
        />
        <div className="flex flex-1 flex-col gap-3 p-6">
          <span className="w-fit rounded-full bg-lavender-100 px-3 py-1 text-xs font-semibold text-lavender-700">
            {getCategoryLabel(post.category)}
          </span>
          <h2 className="font-display text-xl font-semibold text-ink-900">{post.title}</h2>
          <p className="text-sm text-ink-500">{post.excerpt}</p>
          <div className="mt-auto flex items-center gap-3 pt-2 text-xs text-ink-500">
            <time dateTime={post.date}>{dateFormat.format(new Date(post.date))}</time>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" /> {post.readingMinutes} min
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
