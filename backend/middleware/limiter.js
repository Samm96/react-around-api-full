const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100, // IP: 100 per 'window' (per 15 mins)
  standardHeaders: true, // Return rate limit info in the 'RateLimit-*' headers
  legacyHeaders: false, // Disable the 'X-RateLimit-*' headers
});

module.exports = limiter;

// more info on this: https://www.npmjs.com/package/express-rate-limit
