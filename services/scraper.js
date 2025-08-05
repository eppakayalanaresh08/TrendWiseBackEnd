// // const puppeteer = require('puppeteer-extra');
// // const StealthPlugin = require('puppeteer-extra-plugin-stealth');
// // const cheerio = require('cheerio');

// // // Add stealth plugin to avoid detection
// // puppeteer.use(StealthPlugin());

// // // Cache to avoid duplicate scraping
// // const cache = new Map();
// // const CACHE_TTL = 60 * 60 * 1000; // 1 hour cache

// // /**
// //  * Scrape Google Trends for current trending topics
// //  * @returns {Promise<Array<string>>} Array of trending topics
// //  */
// // exports.scrapeTrendingTopics = async () => {
// //   try {
// //     const cacheKey = 'google-trends';
// //     const cached = cache.get(cacheKey);
    
// //     // Return cached data if available
// //     if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
// //       return cached.data;
// //     }

// //     console.log('Launching browser for scraping...');
// //     const browser = await puppeteer.launch({
// //       headless: true,
// //       args: [
// //         '--no-sandbox',
// //         '--disable-setuid-sandbox',
// //         '--disable-dev-shm-usage'
// //       ]
// //     });

// //     const page = await browser.newPage();
    
// //     // Set realistic browser headers
// //     await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
// //     await page.setExtraHTTPHeaders({
// //       'Accept-Language': 'en-US,en;q=0.9'
// //     });

// //     // Navigate to Google Trends
// //     await page.goto('https://trends.google.com/trends/trendingsearches/daily?geo=US', {
// //       waitUntil: 'networkidle2',
// //       timeout: 30000
// //     });

// //     // Wait for the content to load
// //     await page.waitForSelector('.details-top', { timeout: 15000 });

// //     // Get page content and parse with Cheerio
// //     const content = await page.content();
// //     const $ = cheerio.load(content);
// //     const trends = [];

// //     // Extract trending items
// //     $('.details-top').each((i, el) => {
// //       const title = $(el).find('a').first().text().trim();
// //       if (title) trends.push(title);
// //     });

// //     await browser.close();

// //     // Filter and normalize results
// //     const filteredTrends = trends
// //       .filter(t => t.length > 3 && !t.includes('...'))
// //       .slice(0, 10); // Limit to top 10

// //     // Update cache
// //     cache.set(cacheKey, {
// //       timestamp: Date.now(),
// //       data: filteredTrends
// //     });

// //     return filteredTrends;
// //   } catch (err) {
// //     console.error('Scraping failed:', err);
// //     // Fallback to cached data if available
// //     const cached = cache.get('google-trends');
// //     return cached?.data || [];
// //   }
// // };

// // /**
// //  * Scrape Wikipedia for topic summary
// //  * @param {string} topic - Topic to research
// //  * @returns {Promise<string>} Summary text
// //  */
// // exports.scrapeWikipediaSummary = async (topic) => {
// //   try {
// //     const browser = await puppeteer.launch({ headless: 'new' });
// //     const page = await browser.newPage();
    
// //     await page.goto(`https://en.wikipedia.org/wiki/${encodeURIComponent(topic)}`, {
// //       waitUntil: 'domcontentloaded'
// //     });

// //     const summary = await page.$eval('#mw-content-text .mw-parser-output > p', el => 
// //       el.textContent.replace(/\[\d+\]/g, '').trim()
// //     );

// //     await browser.close();
// //     return summary || '';
// //   } catch (err) {
// //     console.error('Wikipedia scrape failed:', err);
// //     return '';
// //   }
// // };




// const puppeteer = require('puppeteer-extra');
// const StealthPlugin = require('puppeteer-extra-plugin-stealth');
// const cheerio = require('cheerio');
// const logger = require('../utils/logger');

// // Add stealth plugin to avoid detection
// puppeteer.use(StealthPlugin());

// // Cache to avoid duplicate scraping
// const cache = new Map();
// const CACHE_TTL = 60 * 60 * 1000; // 1 hour cache

// /**
//  * Scrape Google Trends for current trending topics
//  * @returns {Promise<Array<string>>} Array of trending topics
//  */
// exports.scrapeTrendingTopics = async () => {
//   try {
//     const cacheKey = 'google-trends';
//     const cached = cache.get(cacheKey);
    
//     // Return cached data if available
//     if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
//       logger.info('Returning cached trending topics');
//       return cached.data;
//     }

//     logger.info('Launching browser for scraping...');
//     const browser = await puppeteer.launch({
//       headless: true,
//       args: [
//         '--no-sandbox',
//         '--disable-setuid-sandbox',
//         '--disable-dev-shm-usage'
//       ]
//     });

//     const page = await browser.newPage();
    
//     // Set realistic browser headers
//     await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
//     await page.setExtraHTTPHeaders({
//       'Accept-Language': 'en-US,en;q=0.9'
//     });

//     // Navigate to Google Trends
//     await page.goto('https://trends.google.com/trends/trendingsearches/daily?geo=US', {
//       waitUntil: 'networkidle2',
//       timeout: 30000
//     });

//     // Wait for the content to load
//     await page.waitForSelector('.details-top', { timeout: 15000 });

//     // Get page content and parse with Cheerio
//     const content = await page.content();
//     const $ = cheerio.load(content);
//     const trends = [];

//     // Extract trending items
//     $('.details-top').each((i, el) => {
//       const title = $(el).find('a').first().text().trim();
//       if (title) trends.push(title);
//     });

//     await browser.close();

//     // Filter and normalize results
//     const filteredTrends = trends
//       .filter(t => t.length > 3 && !t.includes('...'))
//       .slice(0, 10); // Limit to top 10

//     logger.info(`Scraped ${filteredTrends.length} trending topics`);

//     // Update cache
//     cache.set(cacheKey, {
//       timestamp: Date.now(),
//       data: filteredTrends
//     });

//     return filteredTrends;
//   } catch (err) {
//     logger.error(`Scraping failed: ${err.message}`);
//     // Fallback to cached data if available
//     const cached = cache.get('google-trends');
//     return cached?.data || [];
//   }
// };

// /**
//  * Scrape Wikipedia for topic summary
//  * @param {string} topic - Topic to research
//  * @returns {Promise<string>} Summary text
//  */
// exports.scrapeWikipediaSummary = async (topic) => {
//   try {
//     const browser = await puppeteer.launch({ headless: 'new' });
//     const page = await browser.newPage();
    
//     await page.goto(`https://en.wikipedia.org/wiki/${encodeURIComponent(topic)}`, {
//       waitUntil: 'domcontentloaded'
//     });

//     const summary = await page.$eval('#mw-content-text .mw-parser-output > p', el => 
//       el.textContent.replace(/\[\d+\]/g, '').trim()
//     );

//     await browser.close();
//     return summary || '';
//   } catch (err) {
//     logger.error(`Wikipedia scrape failed for ${topic}: ${err.message}`);
//     return '';
//   }
// };

// /**
//  * Scrape Twitter for trending hashtags
//  * @returns {Promise<Array<string>>} Array of trending hashtags
//  */
// exports.scrapeTwitterTrends = async () => {
//   try {
//     const browser = await puppeteer.launch({ headless: true });
//     const page = await browser.newPage();
    
//     await page.goto('https://twitter.com/explore/tabs/trending', {
//       waitUntil: 'networkidle2',
//       timeout: 30000
//     });

//     await page.waitForSelector('[data-testid="trend"]', { timeout: 10000 });
    
//     const trends = await page.$$eval('[data-testid="trend"]', elements => 
//       elements.map(el => {
//         const text = el.querySelector('div:nth-child(2) > div:nth-child(1)')?.textContent;
//         return text ? text.replace(/#/g, '').trim() : null;
//       }).filter(Boolean)
//     );

//     await browser.close();
//     return trends.slice(0, 10);
//   } catch (err) {
//     logger.error(`Twitter scrape failed: ${err.message}`);
//     return [];
//   }
// };





// const puppeteer = require('puppeteer-extra');
// const StealthPlugin = require('puppeteer-extra-plugin-stealth');
// const cheerio = require('cheerio');
// const logger = require('../utils/logger');

// // Add stealth plugin to avoid detection
// puppeteer.use(StealthPlugin());

// // Cache to avoid duplicate scraping
// const cache = new Map();
// const CACHE_TTL = 60 * 60 * 1000; // 1 hour cache

// /**
//  * Scrape Google Trends for current trending topics
//  * @returns {Promise<Array<string>>} Array of trending topics
//  */
// exports.scrapeTrendingTopics = async () => {
//   try {
//     const cacheKey = 'google-trends';
//     const cached = cache.get(cacheKey);
    
//     // Return cached data if available
//     if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
//       logger.info('Returning cached trending topics');
//       return cached.data;
//     }

//     logger.info('Launching browser for scraping...');
//     const browser = await puppeteer.launch({
//       headless: true,
//       args: [
//         '--no-sandbox',
//         '--disable-setuid-sandbox',
//         '--disable-dev-shm-usage',
//         '--disable-web-security',
//         '--disable-features=IsolateOrigins,site-per-process'
//       ]
//     });

//     const page = await browser.newPage();
    
//     // Set realistic browser headers
//     await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36');
//     await page.setExtraHTTPHeaders({
//       'Accept-Language': 'en-US,en;q=0.9',
//       'Accept-Encoding': 'gzip, deflate, br'
//     });

//     // Set geolocation to US
//     await page.setGeolocation({ latitude: 37.0902, longitude: -95.7129 });

//     // Navigate to Google Trends
//     await page.goto('https://trends.google.com/trends/trendingsearches/daily?geo=US', {
//       waitUntil: 'networkidle2',
//       timeout: 60000  // Increased timeout
//     });

//     // Check for CAPTCHA
//     if (await page.$('#captcha-form')) {
//       logger.error('CAPTCHA encountered during scraping');
//       throw new Error('Google is showing CAPTCHA. Cannot scrape trends.');
//     }

//     // Wait for content with multiple selector options
//     try {
//       await Promise.any([
//         page.waitForSelector('div[aria-label*="trending"]', { timeout: 30000 }),
//         page.waitForSelector('.feed-item', { timeout: 30000 }),
//         page.waitForSelector('.details-top', { timeout: 30000 })
//       ]);
//     } catch (err) {
//       logger.error('All selectors failed, taking debug screenshot');
//       await page.screenshot({ path: 'trends-error.png' });
//       throw new Error('Failed to find trending content elements');
//     }

//     // Get page content and parse with Cheerio
//     const content = await page.content();
//     const $ = cheerio.load(content);
//     const trends = [];

//     // Extract trending items using multiple selectors
//     $('div[aria-label*="trending"], .feed-item, .details-top').each((i, el) => {
//       const titleElement = $(el).find('a').first().length ? $(el).find('a').first() : $(el).find('.title');
//       const title = titleElement.text().trim();
      
//       if (title && title.length > 3 && !title.includes('...')) {
//         trends.push(title);
//       }
//     });

//     await browser.close();

//     // Filter duplicates and limit to top 10
//     const uniqueTrends = [...new Set(trends)].slice(0, 10);
//     logger.info(`Scraped ${uniqueTrends.length} trending topics`);

//     // Update cache
//     cache.set(cacheKey, {
//       timestamp: Date.now(),
//       data: uniqueTrends
//     });

//     return uniqueTrends;
//   } catch (err) {
//     logger.error(`Scraping failed: ${err.message}`);
    
//     // Fallback to cached data if available
//     const cached = cache.get('google-trends');
//     if (cached) {
//       logger.info('Returning cached trends due to error');
//       return cached.data;
//     }
    
//     // Return sample data if no cache
//     logger.warn('No cached data available, returning sample trends');
//     return [
//       'Artificial Intelligence',
//       'Climate Change',
//       'Stock Market',
//       'Olympics 2024',
//       'Space Exploration',
//       'Electric Vehicles',
//       'Cryptocurrency',
//       'Quantum Computing',
//       'Sustainable Energy',
//       'Global Economy'
//     ];
//   }
// };















// const axios = require('axios');
// const logger = require('../utils/logger');

// // Cache to avoid duplicate scraping
// const cache = new Map();
// const CACHE_TTL = 60 * 60 * 1000; // 1 hour cache

// /**
//  * Scrape Google Trends for current trending topics using API
//  * @returns {Promise<Array<string>>} Array of trending topics
//  */
// exports.scrapeTrendingTopics = async () => {
//   const cacheKey = 'google-trends';
//   try {
//     // Return cached data if available
//     if (cache.has(cacheKey) {
//       const cached = cache.get(cacheKey);
//       if (Date.now() - cached.timestamp < CACHE_TTL) {
//         logger.info('Returning cached trending topics');
//         return cached.data;
//       }
//     }

//     logger.info('Fetching Google Trends via API...');
//     const response = await axios.get(
//       'https://trends.google.com/trends/api/dailytrends',
//       {
//         params: {
//           geo: 'US',
//           hl: 'en-US',
//           tz: '-240',
//           ns: 15
//         },
//         headers: {
//           'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
//           'Accept-Language': 'en-US,en;q=0.9',
//           'Referer': 'https://trends.google.com/trends/trendingsearches/daily'
//         },
//         timeout: 10000
//       }
//     );

//     // Clean and parse the response
//     const jsonData = response.data.replace(/^\)\]\}'\n/, '');
//     const parsedData = JSON.parse(jsonData);
    
//     // Extract trending search queries
//     const trends = parsedData.default.trendingSearchesDays[0].trendingSearches.map(
//       item => item.title.query
//     );

//     // Update cache
//     const dataToCache = trends.slice(0, 10);
//     cache.set(cacheKey, {
//       timestamp: Date.now(),
//       data: dataToCache
//     });

//     logger.info(`Fetched ${dataToCache.length} trending topics`);
//     return dataToCache;
//   } catch (err) {
//     logger.error(`Google Trends API failed: ${err.message}`);
    
//     // Fallback to cached data if available
//     if (cache.has(cacheKey)) {
//       const cached = cache.get(cacheKey);
//       logger.info('Returning cached trends due to error');
//       return cached.data;
//     }
    
//     // Return sample data if no cache
//     logger.warn('No cached data available, returning sample trends');
//     return [
//       'Artificial Intelligence',
//       'Climate Change',
//       'Stock Market',
//       'Olympics 2024',
//       'Space Exploration',
//       'Electric Vehicles',
//       'Cryptocurrency',
//       'Quantum Computing',
//       'Sustainable Energy',
//       'Global Economy'
//     ];
//   }
// };

// /**
//  * Scrape Wikipedia for topic summary using REST API
//  * @param {string} topic - Topic to research
//  * @returns {Promise<string>} Summary text
//  */
// exports.scrapeWikipediaSummary = async (topic) => {
//   try {
//     const response = await axios.get(
//       'https://en.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(topic),
//       {
//         headers: {
//           'User-Agent': 'TrendWiseBot/1.0 (https://example.com; contact@example.com)'
//         },
//         timeout: 5000
//       }
//     );
    
//     return response.data.extract || '';
//   } catch (err) {
//     if (err.response && err.response.status === 404) {
//       logger.warn(`Wikipedia page not found for topic: ${topic}`);
//     } else {
//       logger.error(`Wikipedia API error for ${topic}: ${err.message}`);
//     }
//     return '';
//   }
// };

// /**
//  * Scrape Twitter for trending hashtags
//  * @returns {Promise<Array<string>>} Array of trending hashtags
//  */
// exports.scrapeTwitterTrends = async () => {
//   try {
//     // This is a placeholder - actual implementation would require proper scraping
//     logger.warn('Twitter scraping not implemented yet');
//     return [];
//   } catch (err) {
//     logger.error(`Twitter scrape failed: ${err.message}`);
//     return [];
//   }
// };





const axios = require('axios');
const logger = require('../utils/logger');

// Cache to avoid duplicate scraping
const cache = new Map();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour cache

/**
 * Scrape Google Trends for current trending topics using API
 * @returns {Promise<Array<string>>} Array of trending topics
 */
exports.scrapeTrendingTopics = async () => {
  const cacheKey = 'google-trends';
  try {
    // Return cached data if available
    if (cache.has(cacheKey)) {  // FIXED: Added missing closing parenthesis
      const cached = cache.get(cacheKey);
      if (Date.now() - cached.timestamp < CACHE_TTL) {
        logger.info('Returning cached trending topics');
        return cached.data;
      }
    }

    logger.info('Fetching Google Trends via API...');
    const response = await axios.get(
      'https://trends.google.com/trends/api/dailytrends',
      {
        params: {
          geo: 'US',
          hl: 'en-US',
          tz: '-240',
          ns: 15
        },
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
          'Accept-Language': 'en-US,en;q=0.9',
          'Referer': 'https://trends.google.com/trends/trendingsearches/daily'
        },
        timeout: 10000
      }
    );

    // Clean and parse the response
    const jsonData = response.data.replace(/^\)\]\}'\n/, '');
    const parsedData = JSON.parse(jsonData);
    
    // Extract trending search queries
    const trends = parsedData.default.trendingSearchesDays[0].trendingSearches.map(
      item => item.title.query
    );

    // Update cache
    const dataToCache = trends.slice(0, 10);
    cache.set(cacheKey, {
      timestamp: Date.now(),
      data: dataToCache
    });

    logger.info(`Fetched ${dataToCache.length} trending topics`);
    return dataToCache;
  } catch (err) {
    logger.error(`Google Trends API failed: ${err.message}`);
    
    // Fallback to cached data if available
    if (cache.has(cacheKey)) {  // FIXED: Added missing closing parenthesis
      const cached = cache.get(cacheKey);
      logger.info('Returning cached trends due to error');
      return cached.data;
    }
    
    // Return sample data if no cache
    logger.warn('No cached data available, returning sample trends');
    return [
      'Artificial Intelligence',
      'Climate Change',
      'Stock Market',
      'Olympics 2024',
      'Space Exploration',
      'Electric Vehicles',
      'Cryptocurrency',
      'Quantum Computing',
      'Sustainable Energy',
      'Global Economy'
    ];
  }
};

/**
 * Scrape Wikipedia for topic summary using REST API
 * @param {string} topic - Topic to research
 * @returns {Promise<string>} Summary text
 */
exports.scrapeWikipediaSummary = async (topic) => {
  try {
    const response = await axios.get(
      'https://en.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(topic),
      {
        headers: {
          'User-Agent': 'TrendWiseBot/1.0 (https://example.com; contact@example.com)'
        },
        timeout: 5000
      }
    );
    
    return response.data.extract || '';
  } catch (err) {
    if (err.response && err.response.status === 404) {
      logger.warn(`Wikipedia page not found for topic: ${topic}`);
    } else {
      logger.error(`Wikipedia API error for ${topic}: ${err.message}`);
    }
    return '';
  }
};

/**
 * Scrape Twitter for trending hashtags
 * @returns {Promise<Array<string>>} Array of trending hashtags
 */
exports.scrapeTwitterTrends = async () => {
  try {
    // This is a placeholder - actual implementation would require proper scraping
    logger.warn('Twitter scraping not implemented yet');
    return [];
  } catch (err) {
    logger.error(`Twitter scrape failed: ${err.message}`);
    return [];
  }
};



// Add this to services/scraper.js
exports.searchUnsplashImages = async (query) => {
  try {
    const response = await axios.get('https://api.unsplash.com/search/photos', {
      params: {
        query,
        per_page: 3,
        client_id: process.env.UNSPLASH_ACCESS_KEY
      }
    });
    return response.data.results.map(img => img.urls.regular);
  } catch (err) {
    logger.error(`Unsplash API error: ${err.message}`);
    return [];
  }
};