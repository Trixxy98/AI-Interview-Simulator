const express = require('express');
const router = express.Router();
const { getAnalytics } = require('../controllers/report.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.use(verifyToken);

router.get('/me/analytics', getAnalytics);

module.exports = router;