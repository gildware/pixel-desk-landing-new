import { organization, siteName, siteUrl, alternateSiteUrl } from './site';

export type FaqItem = { q: string; a: string };

export function faqPageSchema(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };
}

export function organizationSchema() {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: organization.name,
    url: organization.url,
    logo: organization.logo,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: organization.supportEmail,
      url: `${organization.url}/resources`,
    },
  };

  if (organization.sameAs.length > 0) {
    schema.sameAs = organization.sameAs;
  }

  if (alternateSiteUrl && alternateSiteUrl !== siteUrl) {
    schema.alternateName = 'The Pixeldesk';
  }

  return schema;
}

export function howToSchema(guide: {
  title: string;
  description: string;
  steps: { name: string; text: string }[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: guide.title,
    description: guide.description,
    step: guide.steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  };
}

export function articleSchema(post: {
  title: string;
  description: string;
  dateIso: string;
  slug: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.dateIso,
    author: {
      '@type': 'Organization',
      name: siteName,
    },
    publisher: {
      '@type': 'Organization',
      name: organization.name,
      logo: {
        '@type': 'ImageObject',
        url: organization.logo,
      },
    },
    mainEntityOfPage: `${siteUrl}/blogs/${post.slug}`,
  };
}

export function softwareApplicationSchema(description: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: siteName,
    description,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url: siteUrl,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
      description: 'Free Starter plan — no credit card required',
    },
  };
}
