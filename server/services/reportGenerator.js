/**
 * Report Generator Service
 * Generates Markdown reports for website analysis results
 */

/**
 * Generate a comprehensive Markdown report from analysis results
 * @param {Object} speedResults - Speed analysis results
 * @param {Object} seoResults - SEO analysis results
 * @param {Object} croResults - CRO analysis results
 * @param {string} url - Target URL
 * @param {string} timestamp - Detection timestamp
 * @returns {string} Markdown formatted report
 */
function generate(speedResults, seoResults, croResults, url, timestamp) {
  // Calculate scores
  const speedScore = calculateSpeedScore(speedResults);
  const seoScore = calculateSeoScore(seoResults);
  const croScore = calculateCroScore(croResults);
  const totalScore = speedScore + seoScore + croScore;

  // Build the markdown report
  let md = '';

  // Header
  md += `# Website Analysis Report\n\n`;
  md += `**Detection Time:** ${timestamp}\n\n`;
  md += `**Target URL:** ${url}\n\n`;
  md += `---\n\n`;

  // Speed Section
  md += `## 🚀 Speed Analysis (${speedScore}/25)\n\n`;
  md += `| Check Item | Status | Details |\n`;
  md += `|------------|--------|---------|\n`;
  
  const htmlSize = speedResults?.htmlSize || 0;
  const htmlStatus = htmlSize < 100 ? '✅' : htmlSize < 200 ? '⚠️' : '❌';
  const htmlDetails = htmlSize < 100 ? `< 100KB (+10)` : htmlSize < 200 ? `< 200KB (+5)` : `> 200KB (+0)`;
  md += `| HTML Size | ${htmlStatus} | ${htmlDetails} |\n`;
  
  const imgCount = speedResults?.imageCount || 0;
  const imgStatus = imgCount < 10 ? '✅' : '⚠️';
  const imgDetails = imgCount < 10 ? `${imgCount} images (+5)` : `${imgCount} images (+0)`;
  md += `| Image Count | ${imgStatus} | ${imgDetails} |\n`;
  
  const cssJsCount = (speedResults?.cssCount || 0) + (speedResults?.jsCount || 0);
  const cssJsStatus = cssJsCount < 10 ? '✅' : '⚠️';
  const cssJsDetails = cssJsCount < 10 ? `${cssJsCount} files (+5)` : `${cssJsCount} files (+0)`;
  md += `| CSS+JS Files | ${cssJsStatus} | ${cssJsDetails} |\n`;
  
  const gzipEnabled = speedResults?.gzipEnabled || false;
  const gzipStatus = gzipEnabled ? '✅' : '❌';
  const gzipDetails = gzipEnabled ? `Enabled (+5)` : `Not enabled (+0)`;
  md += `| Gzip Compression | ${gzipStatus} | ${gzipDetails} |\n\n`;

  // SEO Section
  md += `## 🔍 SEO Analysis (${seoScore}/50)\n\n`;
  md += `| Check Item | Status | Details |\n`;
  md += `|------------|--------|---------|\n`;
  
  const titleExists = seoResults?.title?.exists || false;
  const titleStatus = titleExists ? '✅' : '❌';
  const titleDetails = titleExists ? `Found: "${seoResults.title.text.substring(0, 30)}..." (+10)` : `Missing (+0)`;
  md += `| Title Tag | ${titleStatus} | ${titleDetails} |\n`;
  
  const titleLength = seoResults?.title?.length || 0;
  const titleLenStatus = titleLength >= 30 && titleLength <= 60 ? '✅' : '⚠️';
  const titleLenDetails = titleLength >= 30 && titleLength <= 60 ? `${titleLength} chars (+5)` : `${titleLength} chars (+0)`;
  md += `| Title Length | ${titleLenStatus} | ${titleLenDetails} |\n`;
  
  const descExists = seoResults?.description?.exists || false;
  const descStatus = descExists ? '✅' : '❌';
  const descDetails = descExists ? `Found: "${seoResults.description.text.substring(0, 30)}..." (+10)` : `Missing (+0)`;
  md += `| Meta Description | ${descStatus} | ${descDetails} |\n`;
  
  const descLength = seoResults?.description?.length || 0;
  const descLenStatus = descLength >= 50 && descLength <= 160 ? '✅' : '⚠️';
  const descLenDetails = descLength >= 50 && descLength <= 160 ? `${descLength} chars (+5)` : `${descLength} chars (+0)`;
  md += `| Description Length | ${descLenStatus} | ${descLenDetails} |\n`;
  
  const h1Count = seoResults?.h1Count || 0;
  const h1Status = h1Count >= 1 ? '✅' : '❌';
  const h1Details = h1Count >= 1 ? `${h1Count} H1 tag(s) (+10)` : `No H1 found (+0)`;
  md += `| H1 Tag | ${h1Status} | ${h1Details} |\n`;
  
  const altCoverage = seoResults?.altCoverage || 0;
  const altStatus = altCoverage > 80 ? '✅' : altCoverage > 0 ? '⚠️' : '❌';
  const altDetails = altCoverage > 80 ? `${altCoverage}% (+10)` : `${altCoverage}% (+0)`;
  md += `| Image Alt Coverage | ${altStatus} | ${altDetails} |\n`;
  
  const ogTags = seoResults?.ogTags || {};
  const ogComplete = ogTags.ogTitle && ogTags.ogDescription && ogTags.ogImage;
  const ogStatus = ogComplete ? '✅' : '❌';
  const ogDetails = ogComplete ? `Title, Description, Image (+5)` : `Missing tags (+0)`;
  md += `| Open Graph Tags | ${ogStatus} | ${ogDetails} |\n\n`;

  // CRO Section
  md += `## 💰 Conversion Rate Optimization (${croScore}/25)\n\n`;
  md += `| Check Item | Status | Details |\n`;
  md += `|------------|--------|---------|\n`;
  
  const ctaExists = croResults?.ctaExists || false;
  const ctaStatus = ctaExists ? '✅' : '❌';
  const ctaDetails = ctaExists ? `Found (+10)` : `Not found (+0)`;
  md += `| Call-to-Action | ${ctaStatus} | ${ctaDetails} |\n`;
  
  const viewport = croResults?.viewport || false;
  const viewportStatus = viewport ? '✅' : '❌';
  const viewportDetails = viewport ? `Defined (+5)` : `Missing (+0)`;
  md += `| Viewport Meta | ${viewportStatus} | ${viewportDetails} |\n`;
  
  const forms = croResults?.forms || 0;
  const formsStatus = forms > 0 ? '✅' : '❌';
  const formsDetails = forms > 0 ? `${forms} form(s) found (+5)` : `No forms (+0)`;
  md += `| Contact Forms | ${formsStatus} | ${formsDetails} |\n`;
  
  const contactInfo = croResults?.contactInfo || false;
  const contactStatus = contactInfo ? '✅' : '❌';
  const contactDetails = contactInfo ? `Found (+5)` : `Not found (+0)`;
  md += `| Contact Information | ${contactStatus} | ${contactDetails} |\n\n`;

  // Footer - Total Score
  md += `---\n\n`;
  md += `## 📊 Overall Score: ${totalScore}/100\n\n`;
  
  // Score breakdown visualization
  const speedPercent = (speedScore / 25) * 100;
  const seoPercent = (seoScore / 50) * 100;
  const croPercent = (croScore / 25) * 100;
  
  md += `| Category | Score | Percentage |\n`;
  md += `|----------|-------|------------|\n`;
  md += `| Speed | ${speedScore}/25 | ${speedPercent}% |\n`;
  md += `| SEO | ${seoScore}/50 | ${seoPercent}% |\n`;
  md += `| CRO | ${croScore}/25 | ${croPercent}% |\n`;
  md += `| **Total** | **${totalScore}/100** | **${totalScore}%** |\n`;

  return md;
}

/**
 * Calculate speed analysis score
 * @param {Object} speedResults - Speed analysis results
 * @returns {number} Score out of 25
 */
function calculateSpeedScore(speedResults) {
  let score = 0;

  // HTML size scoring
  const htmlSize = speedResults?.htmlSize || 0;
  if (htmlSize < 100) {
    score += 10;
  } else if (htmlSize < 200) {
    score += 5;
  }

  // Image count scoring
  const imageCount = speedResults?.imageCount || 0;
  if (imageCount < 10) {
    score += 5;
  }

  // CSS+JS count scoring
  const cssCount = speedResults?.cssCount || 0;
  const jsCount = speedResults?.jsCount || 0;
  if (cssCount + jsCount < 10) {
    score += 5;
  }

  // Gzip compression scoring
  if (speedResults?.gzipEnabled) {
    score += 5;
  }

  return score;
}

/**
 * Calculate SEO analysis score
 * @param {Object} seoResults - SEO analysis results
 * @returns {number} Score out of 50
 */
function calculateSeoScore(seoResults) {
  let score = 0;

  // Title exists
  if (seoResults?.title?.exists) {
    score += 10;
  }

  // Title length appropriate (30-60 chars)
  const titleLength = seoResults?.title?.length || 0;
  if (titleLength >= 30 && titleLength <= 60) {
    score += 5;
  }

  // Description exists
  if (seoResults?.description?.exists) {
    score += 10;
  }

  // Description length appropriate (50-160 chars)
  const descLength = seoResults?.description?.length || 0;
  if (descLength >= 50 && descLength <= 160) {
    score += 5;
  }

  // H1 tag exists
  if ((seoResults?.h1Count || 0) >= 1) {
    score += 10;
  }

  // Alt coverage > 80%
  const altCoverage = seoResults?.altCoverage || 0;
  if (altCoverage > 80) {
    score += 10;
  }

  // OG tags complete (ogTitle, ogDescription, ogImage)
  const ogTags = seoResults?.ogTags || {};
  if (ogTags.ogTitle && ogTags.ogDescription && ogTags.ogImage) {
    score += 5;
  }

  return score;
}

/**
 * Calculate CRO analysis score
 * @param {Object} croResults - CRO analysis results
 * @returns {number} Score out of 25
 */
function calculateCroScore(croResults) {
  let score = 0;

  // CTA exists
  if (croResults?.ctaExists) {
    score += 10;
  }

  // Viewport meta tag
  if (croResults?.viewport) {
    score += 5;
  }

  // Forms present
  if ((croResults?.forms || 0) > 0) {
    score += 5;
  }

  // Contact information
  if (croResults?.contactInfo) {
    score += 5;
  }

  return score;
}

module.exports = {
  generate
};