import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Categories (8)
  const categories = await Promise.all([
    prisma.category.create({ data: { slug: 'development', name: 'Development' } }),
    prisma.category.create({ data: { slug: 'design', name: 'Design' } }),
    prisma.category.create({ data: { slug: 'business', name: 'Business' } }),
    prisma.category.create({ data: { slug: 'marketing', name: 'Marketing' } }),
    prisma.category.create({ data: { slug: 'photography', name: 'Photography' } }),
    prisma.category.create({ data: { slug: 'music', name: 'Music' } }),
    prisma.category.create({ data: { slug: 'health', name: 'Health & Fitness' } }),
    prisma.category.create({ data: { slug: 'lifestyle', name: 'Lifestyle' } }),
  ]);

  const [dev, design, business, marketing, photography, music, health, lifestyle] = categories;

  // Subcategories
  const webDev = await prisma.category.create({ data: { slug: 'web-development', name: 'Web Development', parentId: dev.id } });
  const uiDesign = await prisma.category.create({ data: { slug: 'ui-design', name: 'UI Design', parentId: design.id } });
  const branding = await prisma.category.create({ data: { slug: 'branding', name: 'Branding', parentId: design.id } });
  const ecom = await prisma.category.create({ data: { slug: 'ecommerce', name: 'E-Commerce', parentId: business.id } });
  const content = await prisma.category.create({ data: { slug: 'content-marketing', name: 'Content Marketing', parentId: marketing.id } });
  const seo = await prisma.category.create({ data: { slug: 'seo', name: 'SEO', parentId: marketing.id } });
  const portrait = await prisma.category.create({ data: { slug: 'portrait-photography', name: 'Portrait Photography', parentId: photography.id } });
  const mix = await prisma.category.create({ data: { slug: 'mixing', name: 'Mixing & Mastering', parentId: music.id } });
  const yoga = await prisma.category.create({ data: { slug: 'yoga', name: 'Yoga', parentId: health.id } });
  const selfImprovement = await prisma.category.create({ data: { slug: 'self-improvement', name: 'Self Improvement', parentId: lifestyle.id } });

  // Users
  const admin = await prisma.user.create({ data: { email: 'admin@ecommerce.local', passwordHash: '$2b$10$placeholder', role: Role.ADMIN } });
  const sellerUser = await prisma.user.create({ data: { email: 'seller@ecommerce.local', passwordHash: '$2b$10$placeholder', role: Role.SELLER } });
  const seller2 = await prisma.user.create({ data: { email: 'designer@ecommerce.local', passwordHash: '$2b$10$placeholder', role: Role.SELLER } });
  const buyer = await prisma.user.create({ data: { email: 'buyer@ecommerce.local', passwordHash: '$2b$10$placeholder', role: Role.BUYER } });

  // Stores
  const store = await prisma.store.create({ data: { sellerId: sellerUser.id, name: 'Acme Digital Store', description: 'Premium digital products for creators.' } });
  const store2 = await prisma.store.create({ data: { sellerId: seller2.id, name: 'Pixel Studio', description: 'Design assets and UI kits.' } });

  // Products (60+)
  const products = [
    // Web Development
    { slug: 'nextjs-masterclass', name: 'Next.js 15 Masterclass', description: 'Build production-ready apps with the App Router, Server Components, and Partial Prerendering.', price: 49.99, categoryId: webDev.id },
    { slug: 'nestjs-enterprise', name: 'NestJS Enterprise Patterns', description: 'Domain-Driven Design, CQRS, and Hexagonal Architecture in NestJS.', price: 59.99, categoryId: webDev.id },
    { slug: 'typescript-deep-dive', name: 'TypeScript Deep Dive', description: 'Advanced types, generics, decorators, and type-level programming.', price: 39.99, categoryId: webDev.id },
    { slug: 'postgresql-performance', name: 'PostgreSQL Performance Mastery', description: 'Indexing strategies, query optimization, and connection pooling at scale.', price: 44.99, categoryId: webDev.id },
    { slug: 'prisma-orm-guide', name: 'Prisma ORM: The Complete Guide', description: 'Schema design, migrations, relations, and advanced queries.', price: 39.99, categoryId: webDev.id },
    { slug: 'redis-caching', name: 'Redis Caching Strategies', description: 'Cache patterns, invalidation strategies, and Upstash integration.', price: 34.99, categoryId: webDev.id },
    { slug: 'docker-for-devs', name: 'Docker for Developers', description: 'Containerize your entire dev workflow with multi-stage builds.', price: 49.99, categoryId: webDev.id },
    { slug: 'devops-handbook', name: 'DevOps Handbook 2024', description: 'CI/CD pipelines, monitoring, and zero-downtime deployments.', price: 54.99, categoryId: webDev.id },
    { slug: 'graphql-nodejs', name: 'GraphQL with Node.js', description: 'Apollo Server, federation, and code-first schema design.', price: 44.99, categoryId: webDev.id },
    { slug: 'microservices-k8s', name: 'Microservices with Kubernetes', description: 'Deploy and orchestrate scalable microservices clusters.', price: 64.99, categoryId: webDev.id },
    // UI Design
    { slug: 'figma-to-code', name: 'Figma to Code: Design Systems', description: 'Convert Figma designs into production-ready component libraries.', price: 34.99, categoryId: uiDesign.id },
    { slug: 'tailwind-pro', name: 'Tailwind CSS Pro', description: 'Master utility-first CSS with real-world project builds.', price: 29.99, categoryId: uiDesign.id },
    { slug: 'ui-animation', name: 'UI Animation with Framer Motion', description: 'Create stunning page transitions and micro-interactions.', price: 24.99, categoryId: uiDesign.id },
    { slug: 'graphic-design-101', name: 'Graphic Design Fundamentals', description: 'Typography, color theory, and composition for digital products.', price: 19.99, categoryId: uiDesign.id },
    { slug: 'design-systems', name: 'Building Design Systems at Scale', description: 'Tokens, patterns, and governance for enterprise design systems.', price: 44.99, categoryId: uiDesign.id },
    { slug: 'accessibility-a11y', name: 'Web Accessibility (a11y)', description: 'WCAG compliance, screen readers, and inclusive design patterns.', price: 29.99, categoryId: uiDesign.id },
    // Branding
    { slug: 'brand-strategy', name: 'Brand Strategy Blueprint', description: 'Positioning, messaging, and visual identity frameworks.', price: 49.99, categoryId: branding.id },
    { slug: 'logo-design', name: 'Logo Design Masterclass', description: 'From brief to vector: logo design for modern brands.', price: 39.99, categoryId: branding.id },
    { slug: 'packaging-design', name: 'Packaging Design Essentials', description: 'Design product packaging that sells on the shelf.', price: 34.99, categoryId: branding.id },
    // Business
    { slug: 'startup-finance', name: 'Startup Finance 101', description: 'Cap tables, burn rate, runway, and fundraising basics.', price: 39.99, categoryId: business.id },
    { slug: 'saas-metrics', name: 'SaaS Metrics for Founders', description: 'MRR, ARR, churn, LTV, and Cohort analysis.', price: 29.99, categoryId: business.id },
    { slug: 'remote-team', name: 'Remote Team Management', description: 'Async workflows, hiring, and culture at scale.', price: 34.99, categoryId: business.id },
    // E-Commerce
    { slug: 'shopify-mastery', name: 'Shopify Mastery', description: 'Build, customize, and scale a Shopify storefront.', price: 49.99, categoryId: ecom.id },
    { slug: 'dropshipping-guide', name: 'Dropshipping Blueprint', description: 'Product research, supplier vetting, and ad strategies.', price: 24.99, categoryId: ecom.id },
    { slug: 'amazon-fba', name: 'Amazon FBA Playbook', description: 'Product sourcing, listing optimization, and PPC.', price: 54.99, categoryId: ecom.id },
    { slug: 'conversion-optimization', name: 'Conversion Rate Optimization', description: 'A/B testing, UX audits, and checkout funnels.', price: 44.99, categoryId: ecom.id },
    // Content Marketing
    { slug: 'copywriting', name: 'Persuasive Copywriting', description: 'Write headlines, emails, and landing pages that convert.', price: 34.99, categoryId: content.id },
    { slug: 'content-strategy', name: 'Content Strategy Playbook', description: 'Editorial calendars, repurposing, and distribution.', price: 39.99, categoryId: content.id },
    { slug: 'youtube-growth', name: 'YouTube Channel Growth', description: 'Scripting, thumbnails, SEO, and monetization.', price: 29.99, categoryId: content.id },
    { slug: 'email-marketing', name: 'Email Marketing Automation', description: 'Flows, segmentation, and deliverability.', price: 24.99, categoryId: content.id },
    // SEO
    { slug: 'seo-fundamentals', name: 'SEO Fundamentals 2024', description: 'Technical SEO, on-page, and link building strategies.', price: 34.99, categoryId: seo.id },
    { slug: 'local-seo', name: 'Local SEO Domination', description: 'Google Business, citations, and local content.', price: 19.99, categoryId: seo.id },
    // Portrait Photography
    { slug: 'portrait-lighting', name: 'Portrait Lighting Mastery', description: 'Natural light, strobes, and modifiers for studio portraits.', price: 39.99, categoryId: portrait.id },
    { slug: 'editing-lightroom', name: 'Lightroom Presets & Workflow', description: 'Color grading, batch editing, and catalog management.', price: 24.99, categoryId: portrait.id },
    { slug: 'drone-photography', name: 'Drone Photography Essentials', description: 'Flight safety, composition, and FAA compliance.', price: 34.99, categoryId: photography.id },
    { slug: 'real-estate-photos', name: 'Real Estate Photography', description: 'Wide angles, HDR, and virtual staging techniques.', price: 29.99, categoryId: photography.id },
    // Music
    { slug: 'mixing-mastering', name: 'Mixing & Mastering Guide', description: 'EQ, compression, stereo imaging, and loudness standards.', price: 49.99, categoryId: mix.id },
    { slug: 'ableton-live', name: 'Ableton Live: Producer Course', description: 'Arrangement, sampling, and live performance setup.', price: 39.99, categoryId: music.id },
    { slug: 'music-theory', name: 'Music Theory for Producers', description: 'Scales, chord progressions, and ear training.', price: 29.99, categoryId: music.id },
    { slug: 'sound-design', name: 'Sound Design for Film & Games', description: 'Foley, synthesis, and SFX libraries.', price: 44.99, categoryId: music.id },
    { slug: 'guitar-beginner', name: 'Acoustic Guitar for Beginners', description: 'Chords, strumming patterns, and fingerstyle basics.', price: 19.99, categoryId: music.id },
    // Health
    { slug: 'yoga-fundamentals', name: 'Yoga Fundamentals', description: 'Asanas, breathing, and meditation for beginners.', price: 24.99, categoryId: yoga.id },
    { slug: 'nutrition-planning', name: 'Meal Prep & Nutrition Planning', description: 'Macros, recipes, and batch cooking strategies.', price: 29.99, categoryId: health.id },
    { slug: 'home-workout', name: 'Home Workout Program', description: 'No-equipment strength and HIIT routines.', price: 19.99, categoryId: health.id },
    { slug: 'mental-health', name: 'Mental Wellness Toolkit', description: 'CBT exercises, journaling, and stress management.', price: 14.99, categoryId: health.id },
    // Lifestyle
    { slug: 'productivity-mastery', name: 'Productivity Mastery', description: 'Systems, time blocking, and deep work techniques.', price: 29.99, categoryId: selfImprovement.id },
    { slug: 'digital-nomad', name: 'Digital Nomad Handbook', description: 'Visas, co-working, and travel hacking.', price: 19.99, categoryId: lifestyle.id },
    { slug: 'language-learning', name: 'Language Learning Blueprint', description: 'Spaced repetition, immersion, and conversation practice.', price: 24.99, categoryId: lifestyle.id },
    { slug: 'personal-finance', name: 'Personal Finance Freedom', description: 'Budgeting, investing, and financial independence.', price: 29.99, categoryId: lifestyle.id },
    { slug: 'cooking-basics', name: 'Cooking Essentials', description: 'Knife skills, sauces, and meal fundamentals.', price: 19.99, categoryId: lifestyle.id },
    { slug: 'minimalism', name: 'Minimalist Living Guide', description: 'Declutter, downsize, and intentional living.', price: 14.99, categoryId: lifestyle.id },
  ];

  let created = 0;
  for (const p of products) {
    await prisma.product.create({
      data: {
        ...p,
        sellerId: p.categoryId === uiDesign.id || p.categoryId === branding.id ? store2.id : store.id,
        isPublished: true,
        images: [`https://placehold.co/600x400?text=${encodeURIComponent(p.name)}`],
      },
    });
    created++;
  }

  console.log(`Seeded: ${categories.length + 10} categories, 4 users, 2 stores, ${created} products`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
