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
 * POST /analyze
 * Analyzes a given URL for speed, SEO, and CRO metrics
 */
router.post('/analyze', async (req, res) => {
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

    // Step 3: Run all analyzers (matching their actual signatures)
    const speedAnalysis = speedAnalyzer.analyze(html, $, headers);
    const seoAnalysis = seoAnalyzer.analyze(html, $);
    const croAnalysis = croAnalyzer.analyze(html, $);

    // Step 4: Generate timestamp
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);

    // Step 5: Generate the markdown report
    const report = reportGenerator.generate(
      speedAnalysis,
      seoAnalysis.results,
      croAnalysis.results,
      url,
      timestamp
    );

    // Step 6: Return success response
    return res.status(200).json({
      success: true,
      report
    });

  } catch (error) {
    // Handle specific error codes from fetcher
    if (error === 'INVALID_URL') {
      return res.status(400).json({
        success: false,
        error: 'Invalid URL format'
      });
    }

    if (error === 'TIMEOUT') {
      return res.status(504).json({
        success: false,
        error: 'Request timeout'
      });
    }

    if (error === 'FETCH_ERROR') {
      return res.status(502).json({
        success: false,
        error: 'Failed to fetch page'
      });
    }

    // Handle other errors
    console.error('Analysis error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

module.exports = router;