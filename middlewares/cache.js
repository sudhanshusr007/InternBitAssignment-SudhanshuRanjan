const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 300 }); // Cache expires in 5 minutes
module.exports = cache;
