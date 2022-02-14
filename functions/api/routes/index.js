const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth'));
router.use('/user', require('./user'));
router.use('/clinic', require('./clinic'));
router.use('/review', require('./review'));

module.exports = router;
