// Habilita o uso de módulos ES6 no Node.js e exporta o módulo 'sequelize-cli'
require = require('esm')(module);
module.exports = require('./node_modules/sequelize-cli/lib/sequelize').default;