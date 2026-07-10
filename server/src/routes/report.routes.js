const express = require('express');
const router = express.Router();
const { createReport, getReport, getAnalytics } = require('../controllers/report.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.use(verifyToken);

router.post('/interviews/:id/report', createReport);
router.get('/:id', getReport);

module.exports = router;