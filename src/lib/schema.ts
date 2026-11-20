import { CUADROS, FAQS, PRICE_TO, SITE, productPriceFrom } from "@/lib/data";

export const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export const PRODUCT_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: CUADROS.map((product, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "Product",
      name: product.name,
      description: product.description,
      image: product.media.flatMap((m) => (m.type === "image" ? [`${SITE.url}${m.src}`] : [])),
      brand: { "@type": "Brand", name: SITE.name },
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "PEN",
        lowPrice: productPriceFrom(product),
        highPrice: product.fixedPrice ?? PRICE_TO,
        availability: "https://schema.org/InStock",
      },
    },
  })),
};
