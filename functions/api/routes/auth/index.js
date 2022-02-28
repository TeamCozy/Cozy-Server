const express = require('express');
const router = express.Router();

router.post('/register', require('./authSignupPOST'));

module.exports = router;