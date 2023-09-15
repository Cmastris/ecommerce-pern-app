const express = require('express');
const router = express.Router();

// https://www.npmjs.com/package/swagger-ui-express
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../documentation/api-spec.json');

router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(swaggerDocument));

module.exports = router;