/**
 * SEO Analysis Service
 * Analyzes HTML for SEO best practices including title, meta description, H1 tags,
 * alt text coverage, Open Graph tags, and canonical URLs
 */

/**
 * Analyze HTML for SEO elements
 * @param {string} html - HTML string (unused but kept for API signature)
 * @param {import('cheerio').CheerioAPI} $ - Cheerio loaded instance
 * @returns {Object} SEO analysis results with pass/warning/fail status
 */
function analyze(html, $) {
  // Title analysis
  const title = $('title').text().trim();
  const titleLength = title.length;
  let titleStatus = 'fail';
  if (title && titleLength >= 50 && titleLength <= 60) {
    titleStatus = 'pass';
  } else if (title && titleLength > 0) {
    titleStatus = 'warning';
  }

  // Meta Description analysis
  const metaDescription = $('meta[name="description"]').attr('content') || '';
  const metaDescLength = metaDescription.length;
  let metaDescStatus = 'fail';
  if (metaDescription && metaDescLength >= 120 && metaDescLength <= 160) {
    metaDescStatus = 'pass';
  } else if (metaDescription && metaDescLength > 0) {
    metaDescStatus = 'warning';
  }

  // H1 analysis
  const h1Count = $('h1').length;
  let h1Status = 'fail';
  if (h1Count === 1) {
    h1Status = 'pass';
  } else if (h1Count > 1) {
    h1Status = 'warning';
  }

  // Alt coverage analysis
  const totalImages = $('img').length;
  const imagesWithAlt = $('img[alt]').length;
  const altCoverage = totalImages > 0 
    ? Math.round((imagesWithAlt / totalImages) * 100) 
    : 0;
  let altStatus = 'fail';
  if (altCoverage >= 80) {
    altStatus = 'pass';
  } else if (totalImages > 0 && altCoverage >= 50) {
    altStatus = 'warning';
  } else if (totalImages === 0) {
    altStatus = 'pass'; // No images is technically fine
  }

  // Open Graph analysis
  const ogTitle = $('meta[property="og:title"]').attr('content') || '';
  const ogImage = $('meta[property="og:image"]').attr('content') || '';
  const ogDescription = $('meta[property="og:description"]').attr('content') || '';
  
  const ogTags = {
    title: ogTitle || null,
    image: ogImage || null,
    description: ogDescription || null,
  };

  let ogStatus = 'fail';
  if (ogTitle && ogImage && ogDescription) {
    ogStatus = 'pass';
  } else if (ogTitle || ogImage || ogDescription) {
    ogStatus = 'warning';
  }

  // Canonical URL analysis
  const canonicalUrl = $('link[rel="canonical"]').attr('href') || null;
  const canonicalStatus = canonicalUrl ? 'pass' : 'warning';

  return {
    results: {
      title,
      titleLength,
      titleStatus,
      metaDescription,
      metaDescLength,
      metaDescStatus,
      h1Count,
      h1Status,
      altCoverage,
      altStatus,
      ogTags,
      ogStatus,
      canonicalUrl,
      canonicalStatus,
    },
  };
}

module.exports = { analyze };