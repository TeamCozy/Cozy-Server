const express = require('express');
const router = express.Router();

router.post('/', require('./reviewPOST'));
router.delete('/:reviewId', require('./reviewDELETE'));
router.get('/', require('./reviewGET'));

module.exports = router;
