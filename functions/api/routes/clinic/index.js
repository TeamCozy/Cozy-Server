const express = require('express');
const router = express.Router();

router.get('/', require('./clinicAllGET'));
router.get('/search', require('./clinicSearchGET'));

module.exports = router;
