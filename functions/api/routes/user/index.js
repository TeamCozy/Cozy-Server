const express = require('express');
const router = express.Router();

router.post('/info', require('./userInfoGET'));
router.delete('/userDelete', require('./userDELETE'));
module.exports = router;
