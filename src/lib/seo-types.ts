export interface SeoReport {
  url: string;
  finalUrl: string;
  scanDate: string;
  seoScore: number;
  pageInfo: PageInfo;
  metaTags: MetaTagAnalysis;
  openGraph: OpenGraphData;
  twitterCard: TwitterCardData;
  headings: HeadingAnalysis;
  images: ImageAnalysis;
  links: LinkAnalysis;
  structuredData: StructuredDataAnalysis;
  content: ContentAnalysis;
  technical: TechnicalSeo;
  security: SecurityAnalysis;
  performance: PerformanceData | null;
  issues: SeoIssue[];
}

export interface PageInfo {
  statusCode: number;
  redirectChain: string[];
  finalUrl: string;
  loadTime: number;
  contentType: string;
  contentLength: number;
}

export interface MetaTagAnalysis {
  title: string;
  titleLength: number;
  description: string;
  descriptionLength: number;
  robots: string;
  canonical: string;
  charset: string;
  viewport: string;
  issues: SeoIssue[];
}

export interface OpenGraphData {
  title: string;
  description: string;
  image: string;
  url: string;
  siteName: string;
  type: string;
  issues: SeoIssue[];
}

export interface TwitterCardData {
  card: string;
  title: string;
  description: string;
  image: string;
  issues: SeoIssue[];
}

export interface HeadingAnalysis {
  h1: string[];
  h2: string[];
  h3: string[];
  h4: string[];
  h5: string[];
  h6: string[];
  issues: SeoIssue[];
}

export interface ImageInfo {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  isBroken: boolean;
  isMissingAlt: boolean;
}

export interface ImageAnalysis {
  total: number;
  missingAlt: number;
  brokenImages: number;
  largeImages: number;
  images: ImageInfo[];
  issues: SeoIssue[];
}

export interface LinkInfo {
  href: string;
  text: string;
  isExternal: boolean;
  isNofollow: boolean;
  isBroken: boolean;
}

export interface LinkAnalysis {
  total: number;
  internal: number;
  external: number;
  nofollow: number;
  broken: number;
  links: LinkInfo[];
  issues: SeoIssue[];
}

export interface StructuredDataAnalysis {
  jsonLd: object[];
  microdata: string[];
  schemaTypes: string[];
  hasStructuredData: boolean;
  issues: SeoIssue[];
}

export interface ContentAnalysis {
  wordCount: number;
  keywordFrequency: Record<string, number>;
  readabilityScore: number;
  readabilityGrade: string;
  issues: SeoIssue[];
}

export interface TechnicalSeo {
  hasRobotsTxt: boolean;
  hasSitemap: boolean;
  canonicalUrl: string;
  hasCanonicalConflict: boolean;
  hasNoindex: boolean;
  issues: SeoIssue[];
}

export interface SecurityAnalysis {
  isHttps: boolean;
  hasMixedContent: boolean;
  issues: SeoIssue[];
}

export interface PerformanceData {
  score: number;
  fcp: number;
  lcp: number;
  cls: number;
  tbt: number;
  si: number;
}

export interface SeoIssue {
  severity: 'critical' | 'warning' | 'info' | 'pass';
  category: string;
  message: string;
  details?: string;
}

export interface ScanRecord {
  id: string;
  url: string;
  final_url: string | null;
  share_token: string;
  status: string;
  seo_score: number | null;
  report: SeoReport | null;
  created_at: string;
  updated_at: string;
}
