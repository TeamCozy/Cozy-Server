const express = require('express');
const router = express.Router();

router.post('/myInfo', require('./userInfoGET'));

module.exports = router;