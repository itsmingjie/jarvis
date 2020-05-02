const config = require('../config');
const Airtable = require('airtable');
const base = new Airtable({apiKey: config.AIRTABLE_KEY}).base(config.AIRTABLE_BASE);

module.exports = base;