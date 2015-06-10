'use strict';

var path = require('path');

module.exports = {
  // Set default node environment to development
  env: process.env.NODE_ENV || 'development',

  // Root path of server
  root: path.normalize(__dirname + '/../../..'),

  // Server port for Evaluator/Consumer
  evaluatorPort: process.env.PORT || 9000,

  // Server host for Evaluator/Consumer
  evaluatorHost: process.env.HOST || 'localhost',

  // Poll frequency for job processing
  pollFrequency: 10,

  // Server port for Generator/Producer
  generatorPort: process.env.GENERATOR_PORT || 8000,

  // Server port for Generator/Producer
  generatorHost: process.env.GENERATOR_HOST || 'localhost',
};
