const express = require('express');
const router = express.Router();

router.post('/', require('./authSignupPOST'));

module.exports = router;