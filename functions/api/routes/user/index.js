const express = require('express');
const router = express.Router();

router.post('/info', require('./userInfoGET'));

module.exports = router;