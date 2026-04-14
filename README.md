# SEOAudit

Free website SEO analysis tool built with Next.js and Lovable that provides comprehensive SEO audits with actionable insights.

## Live Demo

🔗 [insight-seo.vercel.app](https://insight-seo.vercel.app/)

![SEOAudit](opengraph.png)

## Features

### 🔍 Meta & Content Analysis
- Title tag length validation (recommended 50-60 chars)
- Meta description analysis (recommended < 160 chars)
- Canonical URL detection and comparison
- Open Graph and Twitter Card preview
- Full heading structure visualization (H1-H6)

### 🔗 Link Analysis
- Internal and external link counting
- Nofollow link detection
- Broken link identification

### 📝 Content Evaluation
- Word count analysis with 300+ word recommendation
- Readability scoring (Easy/Medium/Hard)
- Semantic HTML detection (article, section, figure, time, details)

### ⚙️ Technical SEO
- HTTPS security check
- robots.txt presence
- sitemap.xml validation
- Canonical URL verification
- Mixed content detection
- JSON-LD structured data detection
- Schema.org type identification

### ♿ Accessibility Audit
- ARIA landmark detection (header, nav, main, footer, aside)
- Skip navigation link check
- Language attribute validation
- Tabindex evaluation

### 📊 Performance Metrics
- HTTP status code detection
- Page load time measurement
- Content size analysis
- Redirect chain tracking

### 🎨 Social Media Preview
- Open Graph tag visualization
- Twitter Card preview
- Favicon detection (16px, 32px, Apple Touch Icon)
- Social sharing preview

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Platform**: Lovable
- **Deployment**: Vercel

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## SEO Score Breakdown

The audit provides a score from 0-100 based on:
- **Critical issues** (red) - Must fix
- **Warnings** (yellow) - Should fix
- **Passed checks** (green) - Good to go

## External SEO Tools

- Google Site Search
- Google PageSpeed Insights
- Google Rich Results Test
- Ahrefs
- Semrush
- Moz
- SimilarWeb
- Archive.org

## Built By

Created by [CuspTech](https://cusptech.dev) - Building tools for better web.