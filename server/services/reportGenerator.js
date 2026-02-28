/**
 * Report Generator Service
 * Generates Markdown reports for website analysis results
 */

/**
 * Calculate speed score (max 25 points)
 * @param {Object} speedResults - Speed analysis results
 * @returns {number} Score out of 25
 */
function calculateSpeedScore(speedResults) {
  let score = 0;
  
  const htmlSize = speedResults?.htmlSize || 0;
  if (htmlSize < 100) score += 10;
  else if (htmlSize < 200) score += 5;
  
  const imgCount = speedResults?.imageCount || 0;
  if (imgCount < 10) score += 5;
  
  const cssJsCount = (speedResults?.cssCount || 0) + (speedResults?.jsCount || 0);
  if (cssJsCount < 10) score += 5;
  
  if (speedResults?.gzipEnabled) score += 5;
  
  return score;
}

/**
 * Calculate SEO score (max 50 points)
 * @param {Object} seoResults - SEO analysis results
 * @returns {number} Score out of 50
 */
function calculateSeoScore(seoResults) {
  let score = 0;
  
  if (seoResults?.titleStatus === 'pass') score += 10;
  else if (seoResults?.titleStatus === 'warning') score += 5;
  
  if (seoResults?.metaDescStatus === 'pass') score += 10;
  else if (seoResults?.metaDescStatus === 'warning') score += 5;
  
  if (seoResults?.h1Status === 'pass') score += 10;
  else if (seoResults?.h1Status === 'warning') score += 5;
  
  if (seoResults?.altStatus === 'pass') score += 10;
  else if (seoResults?.altStatus === 'warning') score += 5;
  
  if (seoResults?.ogStatus === 'pass') score += 5;
  else if (seoResults?.ogStatus === 'warning') score += 2;
  
  if (seoResults?.canonicalStatus === 'pass') score += 5;
  
  return score;
}

/**
 * Calculate CRO score (max 25 points)
 * @param {Object} croResults - CRO analysis results
 * @returns {number} Score out of 25
 */
function calculateCroScore(croResults) {
  let score = 0;
  
  if (croResults?.ctaFound) score += 10;
  if (croResults?.viewportMeta) score += 5;
  if (croResults?.hasForms) score += 5;
  if (croResults?.hasPhone || croResults?.hasEmail) score += 5;
  
  return score;
}

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
  md += `# 🏥 Shopify 店铺健康检测报告\n\n`;
  md += `**检测时间**：${timestamp}\n\n`;
  md += `**目标 URL**：${url}\n\n`;
  md += `---\n\n`;

  // Speed Section
  md += `## ⚡ 页面速度 (${speedScore}/25)\n\n`;
  md += `| 指标 | 结果 | 建议 |\n`;
  md += `|-----|------|-----|\n`;
  
  const htmlSize = speedResults?.htmlSize || 0;
  const htmlStatus = htmlSize < 100 ? '✅' : htmlSize < 200 ? '⚠️' : '❌';
  const htmlAdvice = htmlSize < 100 ? '正常' : htmlSize < 200 ? '偏大，建议压缩' : '过大，需要优化';
  md += `| HTML 大小 | ${htmlStatus} ${htmlSize} KB | ${htmlAdvice} |\n`;
  
  const imgCount = speedResults?.imageCount || 0;
  const imgStatus = imgCount < 10 ? '✅' : '⚠️';
  const imgAdvice = imgCount < 10 ? '正常' : '图片较多，建议优化';
  md += `| 图片数量 | ${imgStatus} ${imgCount} 张 | ${imgAdvice} |\n`;
  
  const cssCount = speedResults?.cssCount || 0;
  const jsCount = speedResults?.jsCount || 0;
  const cssJsCount = cssCount + jsCount;
  const cssJsStatus = cssJsCount < 10 ? '✅' : '⚠️';
  const cssJsAdvice = cssJsCount < 10 ? '正常' : '建议合并';
  md += `| 外部脚本 | ${cssJsStatus} CSS: ${cssCount}, JS: ${jsCount} | ${cssJsAdvice} |\n`;
  
  const gzipEnabled = speedResults?.gzipEnabled || false;
  const gzipStatus = gzipEnabled ? '✅' : '❌';
  const gzipAdvice = gzipEnabled ? '已启用' : '建议启用 Gzip 压缩';
  md += `| Gzip 压缩 | ${gzipStatus} | ${gzipAdvice} |\n\n`;

  // SEO Section
  md += `## 🔍 SEO 状况 (${seoScore}/50)\n\n`;
  md += `| 检测项 | 状态 | 详情 |\n`;
  md += `|-------|------|-----|\n`;
  
  const titleStatus = seoResults?.titleStatus === 'pass' ? '✅' : seoResults?.titleStatus === 'warning' ? '⚠️' : '❌';
  const titleText = seoResults?.title ? `"${seoResults.title.substring(0, 40)}${seoResults.title.length > 40 ? '...' : ''}" (${seoResults.titleLength}字符)` : '未设置';
  md += `| Title | ${titleStatus} | ${titleText} |\n`;
  
  const metaStatus = seoResults?.metaDescStatus === 'pass' ? '✅' : seoResults?.metaDescStatus === 'warning' ? '⚠️' : '❌';
  const metaText = seoResults?.metaDescription ? `已设置 (${seoResults.metaDescLength}字符)` : '未设置';
  md += `| Meta Description | ${metaStatus} | ${metaText} |\n`;
  
  const h1Status = seoResults?.h1Status === 'pass' ? '✅' : seoResults?.h1Status === 'warning' ? '⚠️' : '❌';
  const h1Text = `${seoResults?.h1Count || 0} 个`;
  md += `| H1 标签 | ${h1Status} | ${h1Text} |\n`;
  
  const altStatus = seoResults?.altStatus === 'pass' ? '✅' : seoResults?.altStatus === 'warning' ? '⚠️' : '❌';
  const altText = `覆盖率 ${seoResults?.altCoverage || 0}%`;
  md += `| 图片 Alt | ${altStatus} | ${altText} |\n`;
  
  const ogStatus = seoResults?.ogStatus === 'pass' ? '✅' : seoResults?.ogStatus === 'warning' ? '⚠️' : '❌';
  const ogTags = seoResults?.ogTags || {};
  const ogText = ogTags.title || ogTags.image ? '已配置' : '未配置';
  md += `| Open Graph | ${ogStatus} | ${ogText} |\n`;
  
  const canonicalStatus = seoResults?.canonicalStatus === 'pass' ? '✅' : '⚠️';
  const canonicalText = seoResults?.canonicalUrl ? '已设置' : '未设置';
  md += `| Canonical URL | ${canonicalStatus} | ${canonicalText} |\n\n`;

  // CRO Section
  md += `## 🎯 转化率优化 (${croScore}/25)\n\n`;
  md += `| 检测项 | 状态 |\n`;
  md += `|-------|------|\n`;
  
  const ctaStatus = croResults?.ctaFound ? '✅' : '❌';
  const ctaText = croResults?.ctaFound ? `发现 "${croResults.ctaKeywords?.join(', ') || 'CTA'}"` : '未发现 CTA 按钮';
  md += `| CTA 按钮 | ${ctaStatus} ${ctaText} |\n`;
  
  const viewportStatus = croResults?.viewportMeta ? '✅' : '❌';
  const viewportText = croResults?.viewportMeta ? 'viewport 已设置' : 'viewport 未设置';
  md += `| 移动端适配 | ${viewportStatus} ${viewportText} |\n`;
  
  const formStatus = croResults?.hasForms ? '✅' : '⚠️';
  const formText = croResults?.hasForms ? '发现表单/订阅入口' : '未发现表单';
  md += `| 订阅入口 | ${formStatus} ${formText} |\n`;
  
  const contactStatus = (croResults?.hasPhone || croResults?.hasEmail) ? '✅' : '⚠️';
  const contactText = croResults?.hasPhone ? '有电话链接' : croResults?.hasEmail ? '有邮件链接' : '无联系方式';
  md += `| 联系方式 | ${contactStatus} ${contactText} |\n\n`;

  // Summary
  md += `---\n\n`;
  md += `## 📊 综合评分：${totalScore}/100\n`;

  return md;
}

module.exports = { generate };