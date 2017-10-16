var db = require('mongoose');
var config = require('../../utilities/config.js')

/**
 * Mongoose configuration.
 */
db.connect(config.mongo, {
  useMongoClient: true,
});
db.connection.on('error', function() {
  console.error('✗ MongoDB Connection Error. Please make sure MongoDB is running.');
});
exports.db = db;
