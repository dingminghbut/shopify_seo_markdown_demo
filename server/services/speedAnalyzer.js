/**
 * 页面速度分析服务
 * 分析 HTML 大小、图片数量、CSS/JS 文件数量、Gzip 状态
 */

/**
 * 分析页面速度指标
 * @param {string} html - HTML 内容
 * @param {import('cheerio').CheerioAPI} $ - Cheerio 实例
 * @param {object} headers - 响应头对象（可选）
 * @returns {object} 分析结果
 */
function analyze(html, $, headers = {}) {
  // HTML 大小计算 (KB，保留 2 位小数)
  const htmlSize = parseFloat((Buffer.byteLength(html, 'utf8') / 1024).toFixed(2));

  // 图片数量统计
  const imageCount = $('img').length;

  // 图片总大小估算
  let imageSizeEst = '需外部检查';
  if (imageCount > 0) {
    const imgSrcs = [];
    $('img').each((_, el) => {
      const src = $(el).attr('src');
      if (src) {
        imgSrcs.push(src);
      }
    });
    
    // 检查是否有非 data URI 的图片（需要外部检查）
    const hasExternalImages = imgSrcs.some(src => !src.startsWith('data:'));
    if (hasExternalImages) {
      imageSizeEst = '需外部检查';
    } else {
      // 全部是 data URI，计算实际大小
      let totalDataUriSize = 0;
      imgSrcs.forEach(src => {
        // 移除 data:image/xxx;base64, 前缀后计算
        const base64Data = src.replace(/^data:image\/\w+;base64,/, '');
        try {
          totalDataUriSize += Buffer.byteLength(base64Data, 'base64');
        } catch (e) {
          // 忽略解析错误
        }
      });
      imageSizeEst = parseFloat((totalDataUriSize / 1024).toFixed(2));
    }
  }

  // 外部 CSS 文件数量
  const cssCount = $('link[rel="stylesheet"]').length;

  // 外部 JS 文件数量
  const jsCount = $('script[src]').length;

  // Gzip 检测
  const contentEncoding = headers['content-encoding'] || headers['Content-Encoding'] || '';
  const gzipEnabled = contentEncoding.toLowerCase().includes('gzip');

  return {
    htmlSize,
    imageCount,
    imageSizeEst,
    cssCount,
    jsCount,
    gzipEnabled
  };
}

module.exports = {
  analyze
};