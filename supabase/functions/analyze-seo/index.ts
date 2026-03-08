import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url, scanId } = await req.json();
    if (!url) {
      return new Response(JSON.stringify({ error: "URL is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch the page
    const startTime = Date.now();
    let response: Response;
    const redirectChain: string[] = [];
    let currentUrl = url;

    try {
      // Follow redirects manually to track chain
      let res = await fetch(currentUrl, { redirect: "manual" });
      redirectChain.push(currentUrl);
      let maxRedirects = 10;
      while ((res.status >= 300 && res.status < 400) && maxRedirects > 0) {
        const location = res.headers.get("location");
        if (!location) break;
        currentUrl = new URL(location, currentUrl).toString();
        redirectChain.push(currentUrl);
        res = await fetch(currentUrl, { redirect: "manual" });
        maxRedirects--;
      }
      // Final fetch with full body
      response = await fetch(currentUrl);
    } catch (e) {
      return new Response(JSON.stringify({ error: `Failed to fetch URL: ${e.message}` }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const loadTime = Date.now() - startTime;
    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, "text/html");
    if (!doc) throw new Error("Failed to parse HTML");

    const finalUrl = currentUrl;
    const baseUrl = new URL(finalUrl);

    // --- Page Info ---
    const pageInfo = {
      statusCode: response.status,
      redirectChain,
      finalUrl,
      loadTime,
      contentType: response.headers.get("content-type") || "",
      contentLength: html.length,
    };

    // --- Meta Tags ---
    const titleEl = doc.querySelector("title");
    const title = titleEl?.textContent?.trim() || "";
    const getMeta = (name: string) => {
      const el = doc.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
      return el?.getAttribute("content") || "";
    };
    const getMetaByAttr = (attr: string, value: string) => {
      const el = doc.querySelector(`meta[${attr}="${value}"]`);
      return el?.getAttribute("content") || "";
    };

    const metaDescription = getMeta("description");
    const robotsMeta = getMeta("robots");
    const canonicalEl = doc.querySelector('link[rel="canonical"]');
    const canonical = canonicalEl?.getAttribute("href") || "";
    const charsetEl = doc.querySelector("meta[charset]");
    const charset = charsetEl?.getAttribute("charset") || getMeta("charset") || "";
    const viewport = getMeta("viewport");

    const metaIssues: any[] = [];
    if (!title) metaIssues.push({ severity: "critical", category: "Meta Tags", message: "Missing page title" });
    else if (title.length > 60) metaIssues.push({ severity: "warning", category: "Meta Tags", message: `Title too long (${title.length} chars, recommended < 60)` });
    else if (title.length < 30) metaIssues.push({ severity: "warning", category: "Meta Tags", message: `Title too short (${title.length} chars, recommended 30-60)` });
    else metaIssues.push({ severity: "pass", category: "Meta Tags", message: `Title length is good (${title.length} chars)` });

    if (!metaDescription) metaIssues.push({ severity: "critical", category: "Meta Tags", message: "Missing meta description" });
    else if (metaDescription.length > 160) metaIssues.push({ severity: "warning", category: "Meta Tags", message: `Meta description too long (${metaDescription.length} chars, recommended < 160)` });
    else if (metaDescription.length < 70) metaIssues.push({ severity: "warning", category: "Meta Tags", message: `Meta description too short (${metaDescription.length} chars, recommended 70-160)` });
    else metaIssues.push({ severity: "pass", category: "Meta Tags", message: `Meta description length is good (${metaDescription.length} chars)` });

    if (!viewport) metaIssues.push({ severity: "warning", category: "Meta Tags", message: "Missing viewport meta tag" });
    else metaIssues.push({ severity: "pass", category: "Meta Tags", message: "Viewport meta tag is set" });

    if (!canonical) metaIssues.push({ severity: "info", category: "Meta Tags", message: "No canonical URL specified" });
    else metaIssues.push({ severity: "pass", category: "Meta Tags", message: "Canonical URL is set" });

    const metaTags = {
      title, titleLength: title.length,
      description: metaDescription, descriptionLength: metaDescription.length,
      robots: robotsMeta, canonical, charset, viewport,
      issues: metaIssues,
    };

    // --- Open Graph ---
    const ogTitle = getMeta("og:title");
    const ogDescription = getMeta("og:description");
    const ogImage = getMeta("og:image");
    const ogUrl = getMeta("og:url");
    const ogSiteName = getMeta("og:site_name");
    const ogType = getMeta("og:type");
    const ogLocale = getMeta("og:locale");
    const ogImageWidth = getMeta("og:image:width");
    const ogImageHeight = getMeta("og:image:height");
    const ogImageAlt = getMeta("og:image:alt");

    const ogIssues: any[] = [];
    if (!ogTitle) ogIssues.push({ severity: "warning", category: "Open Graph", message: "Missing og:title" });
    if (!ogDescription) ogIssues.push({ severity: "warning", category: "Open Graph", message: "Missing og:description" });
    if (!ogImage) ogIssues.push({ severity: "warning", category: "Open Graph", message: "Missing og:image" });
    if (!ogUrl) ogIssues.push({ severity: "info", category: "Open Graph", message: "Missing og:url" });
    if (ogImage && !ogImageWidth) ogIssues.push({ severity: "info", category: "Open Graph", message: "Missing og:image:width" });
    if (ogImage && !ogImageHeight) ogIssues.push({ severity: "info", category: "Open Graph", message: "Missing og:image:height" });
    if (ogTitle && ogDescription && ogImage) ogIssues.push({ severity: "pass", category: "Open Graph", message: "Open Graph tags are properly configured" });

    const openGraph = { title: ogTitle, description: ogDescription, image: ogImage, imageWidth: ogImageWidth, imageHeight: ogImageHeight, imageAlt: ogImageAlt, url: ogUrl, siteName: ogSiteName, type: ogType, locale: ogLocale, issues: ogIssues };

    // --- Twitter Card ---
    const twCard = getMeta("twitter:card") || getMetaByAttr("name", "twitter:card");
    const twTitle = getMeta("twitter:title") || getMetaByAttr("name", "twitter:title");
    const twDesc = getMeta("twitter:description") || getMetaByAttr("name", "twitter:description");
    const twImage = getMeta("twitter:image") || getMetaByAttr("name", "twitter:image");

    const twIssues: any[] = [];
    if (!twCard) twIssues.push({ severity: "warning", category: "Twitter Card", message: "Missing twitter:card" });
    if (!twTitle) twIssues.push({ severity: "warning", category: "Twitter Card", message: "Missing twitter:title" });
    if (!twImage) twIssues.push({ severity: "info", category: "Twitter Card", message: "Missing twitter:image" });
    if (twCard && twTitle) twIssues.push({ severity: "pass", category: "Twitter Card", message: "Twitter Card is configured" });

    const twitterCard = { card: twCard, title: twTitle, description: twDesc, image: twImage, issues: twIssues };

    // --- Headings ---
    const getHeadings = (tag: string) => Array.from(doc.querySelectorAll(tag)).map((el: any) => el.textContent?.trim() || "");
    const h1s = getHeadings("h1");
    const h2s = getHeadings("h2");
    const h3s = getHeadings("h3");
    const h4s = getHeadings("h4");
    const h5s = getHeadings("h5");
    const h6s = getHeadings("h6");

    const headingIssues: any[] = [];
    if (h1s.length === 0) headingIssues.push({ severity: "critical", category: "Headings", message: "Missing H1 tag" });
    else if (h1s.length > 1) headingIssues.push({ severity: "warning", category: "Headings", message: `Multiple H1 tags found (${h1s.length})` });
    else headingIssues.push({ severity: "pass", category: "Headings", message: "Single H1 tag found" });

    if (h3s.length > 0 && h2s.length === 0) headingIssues.push({ severity: "warning", category: "Headings", message: "H3 used without H2 (skipped hierarchy)" });

    const headings = { h1: h1s, h2: h2s, h3: h3s, h4: h4s, h5: h5s, h6: h6s, issues: headingIssues };

    // --- Images ---
    const imgElements = Array.from(doc.querySelectorAll("img"));
    const images: any[] = [];
    let missingAlt = 0;
    let brokenImages = 0;

    for (const img of imgElements) {
      const src = (img as any).getAttribute("src") || "";
      const alt = (img as any).getAttribute("alt") || "";
      const isMissingAlt = !alt;
      if (isMissingAlt) missingAlt++;
      images.push({ src, alt, isBroken: false, isMissingAlt });
    }

    const imageIssues: any[] = [];
    if (missingAlt > 0) imageIssues.push({ severity: "warning", category: "Images", message: `${missingAlt} image(s) missing alt text` });
    else if (imgElements.length > 0) imageIssues.push({ severity: "pass", category: "Images", message: "All images have alt text" });

    const imageAnalysis = { total: imgElements.length, missingAlt, brokenImages, largeImages: 0, images: images.slice(0, 50), issues: imageIssues };

    // --- Links ---
    const linkElements = Array.from(doc.querySelectorAll("a[href]"));
    const links: any[] = [];
    let internalCount = 0, externalCount = 0, nofollowCount = 0;

    for (const link of linkElements) {
      const href = (link as any).getAttribute("href") || "";
      const text = (link as any).textContent?.trim() || "";
      const rel = (link as any).getAttribute("rel") || "";
      let isExternal = false;
      try {
        const linkUrl = new URL(href, finalUrl);
        isExternal = linkUrl.hostname !== baseUrl.hostname;
      } catch { /* skip */ }
      const isNofollow = rel.includes("nofollow");
      if (isExternal) externalCount++; else internalCount++;
      if (isNofollow) nofollowCount++;
      links.push({ href, text: text.slice(0, 100), isExternal, isNofollow, isBroken: false });
    }

    const linkIssues: any[] = [];
    if (internalCount === 0) linkIssues.push({ severity: "warning", category: "Links", message: "No internal links found" });
    linkIssues.push({ severity: "info", category: "Links", message: `Found ${internalCount} internal and ${externalCount} external links` });

    const linkAnalysis = { total: linkElements.length, internal: internalCount, external: externalCount, nofollow: nofollowCount, broken: 0, links: links.slice(0, 100), issues: linkIssues };

    // --- Structured Data ---
    const jsonLdScripts = Array.from(doc.querySelectorAll('script[type="application/ld+json"]'));
    const jsonLd: object[] = [];
    const schemaTypes: string[] = [];
    for (const script of jsonLdScripts) {
      try {
        const data = JSON.parse((script as any).textContent || "");
        jsonLd.push(data);
        if (data["@type"]) schemaTypes.push(data["@type"]);
      } catch { /* skip */ }
    }

    const sdIssues: any[] = [];
    if (jsonLd.length === 0) sdIssues.push({ severity: "info", category: "Structured Data", message: "No JSON-LD structured data found" });
    else sdIssues.push({ severity: "pass", category: "Structured Data", message: `Found ${jsonLd.length} JSON-LD block(s): ${schemaTypes.join(", ")}` });

    const structuredData = { jsonLd, microdata: [], schemaTypes, hasStructuredData: jsonLd.length > 0, issues: sdIssues };

    // --- Content Analysis ---
    // Remove scripts and styles, get text
    const bodyEl = doc.querySelector("body");
    const bodyText = bodyEl?.textContent?.replace(/\s+/g, " ").trim() || "";
    const words = bodyText.split(/\s+/).filter((w: string) => w.length > 0);
    const wordCount = words.length;

    // Keyword frequency (top 20 words, 4+ chars)
    const freq: Record<string, number> = {};
    const stopWords = new Set(["this", "that", "with", "from", "have", "been", "will", "your", "more", "about", "their", "them", "than", "other", "which", "when", "what", "there", "each", "would", "make", "like", "into", "could", "also", "some", "just", "these", "only"]);
    for (const w of words) {
      const lower = w.toLowerCase().replace(/[^a-z0-9]/g, "");
      if (lower.length >= 4 && !stopWords.has(lower)) {
        freq[lower] = (freq[lower] || 0) + 1;
      }
    }
    const topKeywords = Object.fromEntries(
      Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 20)
    );

    // Simple readability (avg sentence length based)
    const sentences = bodyText.split(/[.!?]+/).filter((s: string) => s.trim().length > 10);
    const avgSentenceLen = sentences.length > 0 ? wordCount / sentences.length : wordCount;
    const readabilityScore = Math.max(0, Math.min(100, 100 - (avgSentenceLen - 15) * 3));
    const readabilityGrade = readabilityScore >= 70 ? "Easy" : readabilityScore >= 50 ? "Moderate" : "Difficult";

    const contentIssues: any[] = [];
    if (wordCount < 300) contentIssues.push({ severity: "warning", category: "Content", message: `Low word count (${wordCount}). Aim for 300+ words.` });
    else contentIssues.push({ severity: "pass", category: "Content", message: `Good word count (${wordCount} words)` });

    const contentAnalysis = { wordCount, keywordFrequency: topKeywords, readabilityScore: Math.round(readabilityScore), readabilityGrade, issues: contentIssues };

    // --- Technical SEO ---
    let hasRobotsTxt = false;
    let hasSitemap = false;
    try {
      const robotsRes = await fetch(new URL("/robots.txt", baseUrl).toString());
      hasRobotsTxt = robotsRes.ok && (await robotsRes.text()).length > 0;
    } catch { /* skip */ }
    try {
      const sitemapRes = await fetch(new URL("/sitemap.xml", baseUrl).toString());
      hasSitemap = sitemapRes.ok && (await sitemapRes.text()).includes("<urlset");
    } catch { /* skip */ }

    const hasNoindex = robotsMeta.includes("noindex");
    const hasCanonicalConflict = canonical ? (new URL(canonical, finalUrl).toString() !== finalUrl) : false;

    const techIssues: any[] = [];
    if (!hasRobotsTxt) techIssues.push({ severity: "warning", category: "Technical", message: "robots.txt not found" });
    else techIssues.push({ severity: "pass", category: "Technical", message: "robots.txt found" });
    if (!hasSitemap) techIssues.push({ severity: "warning", category: "Technical", message: "sitemap.xml not found" });
    else techIssues.push({ severity: "pass", category: "Technical", message: "sitemap.xml found" });
    if (hasNoindex) techIssues.push({ severity: "critical", category: "Technical", message: "Page has noindex directive" });
    if (hasCanonicalConflict) techIssues.push({ severity: "warning", category: "Technical", message: "Canonical URL differs from current URL" });

    const technical = { hasRobotsTxt, hasSitemap, canonicalUrl: canonical, hasCanonicalConflict, hasNoindex, issues: techIssues };

    // --- Security ---
    const isHttps = finalUrl.startsWith("https://");
    const hasMixedContent = html.includes('src="http://') || html.includes("src='http://");

    const secIssues: any[] = [];
    if (!isHttps) secIssues.push({ severity: "critical", category: "Security", message: "Site not using HTTPS" });
    else secIssues.push({ severity: "pass", category: "Security", message: "Site uses HTTPS" });
    if (hasMixedContent) secIssues.push({ severity: "warning", category: "Security", message: "Mixed content detected (HTTP resources on HTTPS page)" });

    const security = { isHttps, hasMixedContent, issues: secIssues };

    // --- Favicon ---
    const faviconEl = doc.querySelector('link[rel="icon"], link[rel="shortcut icon"]');
    const appleTouchEl = doc.querySelector('link[rel="apple-touch-icon"]');
    const faviconHref = faviconEl?.getAttribute("href") || "";
    const faviconType = faviconEl?.getAttribute("type") || "";
    const faviconSizes = faviconEl?.getAttribute("sizes") || "";
    const appleTouchHref = appleTouchEl?.getAttribute("href") || "";

    let faviconFound = !!faviconHref;
    if (!faviconFound) {
      try {
        const favRes = await fetch(new URL("/favicon.ico", baseUrl).toString(), { method: "HEAD" });
        faviconFound = favRes.ok;
      } catch { /* skip */ }
    }

    const favIssues: any[] = [];
    if (!faviconFound) favIssues.push({ severity: "warning", category: "Favicon", message: "No favicon found" });
    else favIssues.push({ severity: "pass", category: "Favicon", message: "Favicon found" });
    if (!appleTouchHref) favIssues.push({ severity: "info", category: "Favicon", message: "No Apple Touch Icon specified" });
    else favIssues.push({ severity: "pass", category: "Favicon", message: "Apple Touch Icon found" });

    const favicon = {
      found: faviconFound,
      url: faviconHref || (faviconFound ? "/favicon.ico" : ""),
      type: faviconType,
      sizes: faviconSizes,
      appleTouchIcon: appleTouchHref,
      issues: favIssues,
    };

    // --- Manifest.json ---
    let manifest: any = null;
    const manifestEl = doc.querySelector('link[rel="manifest"]');
    const manifestHref = manifestEl?.getAttribute("href") || "";
    const manifestIssues: any[] = [];

    if (manifestHref) {
      try {
        const manifestUrl = new URL(manifestHref, baseUrl).toString();
        const mRes = await fetch(manifestUrl);
        if (mRes.ok) {
          const mData = await mRes.json();
          const icons = (mData.icons || []).map((i: any) => ({
            src: i.src || "", sizes: i.sizes || "", type: i.type || "",
          }));

          manifest = {
            found: true,
            url: manifestUrl,
            name: mData.name || "",
            shortName: mData.short_name || "",
            startUrl: mData.start_url || "",
            display: mData.display || "",
            themeColor: mData.theme_color || "",
            backgroundColor: mData.background_color || "",
            icons,
            issues: [],
          };

          if (!mData.name) manifestIssues.push({ severity: "warning", category: "Manifest", message: "Missing manifest name" });
          else manifestIssues.push({ severity: "pass", category: "Manifest", message: "Manifest name found" });
          if (!mData.short_name) manifestIssues.push({ severity: "info", category: "Manifest", message: "Missing manifest short_name" });
          if (!mData.start_url) manifestIssues.push({ severity: "warning", category: "Manifest", message: "Missing manifest start_url" });
          if (!icons.length) manifestIssues.push({ severity: "warning", category: "Manifest", message: "No icons defined in manifest" });
          else manifestIssues.push({ severity: "pass", category: "Manifest", message: `${icons.length} icon(s) found in manifest` });
          if (!mData.display) manifestIssues.push({ severity: "info", category: "Manifest", message: "No display mode set" });
          if (!mData.theme_color) manifestIssues.push({ severity: "info", category: "Manifest", message: "No theme_color set" });

          manifest.issues = manifestIssues;
        } else {
          manifest = { found: false, url: manifestUrl, name: "", shortName: "", startUrl: "", display: "", themeColor: "", backgroundColor: "", icons: [], issues: [{ severity: "warning", category: "Manifest", message: "manifest.json returned non-OK status" }] };
        }
      } catch {
        manifest = { found: false, url: manifestHref, name: "", shortName: "", startUrl: "", display: "", themeColor: "", backgroundColor: "", icons: [], issues: [{ severity: "warning", category: "Manifest", message: "Failed to fetch manifest.json" }] };
      }
    } else {
      // Try /manifest.json fallback
      try {
        const mRes = await fetch(new URL("/manifest.json", baseUrl).toString());
        if (mRes.ok) {
          const mData = await mRes.json();
          const icons = (mData.icons || []).map((i: any) => ({ src: i.src || "", sizes: i.sizes || "", type: i.type || "" }));
          manifest = { found: true, url: new URL("/manifest.json", baseUrl).toString(), name: mData.name || "", shortName: mData.short_name || "", startUrl: mData.start_url || "", display: mData.display || "", themeColor: mData.theme_color || "", backgroundColor: mData.background_color || "", icons, issues: [{ severity: "pass", category: "Manifest", message: "manifest.json found at default path" }] };
        }
      } catch { /* skip */ }
    }

    // --- Performance (PageSpeed) ---
    let performance = null;
    const pageSpeedKey = Deno.env.get("GOOGLE_PAGESPEED_API_KEY");
    if (pageSpeedKey) {
      try {
        const psUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(finalUrl)}&key=${pageSpeedKey}&category=performance`;
        const psRes = await fetch(psUrl);
        const psData = await psRes.json();
        const lhr = psData.lighthouseResult;
        if (lhr) {
          performance = {
            score: Math.round((lhr.categories?.performance?.score || 0) * 100),
            fcp: lhr.audits?.["first-contentful-paint"]?.numericValue || 0,
            lcp: lhr.audits?.["largest-contentful-paint"]?.numericValue || 0,
            cls: lhr.audits?.["cumulative-layout-shift"]?.numericValue || 0,
            tbt: lhr.audits?.["total-blocking-time"]?.numericValue || 0,
            si: lhr.audits?.["speed-index"]?.numericValue || 0,
          };
        }
      } catch { /* skip */ }
    }

    // --- Calculate SEO Score ---
    const manifestIssuesForScore = manifest?.issues || [];
    const allIssues = [
      ...metaIssues, ...ogIssues, ...twIssues, ...headingIssues,
      ...imageIssues, ...linkIssues, ...sdIssues, ...contentIssues,
      ...techIssues, ...secIssues, ...favIssues, ...manifestIssuesForScore,
    ];

    let score = 100;
    for (const issue of allIssues) {
      if (issue.severity === "critical") score -= 10;
      else if (issue.severity === "warning") score -= 3;
    }
    score = Math.max(0, Math.min(100, score));

    const report = {
      url,
      finalUrl,
      scanDate: new Date().toISOString(),
      seoScore: score,
      pageInfo,
      metaTags,
      openGraph,
      twitterCard,
      headings,
      images: imageAnalysis,
      links: linkAnalysis,
      structuredData,
      content: contentAnalysis,
      technical,
      security,
      performance,
      favicon,
      manifest,
      issues: allIssues,
    };

    // Save to database
    if (scanId) {
      await supabase
        .from("seo_scans")
        .update({
          status: "completed",
          final_url: finalUrl,
          seo_score: score,
          report,
          updated_at: new Date().toISOString(),
        })
        .eq("id", scanId);
    }

    return new Response(JSON.stringify(report), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
