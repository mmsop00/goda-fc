import { notFound } from "next/navigation";
import Link from "next/link";
import { NewsDetailHero } from "@/components/public/news-detail-hero";
import { RelatedNews } from "@/components/public/related-news";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";
import { MOCK_NEWS, sortNewsByDateDesc } from "@/lib/mock-data";

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
        <div
          className="prose prose-gray max-w-none text-gray-700 leading-relaxed text-base md:text-lg
            [&_table]:w-full [&_table]:border-collapse [&_table]:my-4
            [&_th]:bg-goda-navy [&_th]:text-white [&_th]:px-3 [&_th]:py-2 [&_th]:text-xs [&_th]:font-semibold [&_th]:text-left
            [&_td]:px-3 [&_td]:py-2 [&_td]:text-sm [&_td]:border-b [&_td]:border-gray-200
            [&_tr:nth-child(even)_td]:bg-gray-50
            [&_img]:rounded-lg [&_img]:my-4 [&_img]:max-w-full
            [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-goda-navy [&_h2]:mt-8 [&_h2]:mb-4
            [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-goda-navy [&_h3]:mt-6 [&_h3]:mb-3
            [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1
            [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1
            [&_strong]:text-goda-navy [&_hr]:my-8"
          dangerouslySetInnerHTML={{ __html: article.content.replace(/\n\n/g, "<br/><br/>").replace(/\n/g, "<br/>") }}
        />
      </article>

      <Separator />

      {/* Related Articles */}
      <RelatedNews currentSlug={slug} news={sortNewsByDateDesc(MOCK_NEWS)} />
    </>
  );
}
