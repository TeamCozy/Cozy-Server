const express = require('express');
const router = express.Router();

router.get('/', require('./clinicAllGET'));
router.get('/search', require('./clinicSearchGET'));
router.get('/:clinicId', require('./clinicOneGET'));

module.exports = router;
