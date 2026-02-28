/**
 * CRO Analyzer Service
 * Analyzes HTML for conversion rate optimization factors
 */

const CTA_KEYWORDS = [
  'add to cart',
  'buy now',
  'shop now',
  'sign up',
  'subscribe',
  'get started'
];

/**
 * Analyzes HTML for CRO factors
 * @param {string} html - The HTML content to analyze
 * @param {Cheerio} $ - Cheerio instance
 * @returns {object} Analysis results
 */
function analyze(html, $) {
  if (!html || typeof html !== 'string') {
    throw new Error('Invalid HTML content provided');
  }

  const results = {
    ctaFound: false,
    ctaKeywords: [],
    viewportMeta: null,
    hasForms: false,
    hasPhone: false,
    hasEmail: false
  };

  // Search for CTA keywords in various elements
  const searchTexts = [
    $('html').text(),
    $('button').text(),
    $('a').text(),
    $('input[type="submit"]').val() || '',
    $('input[type="button"]').val() || '',
    $('[role="button"]').text(),
    $('img').map((i, el) => $(el).attr('alt')).get().join(' ')
  ];

  const combinedText = searchTexts.join(' ').toLowerCase();

  for (const keyword of CTA_KEYWORDS) {
    if (combinedText.includes(keyword.toLowerCase())) {
      results.ctaKeywords.push(keyword);
    }
  }

  results.ctaFound = results.ctaKeywords.length > 0;

  // Detect viewport meta tag
  const viewportMeta = $('meta[name="viewport"]');
  results.viewportMeta = viewportMeta.attr('content') || null;

  // Detect form existence (subscription/contact forms)
  const forms = $('form');
  results.hasForms = forms.length > 0;

  // Detect phone links
  const phoneLinks = $('a[href^="tel:"]');
  results.hasPhone = phoneLinks.length > 0;

  // Detect email links
  const emailLinks = $('a[href^="mailto:"]');
  results.hasEmail = emailLinks.length > 0;

  return { results };
}

module.exports = { analyze };