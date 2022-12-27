const express = require('express');
const router = express.Router();

router.post('/', require('./authSignupPOST'));
router.post('/social', require('./authSocialLoginPOST'));
router.put('/', require('./authSignupPUT'));

module.exports = router;
