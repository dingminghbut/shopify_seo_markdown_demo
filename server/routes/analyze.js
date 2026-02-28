const express = require('express');
const router = express.Router();
const cheerio = require('cheerio');

const fetcher = require('../services/fetcher');
const speedAnalyzer = require('../services/speedAnalyzer');
const seoAnalyzer = require('../services/seoAnalyzer');
const croAnalyzer = require('../services/croAnalyzer');
const reportGenerator = require('../services/reportGenerator');

/**
 * Validates if the given string is a valid URL starting with http:// or https://
 * @param {string} url - The URL to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function isValidUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * POST /api/analyze
 * Analyzes a given URL for speed, SEO, and CRO metrics
 */
router.post('/api/analyze', async (req, res) => {
  const { url } = req.body;

  // Validate URL format
  if (!url || typeof url !== 'string' || !isValidUrl(url)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid URL format'
    });
  }

  try {
    // Step 1: Fetch the page HTML and headers
    const { html, headers } = await fetcher.fetchPage(url);

    // Step 2: Load HTML with cheerio
    const $ = cheerio.load(html);

    // Step 3: Run all analyzers in parallel
    const [speedAnalysis, seoAnalysis, croAnalysis] = await Promise.all([
      speedAnalyzer.analyze(url, html, headers, $),
      seoAnalyzer.analyze(url, html, headers, $),
      croAnalyzer.analyze(url, html, headers, $)
    ]);

    // Step 4: Generate the markdown report
    const report = await reportGenerator.generate({
      url,
      speed: speedAnalysis,
      seo: seoAnalysis,
      cro: croAnalysis
    });

    // Step 5: Return success response
    return res.status(200).json({
      success: true,
      report
    });

  } catch (error) {
    // Handle timeout errors
    if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      return res.status(504).json({
        success: false,
        error: 'Request timeout'
      });
    }

    // Handle fetch failures (network errors, invalid URL response, etc.)
    return res.status(502).json({
      success: false,
      error: 'Failed to fetch page'
    });
  }
});

module.exports = router;