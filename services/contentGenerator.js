// const OpenAI = require('openai').default;
// const { scrapeWikipediaSummary } = require('./scraper');

// // Initialize OpenAI with API key from environment variables
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY
// });

// /**
//  * Generates SEO-optimized article content using ChatGPT
//  * @param {string} topic - The topic to generate content about
//  * @returns {Promise<Object>} - Returns generated content with metadata
//  */
// exports.generateSEOContent = async (topic) => {
//   // Default fallback response
//   const fallbackResponse = {
//     title: `${topic} - Comprehensive Analysis`,
//     metaDescription: `Learn all about ${topic} in this detailed article.`,
//     keywords: [topic.toLowerCase(), 'trending', 'analysis'],
//     body: `# ${topic}\n\nThis article provides an in-depth look at ${topic}.`,
//     images: [`${topic} illustration`, `${topic} infographic`],
//     videos: [`${topic} explained`, `Recent developments in ${topic}`]
//   };

//   try {
//     // 1. Get factual context from Wikipedia
//     const wikiContext = await scrapeWikipediaSummary(topic);
    
//     // 2. Prepare the AI prompt
//     const prompt = `
//     Generate a comprehensive, SEO-optimized article about "${topic}".
//     ${wikiContext ? `Context: ${wikiContext}` : ''}
    
//     Requirements:
//     - Word count: 800-1000 words
//     - Use markdown formatting (H2, H3, bullet points)
//     - SEO-optimized title (max 60 chars)
//     - Meta description (max 160 chars)
//     - 5-7 relevant keywords
//     - Suggest 2-3 relevant image concepts
//     - Include 1-2 relevant YouTube video ideas
    
//     Output format (strict JSON):
//     {
//       "title": "SEO Title Here",
//       "metaDescription": "Description here...",
//       "keywords": ["kw1", "kw2"],
//       "body": "Full article in markdown...",
//       "imageConcepts": ["concept1", "concept2"],
//       "videoIdeas": ["idea1", "idea2"]
//     }
//     `;

//     // 3. Call OpenAI API
//     const response = await openai.chat.completions.create({
//       model: "gpt-4-1106-preview", // Latest GPT-4 Turbo model
//       response_format: { type: "json_object" },
//       messages: [
//         { 
//           role: "system", 
//           content: "You are a professional content writer specializing in SEO-optimized articles. Always return valid JSON." 
//         },
//         { 
//           role: "user", 
//           content: prompt 
//         }
//       ],
//       temperature: 0.7,
//       max_tokens: 4000
//     });

//     // 4. Parse and validate the response
//     const content = response.choices[0]?.message?.content;
//     if (!content) throw new Error('No content generated');

//     let generatedContent;
//     try {
//       generatedContent = JSON.parse(content);
//     } catch (e) {
//       throw new Error('Invalid JSON response from AI');
//     }

//     // 5. Validate required fields
//     if (!generatedContent.title || !generatedContent.body) {
//       throw new Error('Incomplete article generated');
//     }

//     // 6. Return structured response
//     return {
//       title: generatedContent.title,
//       metaDescription: generatedContent.metaDescription || 
//         `Learn about ${generatedContent.title} in this comprehensive guide.`,
//       keywords: generatedContent.keywords || 
//         [topic.toLowerCase(), 'guide', 'analysis'],
//       body: generatedContent.body,
//       images: generatedContent.imageConcepts || 
//         [`${topic} featured image`, `${topic} header image`],
//       videos: generatedContent.videoIdeas || 
//         [`${topic} documentary`, `${topic} news coverage`]
//     };

//   } catch (error) {
//     console.error('Content generation error:', error.message);
    
//     // Return fallback content with error information
//     return {
//       ...fallbackResponse,
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined,
//       body: `${fallbackResponse.body}\n\n[Content generation failed: ${error.message}]`
//     };
//   }
// };

// /**
//  * Batch generate articles for multiple topics
//  * @param {Array<string>} topics - Array of topics
//  * @returns {Promise<Array<Object>>} - Array of generated articles
//  */
// exports.batchGenerateArticles = async (topics) => {
//   const generations = topics.map(topic => 
//     this.generateSEOContent(topic)
//       .catch(err => {
//         console.error(`Failed to generate content for ${topic}:`, err);
//         return {
//           topic,
//           error: err.message,
//           ...fallbackResponse
//         };
//       })
//   );
  
//   return Promise.all(generations);
// };

// // Fallback response template
// const fallbackResponse = {
//   title: '',
//   metaDescription: '',
//   keywords: [],
//   body: '',
//   images: [],
//   videos: [],
//   error: null
// };





// const { OpenAI } = require('openai');
// const { scrapeWikipediaSummary } = require('./scraper');
// const logger = require('../utils/logger');

// // Initialize OpenAI client
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY
// });

// // Rate limiter to avoid exceeding API limits
// const MAX_REQUESTS_PER_MINUTE = 3;
// const requestQueue = [];
// let lastRequestTime = 0;

// /**
//  * Rate-limited API request handler
//  */
// async function rateLimitedRequest(requestFn) {
//   const now = Date.now();
//   const timeSinceLast = now - lastRequestTime;
  
//   // Enforce minimum 20 seconds between requests
//   if (timeSinceLast < 20000) {
//     const delay = 20000 - timeSinceLast;
//     await new Promise(resolve => setTimeout(resolve, delay));
//   }
  
//   try {
//     const result = await requestFn();
//     lastRequestTime = Date.now();
//     return result;
//   } catch (err) {
//     logger.error(`API request failed: ${err.message}`);
//     throw err;
//   }
// }

// /**
//  * Generate SEO-optimized article using ChatGPT
//  * @param {string} topic - Article topic
//  * @returns {Promise<Object>} Generated content with metadata
//  */
// exports.generateSEOContent = async (topic) => {
//   // Default fallback response
//   const fallbackResponse = {
//     title: `${topic} - Comprehensive Analysis`,
//     metaDescription: `Learn all about ${topic} in this detailed article.`,
//     keywords: [topic.toLowerCase(), 'trending', 'analysis'],
//     body: `# ${topic}\n\nThis article provides an in-depth look at ${topic}.`,
//     images: [`${topic} illustration`, `${topic} infographic`],
//     videos: [`${topic} explained`, `Recent developments in ${topic}`]
//   };

//   try {
//     // 1. Get factual context from Wikipedia
//     const wikiContext = await scrapeWikipediaSummary(topic);
    
//     // 2. Prepare the AI prompt
//     const prompt = `
//     Generate a comprehensive, SEO-optimized article about "${topic}".
//     ${wikiContext ? `Context: ${wikiContext}` : ''}
    
//     Requirements:
//     - Word count: 800-1000 words
//     - Use markdown formatting (H2, H3, bullet points)
//     - SEO-optimized title (max 60 chars)
//     - Meta description (max 160 chars)
//     - 5-7 relevant keywords
//     - Suggest 2-3 relevant image concepts
//     - Include 1-2 relevant YouTube video ideas
    
//     Output format (strict JSON):
//     {
//       "title": "SEO Title Here",
//       "metaDescription": "Description here...",
//       "keywords": ["kw1", "kw2"],
//       "body": "Full article in markdown...",
//       "imageConcepts": ["concept1", "concept2"],
//       "videoIdeas": ["idea1", "idea2"]
//     }
//     `;

//     // 3. Call OpenAI API with rate limiting
//     const response = await rateLimitedRequest(() => 
//       openai.chat.completions.create({
//         model: "gpt-4-1106-preview", // Latest GPT-4 Turbo model
//         response_format: { type: "json_object" },
//         messages: [
//           { 
//             role: "system", 
//             content: "You are a professional content writer specializing in SEO-optimized articles. Always return valid JSON." 
//           },
//           { 
//             role: "user", 
//             content: prompt 
//           }
//         ],
//         temperature: 0.7,
//         max_tokens: 4000
//       })
//     );

//     // 4. Parse and validate the response
//     const content = response.choices[0]?.message?.content;
//     if (!content) throw new Error('No content generated');

//     let generatedContent;
//     try {
//       generatedContent = JSON.parse(content);
//     } catch (e) {
//       throw new Error('Invalid JSON response from AI');
//     }

//     // 5. Validate required fields
//     if (!generatedContent.title || !generatedContent.body) {
//       throw new Error('Incomplete article generated');
//     }

//     // 6. Return structured response
//     return {
//       title: generatedContent.title,
//       metaDescription: generatedContent.metaDescription || 
//         `Learn about ${generatedContent.title} in this comprehensive guide.`,
//       keywords: generatedContent.keywords || 
//         [topic.toLowerCase(), 'guide', 'analysis'],
//       body: generatedContent.body,
//       images: generatedContent.imageConcepts || 
//         [`${topic} featured image`, `${topic} header image`],
//       videos: generatedContent.videoIdeas || 
//         [`${topic} documentary`, `${topic} news coverage`]
//     };

//   } catch (error) {
//     logger.error(`Content generation for "${topic}" failed: ${error.message}`);
    
//     // Return fallback content with error information
//     return {
//       ...fallbackResponse,
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined,
//       body: `${fallbackResponse.body}\n\n[Content generation failed: ${error.message}]`
//     };
//   }
// };

// /**
//  * Generate multiple articles in batch
//  * @param {Array<string>} topics - Array of topics
//  * @returns {Promise<Array<Object>>} Generated articles
//  */
// exports.batchGenerateArticles = async (topics) => {
//   const generations = topics.map(topic => 
//     this.generateSEOContent(topic)
//       .catch(err => {
//         logger.error(`Failed to generate content for ${topic}: ${err.message}`);
//         return {
//           topic,
//           error: err.message,
//           ...fallbackResponse
//         };
//       })
//   );
  
//   return Promise.all(generations);
// };

// // Fallback response template
// const fallbackResponse = {
//   title: '',
//   metaDescription: '',
//   keywords: [],
//   body: '',
//   images: [],
//   videos: [],
//   error: null
// };


const { OpenAI } = require('openai');
const { scrapeWikipediaSummary } = require('./scraper');
const logger = require('../utils/logger');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Rate limiter to avoid exceeding API limits
const MAX_REQUESTS_PER_MINUTE = 3;
let lastRequestTime = 0;

/**
 * Rate-limited API request handler
 */
async function rateLimitedRequest(requestFn) {
  const now = Date.now();
  const timeSinceLast = now - lastRequestTime;
  
  // Enforce minimum 20 seconds between requests
  if (timeSinceLast < 20000) {
    const delay = 20000 - timeSinceLast;
    await new Promise(resolve => setTimeout(resolve, delay));
  }
  
  try {
    const result = await requestFn();
    lastRequestTime = Date.now();
    return result;
  } catch (err) {
    logger.error(`API request failed: ${err.message}`);
    throw err;
  }
}

/**
 * Generate SEO-optimized article using ChatGPT
 * @param {string} topic - Article topic
 * @returns {Promise<Object>} Generated content with metadata
 */
exports.generateSEOContent = async (topic) => {
  // Default fallback response
  const fallbackResponse = {
    title: `${topic} - Comprehensive Analysis`,
    metaDescription: `Learn all about ${topic} in this detailed article.`,
    keywords: [topic.toLowerCase(), 'trending', 'analysis'],
    body: `# ${topic}\n\nThis article provides an in-depth look at ${topic}.`,
    images: [],
    videos: []
  };

  try {
    // 1. Get factual context from Wikipedia
    let wikiContext = '';
    try {
      wikiContext = await scrapeWikipediaSummary(topic) || '';
      if (wikiContext) {
        logger.info(`Got Wikipedia context for ${topic}`);
      } else {
        logger.warn(`No Wikipedia context found for ${topic}`);
      }
    } catch (wikiErr) {
      logger.error(`Wikipedia failed for ${topic}: ${wikiErr.message}`);
    }

    // 2. Prepare the AI prompt
    const prompt = `
    Generate a comprehensive, SEO-optimized article about "${topic}".
    ${wikiContext ? `Context: ${wikiContext.substring(0, 1000)}` : ''}
    
    Requirements:
    - Word count: 800-1000 words
    - Use markdown formatting (H2, H3, bullet points)
    - SEO-optimized title (max 60 chars)
    - Meta description (max 160 chars)
    - 5-7 relevant keywords
    
    Output format (strict JSON):
    {
      "title": "SEO Title Here",
      "metaDescription": "Description here...",
      "keywords": ["kw1", "kw2"],
      "body": "Full article in markdown..."
    }
    `;

    // 3. Call OpenAI API with rate limiting
    const response = await rateLimitedRequest(() => 
      openai.chat.completions.create({
        model: "gpt-4-1106-preview",
        response_format: { type: "json_object" },
        messages: [
          { 
            role: "system", 
            content: `You are a professional content writer specializing in SEO-optimized articles. 
                      Always return valid JSON. Current date: ${new Date().toISOString().split('T')[0]}`
          },
          { 
            role: "user", 
            content: prompt 
          }
        ],
        temperature: 0.7,
        max_tokens: 3500
      })
    );

    // 4. Parse and validate the response
    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error('No content generated');

    let generatedContent;
    try {
      generatedContent = JSON.parse(content);
    } catch (e) {
      throw new Error(`Invalid JSON response from AI: ${content.substring(0, 100)}`);
    }

    // 5. Validate required fields
    if (!generatedContent.title || !generatedContent.body) {
      throw new Error('Incomplete article generated');
    }

    // 6. Return structured response
    return {
      title: generatedContent.title,
      metaDescription: generatedContent.metaDescription || 
        `Learn about ${generatedContent.title} in this comprehensive guide.`,
      keywords: generatedContent.keywords || 
        [topic.toLowerCase(), 'guide', 'analysis'],
      body: generatedContent.body,
      images: [],
      videos: []
    };

  } catch (error) {
    logger.error(`Content generation for "${topic}" failed: ${error.message}`);
    
    // Return fallback content with error information
    return {
      ...fallbackResponse,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      body: `${fallbackResponse.body}\n\n[Content generation failed: ${error.message}]`
    };
  }
};

/**
 * Generate multiple articles in batch
 * @param {Array<string>} topics - Array of topics
 * @returns {Promise<Array<Object>>} Generated articles
 */
exports.batchGenerateArticles = async (topics) => {
  const generations = [];
  
  for (const topic of topics) {
    try {
      // Add delay between generations to avoid rate limits
      if (generations.length > 0) {
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
      
      const article = await this.generateSEOContent(topic);
      generations.push({
        topic,
        ...article
      });
    } catch (err) {
      logger.error(`Failed to generate content for ${topic}: ${err.message}`);
      generations.push({
        topic,
        error: err.message,
        ...fallbackResponse(topic)
      });
    }
  }
  
  return generations;
};

/**
 * Fallback response generator
 */
function fallbackResponse(topic) {
  return {
    title: `${topic} - Comprehensive Analysis`,
    metaDescription: `Learn all about ${topic} in this detailed article.`,
    keywords: [topic.toLowerCase(), 'trending', 'analysis'],
    body: `# ${topic}\n\nThis article provides an in-depth look at ${topic}.`,
    images: [],
    videos: [],
    error: null
  };
}