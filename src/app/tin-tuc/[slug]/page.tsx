import { notFound } from "next/navigation";
import Link from "next/link";
import { NewsDetailHero } from "@/components/public/news-detail-hero";
import { RelatedNews } from "@/components/public/related-news";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";
import { MOCK_NEWS } from "@/lib/mock-data";

export function generateStaticParams() {
  return MOCK_NEWS.map((item) => ({
    slug: item.slug,
  }));
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = MOCK_NEWS.find((n) => n.slug === slug);

  if (!article) {
    notFound();
  }

  const paragraphs = article.content.split("\n\n");

  return (
    <>
      <NewsDetailHero item={article} />

      {/* Back link */}
      <div className="max-w-3xl mx-auto px-4 md:px-6 lg:px-8 pt-8">
        <Link
          href="/tin-tuc"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-goda-navy transition-colors"
        >
          <ArrowLeft className="size-4" />
          Tất cả tin tức
        </Link>
      </div>

      {/* Article Content */}
      <article className="max-w-3xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
        <div className="space-y-4 text-gray-700 leading-relaxed text-base md:text-lg">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </article>

      <Separator />

      {/* Related Articles */}
      <RelatedNews currentSlug={slug} news={MOCK_NEWS} />
    </>
  );
}
